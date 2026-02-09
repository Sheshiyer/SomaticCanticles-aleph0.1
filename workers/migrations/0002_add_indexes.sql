-- Migration: 0002_add_indexes.sql
-- Description: Add performance indexes and refresh_tokens table

-- Refresh tokens table for JWT authentication
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    revoked_at TEXT,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for refresh_tokens
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Additional indexes for query optimization
-- Composite index for user progress queries
CREATE INDEX IF NOT EXISTS idx_user_progress_user_chapter ON user_progress(user_id, chapter_id);

-- Index for streak lookups by type
CREATE INDEX IF NOT EXISTS idx_streaks_user_type ON streaks(user_id, streak_type);

-- Index for achievement type lookups
CREATE INDEX IF NOT EXISTS idx_achievements_user_type ON achievements(user_id, achievement_type);

-- Partial index for unverified users (useful for email campaigns)
CREATE INDEX IF NOT EXISTS idx_users_unverified ON users(email_verified) WHERE email_verified = 0;

-- Index for recently created users
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
