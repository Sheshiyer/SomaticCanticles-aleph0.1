-- Seed users for Somatic-Canticles
-- Admin and test user credentials from .env.example
-- Run with: wrangler d1 execute somatic-canticles-db --env production --remote --file=./migrations/seed_users.sql

-- Generate UUIDs for users
-- Admin: admin@somatic-canticles.local / SomaticDev44!
-- User: test@example.com / TestUser13!

INSERT OR REPLACE INTO users (id, email, password_hash, birthdate, timezone, role, email_verified, created_at, updated_at) VALUES
(
  'admin-001-4f2a-9c8e-1a2b3c4d5e6f',
  'admin@somatic-canticles.local',
  '$argon2id$v=19$m=65536,t=3,p=4$2fef2932542f9b7b054ae51023f9cb7f977d1dab4e23d055558b1d48287155e6$e8dfd5151deb7f95c2ed78653c0166bf0edcf5f5328c0b02885a5e769b9d700d',
  '1980-01-01',
  'UTC',
  'admin',
  1,
  unixepoch(),
  unixepoch()
),
(
  'user-001-8b4d-7e9f-2c3d4e5f6a7b',
  'test@example.com',
  '$argon2id$v=19$m=65536,t=3,p=4$f760973fe8ea8405f65fab23d2cb115a062bb5029d598b7fb2ed0b8d2b3ed9b5$49079f87cd1cbd04c3034d50844aed5994bf997e7bee22ab9cd588054cf31900',
  '1990-05-15',
  'America/New_York',
  'user',
  1,
  unixepoch(),
  unixepoch()
);

-- Initialize streaks for test user
INSERT OR REPLACE INTO streaks (id, user_id, streak_type, current_count, longest_count, last_activity_date, started_at, updated_at)
SELECT 
  'streak-' || lower(hex(randomblob(16))),
  id,
  'daily',
  0,
  0,
  NULL,
  unixepoch(),
  unixepoch()
FROM users 
WHERE email = 'test@example.com';

-- Verify users created
SELECT 
  email,
  role,
  timezone,
  email_verified,
  datetime(created_at, 'unixepoch') as created_at
FROM users 
WHERE email IN ('admin@somatic-canticles.local', 'test@example.com');
