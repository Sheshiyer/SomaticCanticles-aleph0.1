/**
 * Chapter Unlock Evaluation Engine
 * 
 * Evaluates biorhythm conditions and determines which chapters should be unlocked
 * for a given user based on their current biorhythm state and progress history.
 */

import type { DB } from '../db';
import { userProgress, notifications } from '../../../db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

// Types
export interface BiorhythmState {
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual: number;
  physicalPeak?: boolean;
  emotionalPeak?: boolean;
  intellectualPeak?: boolean;
  spiritualPeak?: boolean;
  sunriseTime?: string | null;
}

export interface ChapterUnlockConditions {
  type: 'automatic' | 'biorhythm' | 'completion';
  physical?: {
    min?: number;
    max?: number;
    peak?: boolean;
    sustained_days?: number;
  };
  emotional?: {
    min?: number;
    max?: number;
    peak?: boolean;
    sustained_days?: number;
  };
  intellectual?: {
    min?: number;
    max?: number;
    peak?: boolean;
    sustained_days?: number;
  };
  spiritual?: {
    min?: number;
    max?: number;
    peak?: boolean;
    sustained_days?: number;
  };
  prerequisite_chapter?: number;
  description?: string;
}

export interface ChapterWithConditions {
  id: number;
  order: number;
  title: string;
  cycle: string | null;
  unlockConditions: string | null;
}

export interface UserProgressEntry {
  id: string;
  userId: string;
  chapterId: number;
  unlockedAt: string | null;
  completedAt: string | null;
  completionPercentage: number | null;
}

// Thresholds
const THRESHOLDS = {
  peak: 0.8,
  high: 0.5,
  balanced: { min: 0.3, max: 0.7 },
  low: -0.5,
  critical: 0.1,
};

/**
 * Parse unlock conditions from JSON string
 */
function parseUnlockConditions(conditionsJson: string | null): ChapterUnlockConditions | null {
  if (!conditionsJson) return null;
  try {
    return JSON.parse(conditionsJson) as ChapterUnlockConditions;
  } catch {
    return null;
  }
}

/**
 * Check if a single biorhythm condition is met
 */
function checkBiorhythmCondition(
  value: number,
  isPeak: boolean | undefined,
  condition: { min?: number; max?: number; peak?: boolean }
): boolean {
  // Check peak condition
  if (condition.peak !== undefined) {
    if (condition.peak && !isPeak && value < THRESHOLDS.peak) {
      return false;
    }
  }

  // Check min condition
  if (condition.min !== undefined && value < condition.min) {
    return false;
  }

  // Check max condition
  if (condition.max !== undefined && value > condition.max) {
    return false;
  }

  return true;
}

/**
 * Check if conditions are met for a single day
 */
function checkSingleDayConditions(
  biorhythm: BiorhythmState,
  conditions: ChapterUnlockConditions
): boolean {
  if (conditions.type === 'automatic') return true;
  if (conditions.type !== 'biorhythm') return false;

  // Check physical condition
  if (conditions.physical) {
    if (!checkBiorhythmCondition(
      biorhythm.physical,
      biorhythm.physicalPeak,
      conditions.physical
    )) {
      return false;
    }
  }

  // Check emotional condition
  if (conditions.emotional) {
    if (!checkBiorhythmCondition(
      biorhythm.emotional,
      biorhythm.emotionalPeak,
      conditions.emotional
    )) {
      return false;
    }
  }

  // Check intellectual condition
  if (conditions.intellectual) {
    if (!checkBiorhythmCondition(
      biorhythm.intellectual,
      biorhythm.intellectualPeak,
      conditions.intellectual
    )) {
      return false;
    }
  }

  // Check spiritual condition
  if (conditions.spiritual) {
    if (!checkBiorhythmCondition(
      biorhythm.spiritual,
      biorhythm.spiritualPeak,
      conditions.spiritual
    )) {
      return false;
    }
  }

  return true;
}

/**
 * Check sustained conditions by querying historical biorhythm data
 */
