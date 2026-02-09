/**
 * Achievement System Module
 * 
 * Defines and manages user achievements.
 * Includes 8 achievements: First Chapter, Chapter Master, 7-Day Streak, 44-Day Streak,
 * Morning Person, Night Owl, Cycle Master, and Completionist.
 */

import type { DB } from '../db';
import { achievements, userProgress, chapters, streaks, biorhythmSnapshots, notifications } from '../../db/schema';
import { eq, and, sql, count, gte } from 'drizzle-orm';

// Achievement type definitions
export type AchievementType = 
  | 'first_chapter'
  | 'chapter_master'
  | 'seven_day_streak'
  | 'forty_four_day_streak'
  | 'morning_person'
  | 'night_owl'
  | 'cycle_master'
  | 'completionist';

// Achievement definition
export interface AchievementDefinition {
  type: AchievementType;
  title: string;
  description: string;
  iconName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: {
    type: 'chapters_completed' | 'streak_days' | 'practice_time' | 'biorhythm_peak' | 'special';
    value: number;
    additionalParams?: Record<string, unknown>;
  };
}

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    type: 'first_chapter',
    title: 'First Chapter',
    description: 'Complete your first chapter',
    iconName: 'BookOpen',
    rarity: 'common',
    condition: { type: 'chapters_completed', value: 1 },
  },
  {
    type: 'chapter_master',
    title: 'Chapter Master',
    description: 'Complete all 12 chapters',
    iconName: 'Crown',
    rarity: 'legendary',
    condition: { type: 'chapters_completed', value: 12 },
  },
  {
    type: 'seven_day_streak',
    title: '7-Day Streak',
    description: 'Maintain a daily practice streak for 7 days',
    iconName: 'Flame',
    rarity: 'common',
    condition: { type: 'streak_days', value: 7 },
  },
  {
    type: 'forty_four_day_streak',
    title: '44-Day Streak',
    description: 'Maintain a daily practice streak for 44 days',
    iconName: 'Star',
    rarity: 'epic',
    condition: { type: 'streak_days', value: 44 },
  },
  {
    type: 'morning_person',
    title: 'Morning Person',
    description: 'Complete a chapter between 5 AM and 9 AM',
    iconName: 'Sunrise',
    rarity: 'rare',
    condition: { type: 'special', value: 1, additionalParams: { timeWindow: 'morning' } },
  },
  {
    type: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a chapter between 10 PM and 2 AM',
    iconName: 'Moon',
    rarity: 'rare',
    condition: { type: 'special', value: 1, additionalParams: { timeWindow: 'night' } },
  },
  {
    type: 'cycle_master',
    title: 'Cycle Master',
    description: 'Complete at least one chapter during each biorhythm peak',
    iconName: 'Activity',
    rarity: 'epic',
    condition: { type: 'biorhythm_peak', value: 4 },
  },
  {
    type: 'completionist',
    title: 'Completionist',
    description: 'Unlock all other achievements',
    iconName: 'Award',
    rarity: 'legendary',
    condition: { type: 'special', value: 7, additionalParams: { requiresOtherAchievements: true } },
  },
];

// Achievement data interface
export interface AchievementData {
  id: string;
  userId: string;
  achievementType: AchievementType;
  title: string;
  description: string;
  unlockedAt: string | null;
  iconUrl: string | null;
  createdAt: string;
}

// Achievement check result
export interface AchievementCheckResult {
  newlyUnlocked: AchievementType[];
  alreadyUnlocked: AchievementType[];
  progress: Partial<Record<AchievementType, { current: number; target: number; percentage: number }>>;
}

/**
 * Initialize achievements for a new user
 */
export async function initializeUserAchievements(userId: string, db: DB): Promise<void> {
  const now = new Date().toISOString();

  for (const definition of ACHIEVEMENT_DEFINITIONS) {
    const achievementId = `ach-${userId}-${definition.type}`;

    await db.insert(achievements).values({
      id: achievementId,
      userId,
      achievementType: definition.type,
      title: definition.title,
      description: definition.description,
      unlockedAt: null,
      iconUrl: `/icons/achievements/${definition.iconName.toLowerCase()}.svg`,
      createdAt: now,
    }).onConflictDoNothing();
  }
}

