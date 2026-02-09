-- Migration: Add notification tracking for chapter unlocks
-- Creates notifications table for unlock events

-- Notifications table for chapter unlock events
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'chapter_unlocked', 'chapter_completed', etc.
    title TEXT NOT NULL,
    message TEXT,
    data TEXT, -- JSON with chapter_id, cycle, etc.
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for unread notifications lookup
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);

-- Index for notification type filtering
CREATE INDEX IF NOT EXISTS idx_notifications_user_type ON notifications(user_id, type);