async function checkSustainedConditions(
  userId: string,
  conditions: ChapterUnlockConditions,
  db: DB
): Promise<boolean> {
  if (conditions.type !== 'biorhythm') return true;

  // Determine required sustained days
  const sustainedDays = Math.max(
    conditions.physical?.sustained_days || 1,
    conditions.emotional?.sustained_days || 1,
    conditions.intellectual?.sustained_days || 1,
    conditions.spiritual?.sustained_days || 1
  );

  if (sustainedDays <= 1) return true;

  // Query recent biorhythm snapshots
  const snapshots = await db.query.biorhythmSnapshots.findMany({
    where: (snapshots, { eq, and }) =>
      and(eq(snapshots.userId, userId)),
    orderBy: (snapshots, { desc }) => [desc(snapshots.date)],
    limit: sustainedDays,
  });

  if (snapshots.length < sustainedDays) {
    return false; // Not enough historical data
  }

  // Check each day
  for (const snapshot of snapshots) {
    const dailyBiorhythm: BiorhythmState = {
      physical: snapshot.physical || 0,
      emotional: snapshot.emotional || 0,
      intellectual: snapshot.intellectual || 0,
      spiritual: snapshot.spiritual || 0,
      physicalPeak: snapshot.physicalPeak ?? undefined,
      emotionalPeak: snapshot.emotionalPeak ?? undefined,
      intellectualPeak: snapshot.intellectualPeak ?? undefined,
      spiritualPeak: snapshot.spiritualPeak ?? undefined,
    };

    if (!checkSingleDayConditions(dailyBiorhythm, conditions)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a specific chapter should be unlocked
 */
async function shouldUnlockChapter(
  chapter: ChapterWithConditions,
  userId: string,
  currentBiorhythm: BiorhythmState | null,
  userProgress: UserProgressEntry[],
  db: DB
): Promise<boolean> {
  // Chapter 1 is always unlocked
  if (chapter.id === 1) return true;

  // Check if already unlocked
  const existingProgress = userProgress.find(p => p.chapterId === chapter.id);
  if (existingProgress?.unlockedAt) {
    return false; // Already unlocked
  }

  // Parse unlock conditions
  const conditions = parseUnlockConditions(chapter.unlockConditions);
  if (!conditions) {
    // Default: require previous chapter completed
    const prevChapter = userProgress.find(p => p.chapterId === chapter.id - 1);
    return prevChapter?.completedAt !== null;
  }

  // Check automatic unlock
  if (conditions.type === 'automatic') {
    return true;
  }

  // Check biorhythm conditions
  if (conditions.type === 'biorhythm') {
    if (!currentBiorhythm) {
      return false; // No biorhythm data available
    }

    // Check current day conditions
    if (!checkSingleDayConditions(currentBiorhythm, conditions)) {
      return false;
    }

    // Check sustained conditions
    const sustainedMet = await checkSustainedConditions(userId, conditions, db);
    if (!sustainedMet) {
      return false;
    }

    return true;
  }

  // Check completion-based unlock
  if (conditions.type === 'completion' && conditions.prerequisite_chapter) {
    const prereq = userProgress.find(p => p.chapterId === conditions.prerequisite_chapter);
    return prereq?.completedAt !== null;
  }

  return false;
}

/**
 * Create a notification for chapter unlock
 */
async function createUnlockNotification(
  userId: string,
  chapter: ChapterWithConditions,
  db: DB
): Promise<void> {
  const now = new Date();
  const notificationId = `notif-${userId}-${chapter.id}-${Date.now()}`;

  await db.insert(notifications).values({
    id: notificationId,
    userId,
    type: 'chapter_unlocked',
    title: `Chapter Unlocked: ${chapter.title}`,
    message: `The ${chapter.cycle} chapter "${chapter.title}" is now available for practice.`,
    data: JSON.stringify({
      chapter_id: chapter.id,
      chapter_title: chapter.title,
      cycle: chapter.cycle,
    }),
    read: false,
    createdAt: now,
  });
}

/**
 * Evaluate all chapters and unlock eligible ones
 * 
 * @param userId - The user ID to evaluate
 * @param currentBiorhythm - Current biorhythm state (optional)
 * @param userProgressData - Existing user progress entries
 * @param allChapters - All chapters with their unlock conditions
 * @param db - Database instance
 * @returns Array of newly unlocked chapter IDs
 */
export async function evaluateUnlocks(
  userId: string,
  currentBiorhythm: BiorhythmState | null,
  userProgressData: UserProgressEntry[],
  allChapters: ChapterWithConditions[],
  db: DB
): Promise<number[]> {
  const newlyUnlocked: number[] = [];
  const now = new Date();
  const nowISO = now.toISOString();

  for (const chapter of allChapters) {
    const shouldUnlock = await shouldUnlockChapter(
      chapter,
      userId,
      currentBiorhythm,
      userProgressData,
      db
    );

    if (shouldUnlock) {
      // Create unlock progress entry
      const progressId = `${userId}-${chapter.id}`;

      await db.insert(userProgress).values({
        id: progressId,
        userId,
        chapterId: chapter.id,
        unlockedAt: nowISO,
        completedAt: null,
        completionPercentage: 0,
        timeSpentSeconds: 0,
        notes: null,
        createdAt: now,
        updatedAt: now,
      }).onConflictDoUpdate({
        target: [userProgress.id],
        set: {
          unlockedAt: nowISO,
          updatedAt: now,
        },
      });

      // Create notification
      await createUnlockNotification(userId, chapter, db);

      newlyUnlocked.push(chapter.id);
    }
  }

  return newlyUnlocked;
}

/**
 * Get unlock status for a single chapter
 * 
 * @param chapterId - The chapter ID
 * @param userId - The user ID
 * @param currentBiorhythm - Current biorhythm state
 * @param userProgressData - User's progress entries
 * @param db - Database instance
 * @returns Object with unlock status and reason
 */
export async function getChapterUnlockStatus(
  chapterId: number,
  userId: string,
  currentBiorhythm: BiorhythmState | null,
  userProgressData: UserProgressEntry[],
  db: DB
): Promise<{
  unlocked: boolean;
  reason?: string;
  conditions?: ChapterUnlockConditions;
}> {
  const chapter = await db.query.chapters.findFirst({
    where: (chapters, { eq }) => eq(chapters.id, chapterId),
  });

  if (!chapter) {
    return { unlocked: false, reason: 'Chapter not found' };
  }

  const chapterWithConditions: ChapterWithConditions = {
    id: chapter.id,
    order: chapter.order,
    title: chapter.title,
    cycle: chapter.cycle,
    unlockConditions: chapter.unlockConditions,
  };

  const shouldUnlock = await shouldUnlockChapter(
    chapterWithConditions,
    userId,
    currentBiorhythm,
    userProgressData,
    db
  );

  const conditions = parseUnlockConditions(chapter.unlockConditions);

  if (shouldUnlock) {
    return { unlocked: true, conditions: conditions || undefined };
  }

  // Determine why it's locked
  if (chapterId === 1) {
    return { unlocked: true, conditions: conditions || undefined };
  }

  const existingProgress = userProgressData.find(p => p.chapterId === chapterId);
  if (existingProgress?.unlockedAt) {
    return { unlocked: true, conditions: conditions || undefined };
  }

  let reason = 'Complete previous chapters to unlock';
  if (conditions?.type === 'biorhythm') {
    reason = conditions.description || 'Specific biorhythm conditions required';
  }

  return { unlocked: false, reason, conditions: conditions || undefined };
}

/**
 * Calculate progress toward unlocking a chapter
 * 
 * @param chapterId - The chapter ID
 * @param currentBiorhythm - Current biorhythm state
 * @param db - Database instance
 * @returns Progress percentage (0-100) and details
 */
export async function calculateUnlockProgress(
  chapterId: number,
  currentBiorhythm: BiorhythmState | null,
  db: DB
): Promise<{
  percentage: number;
  details: Record<string, { current: number; required: string; met: boolean }>;
}> {
  const chapter = await db.query.chapters.findFirst({
    where: (chapters, { eq }) => eq(chapters.id, chapterId),
  });

  if (!chapter || !chapter.unlockConditions) {
    return { percentage: 0, details: {} };
  }

  const conditions = parseUnlockConditions(chapter.unlockConditions);
  if (!conditions || conditions.type !== 'biorhythm' || !currentBiorhythm) {
    return { percentage: 0, details: {} };
  }

  const details: Record<string, { current: number; required: string; met: boolean }> = {};
  let conditionsMet = 0;
  let totalConditions = 0;

  // Check each cycle condition
  const cycleMap: Array<{ key: 'physical' | 'emotional' | 'intellectual' | 'spiritual'; conditionKey: keyof ChapterUnlockConditions }> = [
    { key: 'physical', conditionKey: 'physical' },
    { key: 'emotional', conditionKey: 'emotional' },
    { key: 'intellectual', conditionKey: 'intellectual' },
    { key: 'spiritual', conditionKey: 'spiritual' },
  ];

  for (const { key: cycle, conditionKey } of cycleMap) {
    const condition = conditions[conditionKey] as { min?: number; max?: number; peak?: boolean } | undefined;
    if (!condition) continue;

    totalConditions++;
    const current: number = currentBiorhythm[cycle] || 0;
    const peakKey = `${cycle}Peak` as 'physicalPeak' | 'emotionalPeak' | 'intellectualPeak' | 'spiritualPeak';
    const isPeak = currentBiorhythm[peakKey];

    let met = true;
    let required = '';

    if (condition.peak) {
      met = isPeak === true || current >= THRESHOLDS.peak;
      required = 'Peak (≥80%)';
    } else {
      const min = typeof condition.min === 'number' ? condition.min : undefined;
      const max = typeof condition.max === 'number' ? condition.max : undefined;

      if (min !== undefined && max !== undefined) {
        met = current >= min && current <= max;
        required = `${Math.round(min * 100)}% - ${Math.round(max * 100)}%`;
      } else if (min !== undefined) {
        met = current >= min;
        required = `≥${Math.round(min * 100)}%`;
      } else if (max !== undefined) {
        met = current <= max;
        required = `≤${Math.round(max * 100)}%`;
      }
    }

    if (met) conditionsMet++;

    details[cycle] = {
      current: Math.round(current * 100),
      required,
      met,
    };
  }

  const percentage = totalConditions > 0
    ? Math.round((conditionsMet / totalConditions) * 100)
    : 0;

  return { percentage, details };
}