/**
 * Check if user has already unlocked an achievement
 */
async function isAchievementUnlocked(
  userId: string,
  achievementType: AchievementType,
  db: DB
): Promise<boolean> {
  const result = await db
    .select({ unlockedAt: achievements.unlockedAt })
    .from(achievements)
    .where(
      and(
        eq(achievements.userId, userId),
        eq(achievements.achievementType, achievementType)
      )
    )
    .limit(1);

  return result.length > 0 && result[0].unlockedAt !== null;
}

/**
 * Award an achievement to a user
 */
async function awardAchievement(
  userId: string,
  achievementType: AchievementType,
  db: DB
): Promise<void> {
  const now = new Date().toISOString();
  const achievementId = `ach-${userId}-${achievementType}`;

  await db
    .update(achievements)
    .set({ unlockedAt: now })
    .where(eq(achievements.id, achievementId));

  // Create notification
  const definition = ACHIEVEMENT_DEFINITIONS.find(a => a.type === achievementType);
  if (definition) {
    const notificationId = `notif-${userId}-ach-${achievementType}-${Date.now()}`;
    await db.insert(notifications).values({
      id: notificationId,
      userId,
      type: 'achievement_unlocked',
      title: `Achievement Unlocked: ${definition.title}`,
      message: definition.description,
      data: JSON.stringify({
        achievement_type: achievementType,
        achievement_title: definition.title,
        rarity: definition.rarity,
      }),
      read: false,
      createdAt: now,
    });
  }
}

/**
 * Check chapter completion achievements
 */
async function checkChapterAchievements(
  userId: string,
  db: DB,
  result: AchievementCheckResult
): Promise<void> {
  // Check First Chapter
  if (!await isAchievementUnlocked(userId, 'first_chapter', db)) {
    const completedChapters = await db
      .select({ count: count() })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          sql`${userProgress.completedAt} IS NOT NULL`
        )
      );

    const count = Number(completedChapters[0]?.count || 0);
    result.progress.first_chapter = { current: count, target: 1, percentage: Math.min(count * 100, 100) };

    if (count >= 1) {
      await awardAchievement(userId, 'first_chapter', db);
      result.newlyUnlocked.push('first_chapter');
    }
  } else {
    result.alreadyUnlocked.push('first_chapter');
  }

  // Check Chapter Master
  if (!await isAchievementUnlocked(userId, 'chapter_master', db)) {
    const totalChaptersResult = await db
      .select({ count: count() })
      .from(chapters);
    const totalChapters = Number(totalChaptersResult[0]?.count || 12);

    const completedChapters = await db
      .select({ count: count() })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          sql`${userProgress.completedAt} IS NOT NULL`
        )
      );

    const count = Number(completedChapters[0]?.count || 0);
    result.progress.chapter_master = { current: count, target: totalChapters, percentage: Math.round((count / totalChapters) * 100) };

    if (count >= totalChapters) {
      await awardAchievement(userId, 'chapter_master', db);
      result.newlyUnlocked.push('chapter_master');
    }
  } else {
    result.alreadyUnlocked.push('chapter_master');
  }
}

/**
 * Check streak achievements
 */
