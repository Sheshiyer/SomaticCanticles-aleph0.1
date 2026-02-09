-- Migration: Add Google OAuth support
-- Adds google_id column to users table for OAuth linking

-- Add column without UNIQUE constraint first
ALTER TABLE users ADD COLUMN google_id TEXT;

-- Create index for faster Google ID lookups
CREATE INDEX idx_users_google_id ON users(google_id);

-- Note: UNIQUE constraint needs to be added via table recreation if there are existing rows
-- For new databases, the constraint should be added in the initial schema
