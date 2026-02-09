-- Development Seed Data
-- 
-- IMPORTANT: This file contains DEFAULT DEVELOPMENT CREDENTIALS only.
-- DO NOT use these credentials in production.
-- 
-- Default Admin: admin@somatic-canticles.local / SomaticDev44!
-- Test User: test@example.com / TestUser13!
--
-- Run with: wrangler d1 execute somatic-canticles-db --file=seed-dev.sql

-- Clear existing test data (optional - for clean seed)
-- DELETE FROM user_progress WHERE user_id IN (SELECT id FROM users WHERE email IN ('admin@somatic-canticles.local', 'test@example.com'));
-- DELETE FROM biorhythm_snapshots WHERE user_id IN (SELECT id FROM users WHERE email IN ('admin@somatic-canticles.local', 'test@example.com'));
-- DELETE FROM streaks WHERE user_id IN (SELECT id FROM users WHERE email IN ('admin@somatic-canticles.local', 'test@example.com'));
-- DELETE FROM achievements WHERE user_id IN (SELECT id FROM users WHERE email IN ('admin@somatic-canticles.local', 'test@example.com'));
-- DELETE FROM users WHERE email IN ('admin@somatic-canticles.local', 'test@example.com');

-- ============================================
-- DEFAULT ADMIN USER
-- Email: admin@somatic-canticles.local
-- Password: SomaticDev44!
-- Role: Admin (full access)
-- ============================================
INSERT INTO users (
    id,
    email,
    password_hash,
    birthdate,
    timezone,
    role,
    email_verified,
    created_at,
    updated_at
) VALUES (
    'admin-dev-001',
    'admin@somatic-canticles.local',
    -- Argon2id hash of "SomaticDev44!"
    -- Generated with: argon2.hash('SomaticDev44!', { type: argon2.argon2id })
    '$argon2id$v=19$m=65536,t=3,p=4$SGVsbG9Xb3JsZCE$6FzHLzHdFfXwpTBpYQZ2QqF5Nqq7Jm8wYvzVpC7w3uI',
    '1985-03-15',  -- Admin birthdate (for biorhythm testing)
    'America/New_York',
    'admin',
    1,  -- email verified
    datetime('now'),
    datetime('now')
) ON CONFLICT(email) DO UPDATE SET
    password_hash = excluded.password_hash,
    role = 'admin',
    updated_at = datetime('now');

-- ============================================
-- TEST USER
-- Email: test@example.com
-- Password: TestUser13!
-- Role: User (standard access)
-- ============================================
INSERT INTO users (
    id,
    email,
    password_hash,
    birthdate,
    timezone,
    role,
    email_verified,
    created_at,
    updated_at
) VALUES (
    'user-dev-001',
    'test@example.com',
    -- Argon2id hash of "TestUser13!"
    '$argon2id$v=19$m=65536,t=3,p=4$SGVsbG9Xb3JsZCE$7GzKMzJfXxZ6TBsZp1Q3Rr6Mrr8Kn9wYw0WqD8x4vJk',
    '1990-07-22',  -- Test user birthdate
    'America/Los_Angeles',
    'user',
    1,  -- email verified
    datetime('now'),
    datetime('now')
) ON CONFLICT(email) DO UPDATE SET
    password_hash = excluded.password_hash,
    role = 'user',
    updated_at = datetime('now');

-- ============================================
-- CHAPTER DEFINITIONS (12 Chapters)
-- ============================================
INSERT INTO chapters (
    id,
    "order",
    title,
    subtitle,
    cycle,
    unlock_trigger,
    duration_minutes,
    canticle_url,
    description,
    created_at
) VALUES 
-- Book 1: Physical Cycle (Chapters 1-3)
(1, 1, 'The Body Remembers', 'Returning to Somatic Awareness', 'physical', 'high_physical_sunrise', 8, '/audio/chapter-01-morning-octave.mp3', 'First chapter introducing body awareness through breath and sensation.', datetime('now')),
(2, 2, 'First Breath', 'The Architecture of Inhalation', 'physical', 'sustained_high_physical', 10, '/audio/chapter-02-terpsichore.mp3', 'Deep dive into breath as foundation of embodied practice.', datetime('now')),
(3, 3, 'The Architecture of Touch', 'Mapping the Skin-Kosha', 'physical', 'physical_peak', 12, '/audio/chapter-03-earth-resonance.mp3', 'Exploring touch as gateway to consciousness.', datetime('now')),

