-- ============================================================
-- Migration v2 – JWT auth overhaul + profiles + subscriptions
-- Run ONCE against an existing gamedatabase schema
-- ============================================================

-- ── users: extend existing table ─────────────────────────
ALTER TABLE users
  MODIFY COLUMN role TINYINT NOT NULL DEFAULT 0 COMMENT '0=child,1=admin,2=parent',
  ADD COLUMN IF NOT EXISTS display_name  VARCHAR(100)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS avatar_emoji  VARCHAR(10)   DEFAULT '🐱',
  ADD COLUMN IF NOT EXISTS google_id     VARCHAR(128)  DEFAULT NULL UNIQUE,
  ADD COLUMN IF NOT EXISTS refresh_token TEXT          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS rt_expires_at DATETIME      DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS subscription  ENUM('free','premium') NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS sub_expires_at DATETIME     DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS total_score   INT           NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS games_played  INT           NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                       ON UPDATE CURRENT_TIMESTAMP;

-- ── parent_children: link parents to child accounts ──────
CREATE TABLE IF NOT EXISTS parent_children (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  parent_id  INT NOT NULL,
  child_id   INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pair (parent_id, child_id),
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (child_id)  REFERENCES users(id) ON DELETE CASCADE
);

-- ── game_sessions: per-game scoring history ───────────────
CREATE TABLE IF NOT EXISTS game_sessions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT         NOT NULL,
  game_id      VARCHAR(64) NOT NULL,
  score        INT         NOT NULL DEFAULT 0,
  difficulty   ENUM('easy','medium','hard') NOT NULL DEFAULT 'easy',
  completed_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_game (user_id, game_id)
);
