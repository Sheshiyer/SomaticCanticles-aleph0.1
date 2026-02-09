# Somatic-Canticles Database Schema

## Overview

This document describes the complete database schema for the Somatic-Canticles webapp using Cloudflare D1 (SQLite).

## Tables

### 1. users

Stores user account information.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 unique identifier |
| email | TEXT | UNIQUE, NOT NULL | User email address |
| password_hash | TEXT | NOT NULL | Argon2id hashed password |
| birthdate | TEXT | NULLABLE | User birthdate (ISO 8601 format) |
| timezone | TEXT | DEFAULT 'UTC' | User timezone for biorhythm calculations |
| role | TEXT | DEFAULT 'user', CHECK (role IN ('user', 'admin')) | User role |
| email_verified | INTEGER | DEFAULT 0 | Email verification status (0/1) |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_users_email` (email) - For login lookups

---

### 2. chapters

Stores the 12 somatic canticles chapters.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Chapter number (1-12) |
| order | INTEGER | NOT NULL | Display order |
| title | TEXT | NOT NULL | Chapter title |
| subtitle | TEXT | NULLABLE | Chapter subtitle |
| cycle | TEXT | CHECK (cycle IN ('physical', 'emotional', 'intellectual', 'spiritual')) | Associated biorhythm cycle |
| unlock_trigger | TEXT | NULLABLE | Condition to unlock chapter |
| duration_minutes | INTEGER | NULLABLE | Estimated completion time |
| canticle_url | TEXT | NULLABLE | URL to audio/image asset |
| description | TEXT | NULLABLE | Chapter description |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

---

### 3. user_progress

Tracks user progress through chapters.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 unique identifier |
| user_id | TEXT | NOT NULL, FOREIGN KEY | Reference to users.id |
| chapter_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to chapters.id |
| unlocked_at | TEXT | NULLABLE | When chapter was unlocked |
| completed_at | TEXT | NULLABLE | When chapter was completed |
| time_spent_seconds | INTEGER | DEFAULT 0 | Total time spent on chapter |
| completion_percentage | INTEGER | DEFAULT 0 | Progress percentage (0-100) |
| notes | TEXT | NULLABLE | User notes |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Constraints:**
- UNIQUE(user_id, chapter_id)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE

**Indexes:**
- `idx_user_progress_user_id` (user_id) - For fetching user progress
- `idx_user_progress_chapter_id` (chapter_id) - For chapter analytics

---

### 4. biorhythm_snapshots

Daily biorhythm calculations for users.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 unique identifier |
| user_id | TEXT | NOT NULL, FOREIGN KEY | Reference to users.id |
| date | TEXT | NOT NULL | Date of calculation (ISO 8601) |
| physical | REAL | NULLABLE | Physical cycle value (-100 to 100) |
| emotional | REAL | NULLABLE | Emotional cycle value (-100 to 100) |
| intellectual | REAL | NULLABLE | Intellectual cycle value (-100 to 100) |
| spiritual | REAL | NULLABLE | Spiritual cycle value (-100 to 100) |
| physical_peak | INTEGER | DEFAULT 0 | Physical peak indicator (0/1) |
| emotional_peak | INTEGER | DEFAULT 0 | Emotional peak indicator (0/1) |
| intellectual_peak | INTEGER | DEFAULT 0 | Intellectual peak indicator (0/1) |
| spiritual_peak | INTEGER | DEFAULT 0 | Spiritual peak indicator (0/1) |
| sunrise_time | TEXT | NULLABLE | Local sunrise time |
| sunset_time | TEXT | NULLABLE | Local sunset time |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Calculation timestamp |

**Constraints:**
- UNIQUE(user_id, date)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

**Indexes:**
- `idx_biorhythm_snapshots_user_id` (user_id) - For user history
- `idx_biorhythm_snapshots_date` (date) - For date range queries
- `idx_biorhythm_user_date` (user_id, date) - For specific date lookups

---

### 5. streaks

Tracks user activity streaks.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 unique identifier |
| user_id | TEXT | NOT NULL, FOREIGN KEY | Reference to users.id |
| streak_type | TEXT | NOT NULL | Type: 'daily', 'weekly', 'completion' |
| current_count | INTEGER | DEFAULT 0 | Current streak count |
| longest_count | INTEGER | DEFAULT 0 | Longest streak achieved |
| last_activity_date | TEXT | NULLABLE | Last activity timestamp |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Constraints:**
- UNIQUE(user_id, streak_type)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

**Indexes:**
- `idx_streaks_user_id` (user_id) - For user streak lookups

---

### 6. achievements

User achievements and badges.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 unique identifier |
| user_id | TEXT | NOT NULL, FOREIGN KEY | Reference to users.id |
| achievement_type | TEXT | NOT NULL | Achievement identifier |
| title | TEXT | NOT NULL | Display title |
| description | TEXT | NULLABLE | Achievement description |
| unlocked_at | TEXT | NULLABLE | When achieved |
| icon_url | TEXT | NULLABLE | Badge icon URL |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Constraints:**
- UNIQUE(user_id, achievement_type)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

**Indexes:**
- `idx_achievements_user_id` (user_id) - For user achievements

---

### 7. refresh_tokens

JWT refresh token storage for authentication.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 unique identifier |
| user_id | TEXT | NOT NULL, FOREIGN KEY | Reference to users.id |
| token_hash | TEXT | NOT NULL | SHA-256 hash of refresh token |
| expires_at | TEXT | NOT NULL | Token expiration timestamp |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| revoked_at | TEXT | NULLABLE | When token was revoked |
| ip_address | TEXT | NULLABLE | IP that created token |
| user_agent | TEXT | NULLABLE | User agent string |

**Constraints:**
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

**Indexes:**
- `idx_refresh_tokens_token_hash` (token_hash) - For token lookups
- `idx_refresh_tokens_user_id` (user_id) - For user token management
- `idx_refresh_tokens_expires` (expires_at) - For cleanup jobs

---

## Entity Relationship Diagram

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   users     │────▶│  user_progress   │◀────│  chapters   │
├─────────────┤     ├──────────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)          │     │ id (PK)     │
│ email       │     │ user_id (FK)     │     │ title       │
│ password    │     │ chapter_id (FK)  │     │ cycle       │
│ birthdate   │     │ unlocked_at      │     │ ...         │
│ ...         │     │ completed_at     │     └─────────────┘
└─────────────┘     │ ...              │
       │            └──────────────────┘
       │
       ├────────────▶┌────────────────────┐
       │             │ biorhythm_snapshots│
       │             ├────────────────────┤
       │             │ id (PK)            │
       │             │ user_id (FK)       │
       │             │ date               │
       │             │ physical           │
       │             │ emotional          │
       │             │ ...                │
       │             └────────────────────┘
       │
       ├────────────▶┌─────────────┐
       │             │   streaks   │
       │             ├─────────────┤
       │             │ id (PK)     │
       │             │ user_id (FK)│
       │             │ streak_type │
       │             │ ...         │
       │             └─────────────┘
       │
       ├────────────▶┌───────────────┐
       │             │  achievements │
       │             ├───────────────┤
       │             │ id (PK)       │
       │             │ user_id (FK)  │
       │             │ achievement   │
       │             │ ...           │
       │             └───────────────┘
       │
       └────────────▶┌───────────────┐
                     │ refresh_tokens│
                     ├───────────────┤
                     │ id (PK)       │
                     │ user_id (FK)  │
                     │ token_hash    │
                     │ expires_at    │
                     │ ...           │
                     └───────────────┘
```

## Data Types Reference

### SQLite Types Used

| Type | Description | Example |
|------|-------------|---------|
| TEXT | String values | 'hello', '2024-01-01' |
| INTEGER | Whole numbers | 42, 0, -1 |
| REAL | Floating point | 23.5, -99.9 |
| BOOLEAN | 0 or 1 | 0 (false), 1 (true) |

### Date/Time Format

All timestamps use ISO 8601 format: `YYYY-MM-DDTHH:MM:SS.sssZ`

Examples:
- `2024-01-15T08:30:00.000Z`
- `2024-06-20T14:45:30.500Z`

## Migration History

| Migration | Description | Date |
|-----------|-------------|------|
| 0001_initial_schema.sql | Initial table creation | Sprint 1 |
| 0002_add_indexes.sql | Performance indexes | Sprint 1 |