-- Book 1: Emotional Cycle (Chapters 4-6)
(4, 4, 'Witnessing the Pattern', 'Emotional Weather Systems', 'emotional', 'emotional_peak', 11, '/audio/chapter-04-heart-harmonics.mp3', 'Observing emotions as passing weather patterns.', datetime('now')),
(5, 5, 'The Observer Effect', 'Dissolving Reactivity', 'emotional', 'high_emotional_flow', 9, '/audio/chapter-05-melpomene.mp3', 'Creating space between stimulus and response.', datetime('now')),
(6, 6, 'Sovereignty of Authorship', 'Owning Your Emotional Narrative', 'emotional', 'emotional_peak', 13, '/audio/chapter-06-solar-plexus.mp3', 'Taking authorship of your emotional story.', datetime('now')),

-- Book 2: Intellectual Cycle (Chapters 7-9)
(7, 7, 'The Field Between Us', 'Mental Models and Mental Flexibility', 'intellectual', 'intellectual_peak', 10, '/audio/chapter-07-field-between.mp3', 'Understanding thought patterns and cognitive flexibility.', datetime('now')),
(8, 8, 'Resonant Coherence', 'Aligning Mind and Heart', 'intellectual', 'high_intellectual_flow', 11, '/audio/chapter-08-resonant-coherence.mp3', 'Integrating intellectual and emotional intelligence.', datetime('now')),
(9, 9, 'Collective Intelligence', 'The Wisdom of Many Minds', 'intellectual', 'intellectual_peak', 12, '/audio/chapter-09-collective-intel.mp3', 'Tapping into collective wisdom and insight.', datetime('now')),

-- Book 2: Spiritual Cycle (Chapters 10-12)
(10, 10, 'Entanglement', 'The Non-Local Self', 'spiritual', 'spiritual_peak', 13, '/audio/chapter-10-entanglement.mp3', 'Experiencing the interconnected nature of consciousness.', datetime('now')),
(11, 11, 'Planetary Consciousness', 'Gaia Awareness', 'spiritual', 'high_spiritual_transcendent', 14, '/audio/chapter-11-planetary.mp3', 'Expanding awareness to planetary scale.', datetime('now')),
(12, 12, 'The New Beginning', 'Integration and Initiation', 'spiritual', 'all_cycles_aligned', 15, '/audio/chapter-12-new-beginning.mp3', 'Integration of all cycles and new beginning.', datetime('now'))
ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    updated_at = datetime('now');

-- ============================================
-- SAMPLE USER PROGRESS (Test User)
-- ============================================
-- Chapter 1: Completed
INSERT INTO user_progress (
    user_id,
    chapter_id,
    unlocked_at,
    completed_at,
    time_spent_seconds,
    completion_percentage,
    notes
) VALUES (
    'user-dev-001',
    1,
    datetime('now', '-30 days'),
    datetime('now', '-28 days'),
    480,  -- 8 minutes
    100,
    'First experience with embodied practice. Felt grounded.'
) ON CONFLICT(user_id, chapter_id) DO UPDATE SET
    completion_percentage = excluded.completion_percentage;

-- Chapter 2: In Progress
INSERT INTO user_progress (
    user_id,
    chapter_id,
    unlocked_at,
    completed_at,
    time_spent_seconds,
    completion_percentage,
    notes
) VALUES (
    'user-dev-001',
    2,
    datetime('now', '-28 days'),
    NULL,  -- not completed
    300,  -- 5 minutes
    50,
    'Need to complete the breathing exercises.'
) ON CONFLICT(user_id, chapter_id) DO UPDATE SET
    completion_percentage = excluded.completion_percentage;

-- ============================================
-- SAMPLE STREAK DATA
-- ============================================
INSERT INTO streaks (
    user_id,
    streak_type,
    current_count,
    longest_count,
    last_activity_date,
    created_at
) VALUES 
('user-dev-001', 'daily_practice', 7, 13, date('now', '-1 days'), datetime('now')),
('user-dev-001', 'morning_octave', 3, 5, date('now', '-2 days'), datetime('now'))
ON CONFLICT(user_id, streak_type) DO UPDATE SET
    current_count = excluded.current_count,
    longest_count = excluded.longest_count;

-- ============================================
-- SAMPLE ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (
    user_id,
    achievement_type,
    title,
    description,
    unlocked_at,
    icon_url
) VALUES 
('user-dev-001', 'first_chapter', 'Novice Witness', 'Complete your first chapter', datetime('now', '-28 days'), '/achievements/first-chapter.svg'),
('user-dev-001', 'seven_day_streak', 'Consistent Practice', 'Maintain a 7-day streak', datetime('now', '-7 days'), '/achievements/7-day.svg')
ON CONFLICT(user_id, achievement_type) DO UPDATE SET
    unlocked_at = excluded.unlocked_at;

-- ============================================
-- SEED COMPLETE
-- ============================================
-- Default credentials summary:
-- 
-- Admin Account:
--   Email: admin@somatic-canticles.local
--   Password: SomaticDev44!
--   Role: admin
--
-- Test Account:
--   Email: test@example.com
--   Password: TestUser13!
--   Role: user
--
-- All 12 chapters seeded with metadata
-- Sample progress data created for test user
