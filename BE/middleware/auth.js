const jwt = require('jsonwebtoken');

const JWT_SECRET         = process.env.JWT_SECRET         || 'dev-access-secret-CHANGE-ME';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-CHANGE-ME';
const ACCESS_TOKEN_TTL   = process.env.ACCESS_TOKEN_TTL   || '15m';
const REFRESH_TOKEN_TTL  = process.env.REFRESH_TOKEN_TTL  || '30d';

/* ── token helpers ─────────────────────────────────────── */
function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

/* ── ROLES ─────────────────────────────────────────────── */
const ROLES = { CHILD: 0, ADMIN: 1, PARENT: 2 };

/* ── middleware ────────────────────────────────────────── */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Token expired'
      : 'Invalid token';
    return res.status(401).json({ message: msg, expired: err.name === 'TokenExpiredError' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

const checkAdmin = requireRole(ROLES.ADMIN);

module.exports = {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  ROLES,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyToken,
  requireRole,
  checkAdmin,
};
