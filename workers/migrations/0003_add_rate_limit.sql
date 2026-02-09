-- Migration: 0003_add_rate_limit.sql
-- Description: Add rate limiting table for auth endpoints

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    action TEXT NOT NULL,
    attempts INTEGER DEFAULT 1,
    first_attempt_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_attempt_at TEXT DEFAULT CURRENT_TIMESTAMP,
    blocked_until TEXT,
    ip_address TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(identifier, action)
);

-- Indexes for rate limiting
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked ON rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rate_limits_created ON rate_limits(created_at);