async function checkStreakAchievements(
  userId: string,
  db: DB,
  result: AchievementCheckResult
): Promise<void> {
  const dailyStreak = await db
    .select()
    .from(streaks)
    .where(
      and(
        eq(streaks.userId, userId),
        eq(streaks.streakType, 'daily')
      )
    )
    .limit(1);

  const currentStreak = dailyStreak[0]?.currentCount || 0;

  // Check 7-Day Streak
  if (!await isAchievementUnlocked(userId, 'seven_day_streak', db)) {
    result.progress.seven_day_streak = { current: currentStreak, target: 7, percentage: Math.round((currentStreak / 7) * 100) };

    if (currentStreak >= 7) {
      await awardAchievement(userId, 'seven_day_streak', db);
      result.newlyUnlocked.push('seven_day_streak');
    }
  } else {
    result.alreadyUnlocked.push('seven_day_streak');
  }

  // Check 44-Day Streak
  if (!await isAchievementUnlocked(userId, 'forty_four_day_streak', db)) {
    result.progress.forty_four_day_streak = { current: currentStreak, target: 44, percentage: Math.round((currentStreak / 44) * 100) };

    if (currentStreak >= 44) {
      await awardAchievement(userId, 'forty_four_day_streak', db);
      result.newlyUnlocked.push('forty_four_day_streak');
    }
  } else {
    result.alreadyUnlocked.push('forty_four_day_streak');
  }
}

/**
 * Check time-based achievements (Morning Person, Night Owl)
 */
async function checkTimeBasedAchievements(
  userId: string,
  db: DB,
  result: AchievementCheckResult
): Promise<void> {
  // Check Morning Person
  if (!await isAchievementUnlocked(userId, 'morning_person', db)) {
    const morningCompletions = await db
      .select({ count: count() })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          sql`${userProgress.completedAt} IS NOT NULL`,
          sql`CAST(strftime('%H', ${userProgress.completedAt}) AS INTEGER) BETWEEN 5 AND 8`
        )
      );

    const count = Number(morningCompletions[0]?.count || 0);
    result.progress.morning_person = { current: count, target: 1, percentage: Math.min(count * 100, 100) };

    if (count >= 1) {
      await awardAchievement(userId, 'morning_person', db);
      result.newlyUnlocked.push('morning_person');
    }
  } else {
    result.alreadyUnlocked.push('morning_person');
  }

  // Check Night Owl
  if (!await isAchievementUnlocked(userId, 'night_owl', db)) {
    const nightCompletions = await db
      .select({ count: count() })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          sql`${userProgress.completedAt} IS NOT NULL`,
          sql`(CAST(strftime('%H', ${userProgress.completedAt}) AS INTEGER) >= 22 OR CAST(strftime('%H', ${userProgress.completedAt}) AS INTEGER) < 2)`
        )
      );

    const count = Number(nightCompletions[0]?.count || 0);
    result.progress.night_owl = { current: count, target: 1, percentage: Math.min(count * 100, 100) };

    if (count >= 1) {
      await awardAchievement(userId, 'night_owl', db);
      result.newlyUnlocked.push('night_owl');
    }
  } else {
    result.alreadyUnlocked.push('night_owl');
  }
}

/**
 * Check Cycle Master achievement
 */
async function checkCycleMasterAchievement(
  userId: string,
  db: DB,
  result: AchievementCheckResult
): Promise<void> {
  if (await isAchievementUnlocked(userId, 'cycle_master', db)) {
    result.alreadyUnlocked.push('cycle_master');
    return;
  }

  // Check completions during each peak type
  const cycles = ['physical', 'emotional', 'intellectual', 'spiritual'] as const;
  let peakCompletions = 0;

  for (const cycle of cycles) {
    const peakCompletion = await db
      .select({ count: count() })
      .from(userProgress)
      .innerJoin(
        biorhythmSnapshots,
        and(
          eq(userProgress.userId, biorhythmSnapshots.userId),
          sql`DATE(${userProgress.completedAt}) = ${biorhythmSnapshots.date}`
        )
      )
      .where(
        and(
          eq(userProgress.userId, userId),
          sql`${userProgress.completedAt} IS NOT NULL`,
          sql`${biorhythmSnapshots[`${cycle}Peak` as keyof typeof biorhythmSnapshots]} = 1`
        )
      );

    if (Number(peakCompletion[0]?.count || 0) > 0) {
      peakCompletions++;
    }
  }

  result.progress.cycle_master = { current: peakCompletions, target: 4, percentage: Math.round((peakCompletions / 4) * 100) };

  if (peakCompletions >= 4) {
    await awardAchievement(userId, 'cycle_master', db);
    result.newlyUnlocked.push('cycle_master');
  }
}

