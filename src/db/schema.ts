// Drizzle ORM Schema for Somatic-Canticles
import { pgTable, text, integer, real, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  googleId: text('google_id').unique(),
  birthdate: text('birthdate'),
  timezone: text('timezone').default('UTC'),
  role: text('role', { enum: ['user', 'admin'] }).default('user'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Chapters table
export const chapters = pgTable('chapters', {
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
  content: text('content'), // JSON stored as TEXT
  unlockConditions: text('unlock_conditions'), // JSON stored as TEXT
  loreMetadata: text('lore_metadata'), // JSON stored as TEXT
  createdAt: timestamp('created_at').defaultNow(),
});

// User progress table
export const userProgress = pgTable('user_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  unlockedAt: text('unlocked_at'),
  completedAt: text('completed_at'),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  completionPercentage: integer('completion_percentage').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Biorhythm snapshots table
export const biorhythmSnapshots = pgTable('biorhythm_snapshots', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  physical: real('physical'),
  emotional: real('emotional'),
  intellectual: real('intellectual'),
  spiritual: real('spiritual'),
  physicalPeak: boolean('physical_peak').default(false),
  emotionalPeak: boolean('emotional_peak').default(false),
  intellectualPeak: boolean('intellectual_peak').default(false),
  spiritualPeak: boolean('spiritual_peak').default(false),
  sunriseTime: text('sunrise_time'),
  sunsetTime: text('sunset_time'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Sun cache table
export const sunCache = pgTable('sun_cache', {
  id: text('id').primaryKey(), // lat,lng,date format
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  date: text('date').notNull(),
  sunrise: text('sunrise'),
  sunset: text('sunset'),
  solarNoon: text('solar_noon'),
  dayLength: text('day_length'),
  cachedAt: timestamp('cached_at').defaultNow(),
});

// Streaks table
export const streaks = pgTable('streaks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  streakType: text('streak_type').notNull(),
  currentCount: integer('current_count').default(0),
  longestCount: integer('longest_count').default(0),
  freezesUsed: integer('freezes_used').default(0),
  lastActivityDate: text('last_activity_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Achievements table
export const achievements = pgTable('achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementType: text('achievement_type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  unlockedAt: text('unlocked_at'),
  iconUrl: text('icon_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Refresh tokens table
export const refreshTokens = pgTable('refresh_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  revokedAt: text('revoked_at'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});

// Rate limits table
export const rateLimits = pgTable('rate_limits', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  action: text('action').notNull(),
  attempts: integer('attempts').default(1),
  firstAttemptAt: text('first_attempt_at').default(sql`CURRENT_TIMESTAMP`),
  lastAttemptAt: text('last_attempt_at').default(sql`CURRENT_TIMESTAMP`),
  blockedUntil: text('blocked_until'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message'),
  data: text('data'), // JSON stored as TEXT
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Highlights table
export const highlights = pgTable('highlights', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  sceneIndex: integer('scene_index').notNull(),
  text: text('text').notNull(),
  color: text('color').notNull().default('primary'), // primary, gold, resonance, danger
  createdAt: timestamp('created_at').defaultNow(),
});

// Bookmarks table
export const bookmarks = pgTable('bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  sceneIndex: integer('scene_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
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
