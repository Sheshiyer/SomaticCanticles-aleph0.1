-- Initial Schema for Somatic-Canticles Webapp
-- D1 Database Migration

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    birthdate TEXT,
    timezone TEXT DEFAULT 'UTC',
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    email_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Chapters table (12 chapters)
CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY,
    "order" INTEGER NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    cycle TEXT CHECK (cycle IN ('physical', 'emotional', 'intellectual', 'spiritual')),
    unlock_trigger TEXT,
    duration_minutes INTEGER,
    canticle_url TEXT,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    chapter_id INTEGER NOT NULL,
    unlocked_at TEXT,
    completed_at TEXT,
    time_spent_seconds INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
    UNIQUE(user_id, chapter_id)
);

-- Biorhythm snapshots (daily calculations)
CREATE TABLE IF NOT EXISTS biorhythm_snapshots (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    physical REAL,
    emotional REAL,
    intellectual REAL,
    spiritual REAL,
    physical_peak INTEGER DEFAULT 0,
    emotional_peak INTEGER DEFAULT 0,
    intellectual_peak INTEGER DEFAULT 0,
    spiritual_peak INTEGER DEFAULT 0,
    sunrise_time TEXT,
    sunset_time TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, date)
);

-- Streaks tracking
CREATE TABLE IF NOT EXISTS streaks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    streak_type TEXT NOT NULL,
    current_count INTEGER DEFAULT 0,
    longest_count INTEGER DEFAULT 0,
    last_activity_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, streak_type)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    unlocked_at TEXT,
    icon_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_chapter_id ON user_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_biorhythm_snapshots_user_id ON biorhythm_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_biorhythm_snapshots_date ON biorhythm_snapshots(date);
CREATE INDEX IF NOT EXISTS idx_biorhythm_user_date ON biorhythm_snapshots(user_id, date);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
