// Drizzle ORM Schema for Somatic-Canticles (SQLite/D1)
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Availability helper for timestamps
const now = sql`(strftime('%s', 'now'))`;

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
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
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
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
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
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
});

// Refresh tokens table
export const refreshTokens = sqliteTable('refresh_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: text('expires_at').notNull(), // ISO string
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
});

// Streaks table
export const streaks = sqliteTable('streaks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastActivityDate: text('last_activity_date'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now') * 1000)`),
});
