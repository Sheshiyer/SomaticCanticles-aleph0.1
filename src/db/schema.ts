// Drizzle ORM Schema for Somatic-Canticles (SQLite/D1)
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Availability helper for timestamps
const now = sql`(strftime('%s', 'now') * 1000)`;

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  googleId: text('google_id').unique(),
  birthdate: text('birthdate'),
  timezone: text('timezone').default('UTC'),
  role: text('role', { enum: ['user', 'admin'] }).default('user'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(now),
});

// Chapters table
export const chapters = sqliteTable('chapters', {
  id: integer('id').primaryKey(),
  order: integer('order').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  cycle: text('cycle', { enum: ['physical', 'emotional', 'intellectual', 'spiritual'] }),
  unlockTrigger: text('unlock_trigger'),
  durationMinutes: integer('duration_minutes'),
  canticleUrl: text('canticle_url'),
  audioUrl: text('audio_url'),
  iconUrl: text('icon_url'),
  colorTheme: text('color_theme'),
  description: text('description'),
  content: text('content', { mode: 'json' }), // JSON stored as TEXT
  unlockConditions: text('unlock_conditions', { mode: 'json' }), // JSON stored as TEXT
  loreMetadata: text('lore_metadata', { mode: 'json' }), // JSON stored as TEXT
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// User progress table
export const userProgress = sqliteTable('user_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  unlockedAt: text('unlocked_at'),
  completedAt: text('completed_at'),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  completionPercentage: integer('completion_percentage').default(0),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(now),
});

// Biorhythm snapshots table
export const biorhythmSnapshots = sqliteTable('biorhythm_snapshots', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  physical: real('physical'),
  emotional: real('emotional'),
  intellectual: real('intellectual'),
  spiritual: real('spiritual'),
  physicalPeak: integer('physical_peak', { mode: 'boolean' }).default(false),
  emotionalPeak: integer('emotional_peak', { mode: 'boolean' }).default(false),
  intellectualPeak: integer('intellectual_peak', { mode: 'boolean' }).default(false),
  spiritualPeak: integer('spiritual_peak', { mode: 'boolean' }).default(false),
  sunriseTime: text('sunrise_time'),
  sunsetTime: text('sunset_time'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// Sun cache table
export const sunCache = sqliteTable('sun_cache', {
  id: text('id').primaryKey(), // lat,lng,date format
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  date: text('date').notNull(),
  sunrise: text('sunrise'),
  sunset: text('sunset'),
  solarNoon: text('solar_noon'),
  dayLength: text('day_length'),
  cachedAt: integer('cached_at', { mode: 'timestamp' }).default(now),
});

// Streaks table
export const streaks = sqliteTable('streaks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  streakType: text('streak_type').notNull(),
  currentCount: integer('current_count').default(0),
  longestCount: integer('longest_count').default(0),
  freezesUsed: integer('freezes_used').default(0),
  lastActivityDate: text('last_activity_date'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(now),
});

// Achievements table
export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementType: text('achievement_type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  unlockedAt: text('unlocked_at'),
  iconUrl: text('icon_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// Refresh tokens table
export const refreshTokens = sqliteTable('refresh_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
  revokedAt: text('revoked_at'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});

// Rate limits table
export const rateLimits = sqliteTable('rate_limits', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  action: text('action').notNull(),
  attempts: integer('attempts').default(1),
  firstAttemptAt: text('first_attempt_at').default(sql`CURRENT_TIMESTAMP`),
  lastAttemptAt: text('last_attempt_at').default(sql`CURRENT_TIMESTAMP`),
  blockedUntil: text('blocked_until'),
  ipAddress: text('ip_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// Notifications table
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message'),
  data: text('data', { mode: 'json' }), // JSON stored as TEXT
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// Highlights table
export const highlights = sqliteTable('highlights', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  sceneIndex: integer('scene_index').notNull(),
  text: text('text').notNull(),
  color: text('color').notNull().default('primary'), // primary, gold, resonance, danger
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// Bookmarks table
export const bookmarks = sqliteTable('bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  sceneIndex: integer('scene_index').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
export type BiorhythmSnapshot = typeof biorhythmSnapshots.$inferSelect;
export type NewBiorhythmSnapshot = typeof biorhythmSnapshots.$inferInsert;
export type SunCache = typeof sunCache.$inferSelect;
export type NewSunCache = typeof sunCache.$inferInsert;
export type Streak = typeof streaks.$inferSelect;
export type NewStreak = typeof streaks.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
export type RateLimit = typeof rateLimits.$inferSelect;
export type NewRateLimit = typeof rateLimits.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type Highlight = typeof highlights.$inferSelect;
export type NewHighlight = typeof highlights.$inferInsert;
export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