/**
 * Check Completionist achievement
 */
async function checkCompletionistAchievement(
  userId: string,
  db: DB,
  result: AchievementCheckResult
): Promise<void> {
  if (await isAchievementUnlocked(userId, 'completionist', db)) {
    result.alreadyUnlocked.push('completionist');
    return;
  }

  // Count unlocked achievements
  const unlockedCount = await db
    .select({ count: count() })
    .from(achievements)
    .where(
      and(
        eq(achievements.userId, userId),
        sql`${achievements.unlockedAt} IS NOT NULL`,
        sql`${achievements.achievementType} != 'completionist'`
      )
    );

  const count = Number(unlockedCount[0]?.count || 0);
  const requiredCount = ACHIEVEMENT_DEFINITIONS.length - 1; // All except completionist

  result.progress.completionist = { current: count, target: requiredCount, percentage: Math.round((count / requiredCount) * 100) };

  if (count >= requiredCount) {
    await awardAchievement(userId, 'completionist', db);
    result.newlyUnlocked.push('completionist');
  }
}

/**
 * Check all achievements for a user
 */
export async function checkAllAchievements(
  userId: string,
  db: DB
): Promise<AchievementCheckResult> {
  const result: AchievementCheckResult = {
    newlyUnlocked: [],
    alreadyUnlocked: [],
    progress: {},
  };

  await checkChapterAchievements(userId, db, result);
  await checkStreakAchievements(userId, db, result);
  await checkTimeBasedAchievements(userId, db, result);
  await checkCycleMasterAchievement(userId, db, result);
  await checkCompletionistAchievement(userId, db, result);

  return result;
}

/**
 * Trigger achievement check after specific events
 */
export async function triggerAchievementCheck(
  userId: string,
  eventType: 'chapter_completed' | 'streak_update' | 'daily_check',
  db: DB
): Promise<AchievementCheckResult> {
  return checkAllAchievements(userId, db);
}

/**
 * Get achievement details with progress
 */
export async function getAchievementDetails(
  userId: string,
  db: DB
): Promise<Array<AchievementData & { definition: AchievementDefinition; progress: { current: number; target: number; percentage: number } }>> {
  const userAchievements = await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, userId));

  const result = await checkAllAchievements(userId, db);

  return userAchievements.map(achievement => {
    const definition = ACHIEVEMENT_DEFINITIONS.find(a => a.type === achievement.achievementType)!;
    const progress = result.progress[achievement.achievementType] || { current: 0, target: 1, percentage: 0 };

    return {
      ...achievement,
      definition,
      progress,
    };
  });
}

/**
 * Get achievement statistics across all users (for admin/analytics)
 */
export async function getAchievementStats(db: DB): Promise<{
  totalAchievementsUnlocked: number;
  uniqueUsersWithAchievements: number;
  mostCommonAchievement: AchievementType | null;
  rarestAchievement: AchievementType | null;
}> {
  const unlockedAchievements = await db
    .select({ count: count() })
    .from(achievements)
    .where(sql`${achievements.unlockedAt} IS NOT NULL`);

  const uniqueUsers = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${achievements.userId})` })
    .from(achievements)
    .where(sql`${achievements.unlockedAt} IS NOT NULL`);

  const achievementCounts = await db
    .select({
      type: achievements.achievementType,
      count: count(),
    })
    .from(achievements)
    .where(sql`${achievements.unlockedAt} IS NOT NULL`)
    .groupBy(achievements.achievementType);

  const sorted = achievementCounts.sort((a, b) => Number(b.count) - Number(a.count));

  return {
    totalAchievementsUnlocked: Number(unlockedAchievements[0]?.count || 0),
    uniqueUsersWithAchievements: Number(uniqueUsers[0]?.count || 0),
    mostCommonAchievement: (sorted[0]?.type as AchievementType) || null,
    rarestAchievement: (sorted[sorted.length - 1]?.type as AchievementType) || null,
  };
}
