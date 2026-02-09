/**
 * Streak Tracking Module
 * 
 * Tracks daily practice streaks and biorhythm-specific streaks.
 * Includes streak freeze logic and milestone notifications.
 */

import type { DB } from '../db';
import { streaks, notifications } from '../../db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Streak types
export type StreakType = 'daily' | 'physical' | 'emotional' | 'intellectual' | 'spiritual';

// Streak configuration
const STREAK_CONFIG = {
  // Hours within which a user can extend their streak
  streakWindowHours: 48,
  // Number of freezes allowed per streak type
  maxFreezes: 3,
  // Milestones that trigger notifications
  milestones: [7, 14, 30, 44, 60, 90, 100, 180, 365],
} as const;

export interface StreakData {
  id: string;
  userId: string;
  streakType: StreakType;
  currentCount: number;
  longestCount: number;
  lastActivityDate: string | null;
  freezesUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface StreakUpdateResult {
  streakExtended: boolean;
  currentStreak: number;
  longestStreak: number;
  milestoneReached: number | null;
  freezeUsed: boolean;
}

/**
 * Get or create a streak record for a user
 */
export async function getOrCreateStreak(
  userId: string,
  streakType: StreakType,
  db: DB
): Promise<StreakData> {
  const existingStreak = await db
    .select()
    .from(streaks)
    .where(
      and(
        eq(streaks.userId, userId),
        eq(streaks.streakType, streakType)
      )
    )
    .limit(1);

  if (existingStreak.length > 0) {
    return existingStreak[0] as StreakData;
  }

  // Create new streak record
  const now = new Date().toISOString();
  const streakId = `streak-${userId}-${streakType}`;

  await db.insert(streaks).values({
    id: streakId,
    userId,
    streakType,
    currentCount: 0,
    longestCount: 0,
    lastActivityDate: null,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: streakId,
    userId,
    streakType,
    currentCount: 0,
    longestCount: 0,
    lastActivityDate: null,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]!;
}

/**
 * Check if a streak can be extended
 */
function canExtendStreak(lastActivityDate: string | null, today: string): boolean {
  if (!lastActivityDate) return true;

  const daysDiff = daysBetween(lastActivityDate, today);
  
  // Can extend if:
  // - Last activity was today (already extended)
  // - Last activity was yesterday (normal extension)
  // - Within the streak window (for freeze logic)
  return daysDiff <= 1 || daysDiff <= Math.ceil(STREAK_CONFIG.streakWindowHours / 24);
}

/**
 * Check if streak freeze should be used
 */
function shouldUseFreeze(lastActivityDate: string | null, today: string): boolean {
  if (!lastActivityDate) return false;

  const daysDiff = daysBetween(lastActivityDate, today);
  // Use freeze if missed exactly one day
  return daysDiff === 2;
}

/**
 * Create a streak milestone notification
 */
async function createStreakMilestoneNotification(
  userId: string,
  streakType: StreakType,
  streakCount: number,
  db: DB
): Promise<void> {
  const now = new Date().toISOString();
  const notificationId = `notif-${userId}-streak-${streakType}-${streakCount}-${Date.now()}`;

  const streakTypeLabels: Record<StreakType, string> = {
    daily: 'Daily Practice',
    physical: 'Physical Cycle',
    emotional: 'Emotional Cycle',
    intellectual: 'Intellectual Cycle',
    spiritual: 'Spiritual Cycle',
  };

  await db.insert(notifications).values({
    id: notificationId,
    userId,
    type: 'streak_milestone',
    title: `${streakCount}-Day ${streakTypeLabels[streakType]} Streak!`,
    message: `Amazing! You've maintained your ${streakTypeLabels[streakType].toLowerCase()} streak for ${streakCount} days. Keep it up!`,
    data: JSON.stringify({
      streak_type: streakType,
      streak_count: streakCount,
      milestone: true,
    }),
    read: false,
    createdAt: now,
  });
}

/**
 * Record activity and update streak
 */
export async function recordActivity(
  userId: string,
  streakType: StreakType,
  db: DB
): Promise<StreakUpdateResult> {
  const streak = await getOrCreateStreak(userId, streakType, db);
  const today = getTodayISO();

  // Check if already recorded today
  if (streak.lastActivityDate === today) {
    return {
      streakExtended: false,
      currentStreak: streak.currentCount,
      longestStreak: streak.longestCount,
      milestoneReached: null,
      freezeUsed: false,
    };
  }

  // Check if streak can be extended
  const canExtend = canExtendStreak(streak.lastActivityDate, today);
  const useFreeze = shouldUseFreeze(streak.lastActivityDate, today);
  const freezesAvailable = STREAK_CONFIG.maxFreezes - (streak.freezesUsed || 0);

  let newStreakCount: number;
  let freezeUsed = false;

  if (!canExtend) {
    // Streak broken - start over
    newStreakCount = 1;
  } else if (useFreeze && freezesAvailable > 0) {
    // Use freeze to maintain streak
    newStreakCount = streak.currentCount + 1;
    freezeUsed = true;
  } else if (streak.lastActivityDate) {
    const daysDiff = daysBetween(streak.lastActivityDate, today);
    if (daysDiff > 2) {
      // Too many days missed - start over
      newStreakCount = 1;
    } else {
      // Normal extension
      newStreakCount = streak.currentCount + 1;
    }
  } else {
    // First activity
    newStreakCount = 1;
  }

  // Update longest streak if applicable
  const newLongestStreak = Math.max(streak.longestCount, newStreakCount);

  // Update streak in database
  const updateData: Partial<typeof streaks.$inferInsert> = {
    currentCount: newStreakCount,
    longestCount: newLongestStreak,
    lastActivityDate: today,
    updatedAt: new Date().toISOString(),
  };

  if (freezeUsed) {
    updateData.freezesUsed = (streak.freezesUsed || 0) + 1;
  }

  await db
    .update(streaks)
    .set(updateData)
    .where(eq(streaks.id, streak.id));

  // Check for milestone
  const milestoneReached = STREAK_CONFIG.milestones.includes(newStreakCount) 
    ? newStreakCount 
    : null;

  if (milestoneReached) {
    await createStreakMilestoneNotification(userId, streakType, milestoneReached, db);
  }

  return {
    streakExtended: true,
    currentStreak: newStreakCount,
    longestStreak: newLongestStreak,
    milestoneReached,
    freezeUsed,
  };
}

/**
 * Record daily practice activity
 */
export async function recordDailyActivity(userId: string, db: DB): Promise<StreakUpdateResult> {
  return recordActivity(userId, 'daily', db);
}

/**
 * Record biorhythm-specific activity
 */
export async function recordBiorhythmActivity(
  userId: string,
  cycle: 'physical' | 'emotional' | 'intellectual' | 'spiritual',
  db: DB
): Promise<StreakUpdateResult> {
  return recordActivity(userId, cycle, db);
}

/**
 * Get all streaks for a user
 */
export async function getUserStreaks(userId: string, db: DB): Promise<StreakData[]> {
  const userStreaks = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .orderBy(desc(streaks.currentCount));

  return userStreaks as StreakData[];
}

/**
 * Get streak summary for a user
 */
export async function getStreakSummary(userId: string, db: DB): Promise<{
  daily: StreakData | null;
  byCycle: Record<string, StreakData>;
  totalActiveStreaks: number;
}> {
  const userStreaks = await getUserStreaks(userId, db);

  const daily = userStreaks.find(s => s.streakType === 'daily') || null;
  const byCycle: Record<string, StreakData> = {};

  for (const streak of userStreaks) {
    if (streak.streakType !== 'daily') {
      byCycle[streak.streakType] = streak;
    }
  }

  const totalActiveStreaks = userStreaks.filter(s => s.currentCount > 0).length;

  return {
    daily,
    byCycle,
    totalActiveStreaks,
  };
}

/**
 * Check if user has active streaks at risk
 */
export async function getStreaksAtRisk(userId: string, db: DB): Promise<StreakData[]> {
  const userStreaks = await getUserStreaks(userId, db);
  const today = getTodayISO();

  return userStreaks.filter(streak => {
    if (!streak.lastActivityDate) return false;
    if (streak.currentCount === 0) return false;

    const daysSinceLastActivity = daysBetween(streak.lastActivityDate, today);
    
    // Streak is at risk if it's been 1+ days since last activity
    // and the user is within the freeze window
    return daysSinceLastActivity >= 1 && daysSinceLastActivity <= 2;
  });
}

/**
 * Reset a specific streak (for testing or admin purposes)
 */
export async function resetStreak(
  userId: string,
  streakType: StreakType,
  db: DB
): Promise<void> {
  const streakId = `streak-${userId}-${streakType}`;
  const now = new Date().toISOString();

  await db
    .update(streaks)
    .set({
      currentCount: 0,
      lastActivityDate: null,
      freezesUsed: 0,
      updatedAt: now,
    })
    .where(eq(streaks.id, streakId));
}

/**
 * Get upcoming streak milestones
 */
export function getUpcomingMilestones(currentStreak: number): number[] {
  return STREAK_CONFIG.milestones.filter(m => m > currentStreak).slice(0, 3);
}

/**
 * Calculate streak health score (0-100)
 */
export function calculateStreakHealth(streak: StreakData): number {
  if (!streak.lastActivityDate) return 0;

  const today = getTodayISO();
  const daysSinceLastActivity = daysBetween(streak.lastActivityDate, today);

  if (daysSinceLastActivity === 0) return 100;
  if (daysSinceLastActivity === 1) return 75;
  if (daysSinceLastActivity === 2) return 50;
  return 0;
}
