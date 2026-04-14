import React, { useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import styles from './Profile.module.css';

const AVATARS = ['🐱','🐶','🦊','🐸','🦁','🐯','🐨','🦄','🐧','🐙','🦋','🐬','🦕','🤖','👾','🌟'];

const ROLE_LABELS = {
  [ROLES.CHILD]:  { label: 'Child',  emoji: '👶', color: '#4ecdc4' },
  [ROLES.PARENT]: { label: 'Parent', emoji: '👨‍👩‍👧', color: '#9b59b6' },
  [ROLES.ADMIN]:  { label: 'Admin',  emoji: '⚙️',  color: '#e74c3c' },
};

const SUBSCRIPTION_INFO = {
  free:    { label: 'Free',    emoji: '🆓', color: '#6c757d', next: 'premium' },
  premium: { label: 'Premium', emoji: '👑', color: '#f39c12', next: null },
};

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing]     = useState(false);
  const [displayName, setDN]      = useState(user?.display_name || user?.username || '');
  const [chosenAvatar, setAvatar] = useState(user?.avatar_emoji || '🐱');
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  if (!user) return null;

  const role  = ROLE_LABELS[user.role] ?? ROLE_LABELS[ROLES.CHILD];
  const sub   = SUBSCRIPTION_INFO[user.subscription] ?? SUBSCRIPTION_INFO.free;

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({ display_name: displayName, avatar_emoji: chosenAvatar });
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* ── Avatar ─────────────────────────────────── */}
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>{user.avatar_emoji || '🐱'}</div>
          <span className={styles.roleBadge} style={{ background: role.color }}>
            {role.emoji} {role.label}
          </span>
        </div>

        {/* ── Name ────────────────────────────────────── */}
        <h1 className={styles.name}>{user.display_name || user.username}</h1>
        <p className={styles.email}>{user.email}</p>

        {/* ── Subscription badge ──────────────────────── */}
        <div className={styles.subBadge} style={{ borderColor: sub.color, color: sub.color }}>
          {sub.emoji} {sub.label} Plan
        </div>

        {/* ── Stats row ───────────────────────────────── */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{user.total_score ?? 0}</span>
            <span className={styles.statLabel}>⭐ Total Score</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{user.games_played ?? 0}</span>
            <span className={styles.statLabel}>🎮 Games Played</span>
          </div>
        </div>

        {saved && <p className={styles.savedMsg}>✅ Profile saved!</p>}

        {/* ── Edit form ───────────────────────────────── */}
        {editing ? (
          <div className={styles.editSection}>
            <label className={styles.editLabel}>Display Name</label>
            <input
              className={styles.editInput}
              value={displayName}
              onChange={e => setDN(e.target.value)}
              maxLength={40}
              placeholder="Your display name"
            />

            <label className={styles.editLabel}>Choose Avatar</label>
            <div className={styles.avatarGrid}>
              {AVATARS.map(a => (
                <button
                  key={a}
                  className={`${styles.avatarOption} ${chosenAvatar === a ? styles.avatarSelected : ''}`}
                  onClick={() => setAvatar(a)}
                  type="button"
                >
                  {a}
                </button>
              ))}
            </div>

            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : '💾 Save'}
              </button>
              <button className={styles.cancelBtn} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className={styles.editBtn} onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>
        )}

        {/* ── Subscription upsell ─────────────────────── */}
        {user.subscription === 'free' && (
          <div className={styles.upsell}>
            <h3>👑 Upgrade to Premium</h3>
            <ul className={styles.upsellList}>
              <li>🎯 Unlock <strong>Hard</strong> difficulty for all games</li>
              <li>📊 Detailed progress reports</li>
              <li>👨‍👩‍👧 Link your child accounts (Parent plan)</li>
              <li>🏆 Leaderboard access</li>
            </ul>
            <button className={styles.upgradeBtn} onClick={() => alert('Subscription coming soon! 🚀')}>
              🚀 Upgrade Now
            </button>
          </div>
        )}

        <button className={styles.logoutBtn} onClick={logout}>
          👋 Logout
        </button>
      </div>
    </main>
  );
}
