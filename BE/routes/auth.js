const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const db       = require('../database/dbSingleton').getConnection();
const {
  signAccessToken, signRefreshToken, verifyRefreshToken,
  verifyToken, ROLES,
} = require('../middleware/auth');

const SALT_ROUNDS   = 12;
const GOOGLE_CLIENT = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ── helpers ────────────────────────────────────────────── */
function publicUser(u) {
  const { password, refresh_token, rt_expires_at, ...pub } = u;
  return pub;
}

function rtExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d;
}

function issueTokens(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken  = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

function saveRefreshToken(userId, token, cb) {
  const hashedRt = bcrypt.hashSync(token, 4);
  db.query(
    'UPDATE users SET refresh_token = ?, rt_expires_at = ? WHERE id = ?',
    [hashedRt, rtExpiry(), userId],
    cb,
  );
}

/* ── POST /api/auth/register ────────────────────────────── */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!/^[a-zA-Z\s]{2,40}$/.test(username)) {
      return res.status(400).json({ error: 'Username must be 2–40 letters' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    db.query('SELECT id FROM users WHERE email = ?', [email], async (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (rows.length > 0) return res.status(409).json({ error: 'Email already in use' });

      const hashed    = await bcrypt.hash(password, SALT_ROUNDS);
      const userRole  = role === 'parent' ? ROLES.PARENT : ROLES.CHILD;

      db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)',
        [username, email, hashed, userRole],
        (err2, result) => {
          if (err2) return res.status(500).json({ error: 'DB error' });

          db.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err3, rows2) => {
            if (err3 || !rows2.length) return res.status(500).json({ error: 'DB error' });

            const user = rows2[0];
            const { accessToken, refreshToken } = issueTokens(user);
            saveRefreshToken(user.id, refreshToken, () => {});

            return res.status(201).json({
              user: publicUser(user),
              accessToken,
              refreshToken,
            });
          });
        },
      );
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ── POST /api/auth/login ───────────────────────────────── */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const { accessToken, refreshToken } = issueTokens(user);
    saveRefreshToken(user.id, refreshToken, (err2) => {
      if (err2) return res.status(500).json({ error: 'DB error' });
      return res.json({ user: publicUser(user), accessToken, refreshToken });
    });
  });
});

/* ── POST /api/auth/refresh ─────────────────────────────── */
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  db.query(
    'SELECT * FROM users WHERE id = ? AND rt_expires_at > NOW()',
    [decoded.id],
    async (err, rows) => {
      if (err || !rows.length) return res.status(401).json({ error: 'Session expired, please log in again' });

      const user = rows[0];
      if (!user.refresh_token) return res.status(401).json({ error: 'No active session' });

      const match = await bcrypt.compare(refreshToken, user.refresh_token);
      if (!match) return res.status(401).json({ error: 'Refresh token mismatch' });

      const { accessToken, refreshToken: newRt } = issueTokens(user);
      saveRefreshToken(user.id, newRt, (err2) => {
        if (err2) return res.status(500).json({ error: 'DB error' });
        return res.json({ accessToken, refreshToken: newRt });
      });
    },
  );
});

/* ── POST /api/auth/logout ──────────────────────────────── */
router.post('/logout', verifyToken, (req, res) => {
  db.query(
    'UPDATE users SET refresh_token = NULL, rt_expires_at = NULL WHERE id = ?',
    [req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      return res.json({ message: 'Logged out' });
    },
  );
});

/* ── POST /api/auth/google ──────────────────────────────── */
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Google credential required' });

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(501).json({ error: 'Google login is not configured on this server' });
  }

  try {
    const ticket = await GOOGLE_CLIENT.verifyIdToken({
      idToken:  credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    db.query('SELECT * FROM users WHERE google_id = ? OR email = ?', [googleId, email], (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });

      if (rows.length > 0) {
        const user = rows[0];
        if (!user.google_id) {
          db.query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, user.id], () => {});
        }
        const { accessToken, refreshToken } = issueTokens(user);
        saveRefreshToken(user.id, refreshToken, () => {});
        return res.json({ user: publicUser(user), accessToken, refreshToken });
      }

      db.query(
        'INSERT INTO users (username, email, google_id, role, display_name) VALUES (?,?,?,?,?)',
        [name || email.split('@')[0], email, googleId, ROLES.CHILD, name],
        (err2, result) => {
          if (err2) return res.status(500).json({ error: 'DB error' });
          db.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err3, rows2) => {
            if (err3 || !rows2.length) return res.status(500).json({ error: 'DB error' });
            const user = rows2[0];
            const { accessToken, refreshToken } = issueTokens(user);
            saveRefreshToken(user.id, refreshToken, () => {});
            return res.status(201).json({ user: publicUser(user), accessToken, refreshToken });
          });
        },
      );
    });
  } catch (e) {
    console.error('Google auth error:', e);
    res.status(401).json({ error: 'Google token verification failed' });
  }
});

/* ── GET /api/auth/me ───────────────────────────────────── */
router.get('/me', verifyToken, (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.user.id], (err, rows) => {
    if (err || !rows.length) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: publicUser(rows[0]) });
  });
});

/* ── PUT /api/auth/profile ──────────────────────────────── */
router.put('/profile', verifyToken, (req, res) => {
  const { display_name, avatar_emoji } = req.body;
  const allowed = /^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]{1}$/u;

  if (display_name && display_name.length > 40) {
    return res.status(400).json({ error: 'Display name too long' });
  }
  if (avatar_emoji && !allowed.test(avatar_emoji)) {
    return res.status(400).json({ error: 'Invalid emoji' });
  }

  db.query(
    'UPDATE users SET display_name = COALESCE(?, display_name), avatar_emoji = COALESCE(?, avatar_emoji) WHERE id = ?',
    [display_name || null, avatar_emoji || null, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      db.query('SELECT * FROM users WHERE id = ?', [req.user.id], (err2, rows) => {
        if (err2 || !rows.length) return res.status(500).json({ error: 'DB error' });
        return res.json({ user: publicUser(rows[0]) });
      });
    },
  );
});

/* ── POST /api/auth/score ───────────────────────────────── */
router.post('/score', verifyToken, (req, res) => {
  const { gameId, score, difficulty } = req.body;
  if (!gameId || score == null) return res.status(400).json({ error: 'gameId and score required' });

  const diff = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'easy';

  db.query(
    'INSERT INTO game_sessions (user_id, game_id, score, difficulty) VALUES (?,?,?,?)',
    [req.user.id, gameId, score, diff],
    (err) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      db.query(
        'UPDATE users SET total_score = total_score + ?, games_played = games_played + 1 WHERE id = ?',
        [score, req.user.id],
        (err2) => {
          if (err2) return res.status(500).json({ error: 'DB error' });
          return res.json({ message: 'Score saved' });
        },
      );
    },
  );
});

module.exports = router;
