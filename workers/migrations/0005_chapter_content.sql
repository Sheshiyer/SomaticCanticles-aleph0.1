-- Migration: Add chapter content fields and user_progress updates
-- Adds JSON content fields to chapters table and enhances user_progress tracking

-- Add content JSON field to chapters table (stores intro, practice, reflection sections)
ALTER TABLE chapters ADD COLUMN content TEXT; -- JSON stored as TEXT in SQLite

-- Add unlock_conditions JSON field (stores biorhythm-based unlock criteria)
ALTER TABLE chapters ADD COLUMN unlock_conditions TEXT; -- JSON stored as TEXT

-- Add lore_metadata JSON field (stores symbolic meanings, power number associations)
ALTER TABLE chapters ADD COLUMN lore_metadata TEXT; -- JSON stored as TEXT

-- Add audio_url field for chapter audio content
ALTER TABLE chapters ADD COLUMN audio_url TEXT;

-- Add icon_url field for chapter visual representation
ALTER TABLE chapters ADD COLUMN icon_url TEXT;

-- Add color_theme field for power-number based coloring
ALTER TABLE chapters ADD COLUMN color_theme TEXT;

-- Index for efficient chapter lookups by cycle type
CREATE INDEX IF NOT EXISTS idx_chapters_cycle ON chapters(cycle);

-- Index for chapter order lookups
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters("order");
