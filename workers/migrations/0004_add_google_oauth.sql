-- Migration: Add Google OAuth support
-- Adds google_id column to users table for OAuth linking

ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE;

-- Create index for faster Google ID lookups
CREATE INDEX idx_users_google_id ON users(google_id);
