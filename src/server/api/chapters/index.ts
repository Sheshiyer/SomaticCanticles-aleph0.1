/**
 * Chapters API Endpoints
 * 
 * GET  /chapters/list - Get all chapters with unlock status
 * GET  /chapters/:id - Get chapter detail with content
 * GET  /chapters/progress - Get all chapter progress for user
 * POST /chapters/progress - Update chapter progress
 * POST /chapters/check-unlock - Check and trigger unlocks
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../index';
import { jwtAuth, type AuthVariables } from '../middleware/auth';
import { db } from '../../../db';
import { chapters, userProgress } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { evaluateUnlocks } from '../../lib/chapters/unlock-engine';
import { allChapters, getChapterById } from '../../../lib/lore/chapter-content';

const app = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// Helper functions for mapping chapter content
function getElementForCycle(cycle: string): string {
  const elements: Record<string, string> = {
    physical: 'Earth',
    emotional: 'Water',
    intellectual: 'Air',
    spiritual: 'Fire',
  };
  return elements[cycle] || 'Earth';
}

function getTarotForChapter(chapterId: number): string {
  const tarot: Record<number, string> = {
    1: 'The Fool - New beginnings',
    2: 'The Magician - Manifestation',
    3: 'The High Priestess - Intuition',
    4: 'The Empress - Abundance',
    5: 'The Hierophant - Tradition',
    6: 'The Lovers - Choice',
    7: 'The Chariot - Willpower',
    8: 'Strength - Inner power',
    9: 'The Hermit - Soul-searching',
    10: 'Wheel of Fortune - Cycles',
    11: 'Justice - Balance',
    12: 'The World - Completion',
  };
  return tarot[chapterId] || 'Unknown';
}

// Validation schemas
const updateProgressSchema = z.object({
  chapter_id: z.number().int().min(1).max(12),
  completion_percentage: z.number().int().min(0).max(100).optional(),
  time_spent_seconds: z.number().int().min(0).optional(),
  notes: z.string().max(2000).optional(),
  mark_complete: z.boolean().optional(),
});

// Type for chapter with unlock status
interface ChapterWithStatus {
  id: number;
  order: number;
  title: string;
  subtitle: string | null;
  cycle: string | null;
  duration_minutes: number | null;
  description: string | null;
  icon_url: string | null;
  color_theme: string | null;
  unlock_status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  progress: number;
  unlocked_at: string | null;
  completed_at: string | null;
}

// Type for chapter content
interface ChapterContent {
  intro: {
    title: string;
    text: string;
    duration_minutes: number;
  };
  practice: {
    title: string;
    focus: string;
    instructions: string[];
    duration_minutes: number;
  };
  reflection: {
    title: string;
    questions: string[];
    duration_minutes: number;
  };
}

interface ChapterDetail extends ChapterWithStatus {
  content: ChapterContent | null;
  audio_url: string | null;
  lore_metadata: Record<string, unknown> | null;
  unlock_conditions: Record<string, unknown> | null;
}

/**
 * GET /chapters/list
 * Returns all 12 chapters with unlock status for authenticated user
 */
app.get('/list', jwtAuth, async (c) => {
  try {
    const user = c.get('user');
    // const db = createDB(c.env.DB);

    // Get all chapters
    const allChapters = await db.query.chapters.findMany({
      orderBy: (chapters, { asc }) => [asc(chapters.order)],
    });

    // Get user's progress for all chapters
    const userProgressData = await db.query.userProgress.findMany({
      where: (progress, { eq }) => eq(progress.userId, user.id),
    });

    // Create a map of chapter_id to progress
    const progressMap = new Map(
      userProgressData.map(p => [p.chapterId, p])
    );

    // Determine unlock status for each chapter
    const chaptersWithStatus: ChapterWithStatus[] = allChapters.map(chapter => {
      const progress = progressMap.get(chapter.id);

      let unlockStatus: ChapterWithStatus['unlock_status'] = 'locked';
      if (progress?.completedAt) {
        unlockStatus = 'completed';
      } else if (progress?.unlockedAt) {
        unlockStatus = progress.completionPercentage && progress.completionPercentage > 0
          ? 'in_progress'
          : 'unlocked';
      } else if (chapter.id === 1) {
        // Chapter 1 is always unlocked
        unlockStatus = 'unlocked';
      }

      return {
        id: chapter.id,
        order: chapter.order,
        title: chapter.title,
        subtitle: chapter.subtitle,
        cycle: chapter.cycle,
        duration_minutes: chapter.durationMinutes,
        description: chapter.description,
        icon_url: chapter.iconUrl,
        color_theme: chapter.colorTheme,
        unlock_status: unlockStatus,
        progress: progress?.completionPercentage || 0,
        unlocked_at: progress?.unlockedAt || null,
        completed_at: progress?.completedAt || null,
      };
    });

    return c.json({
      success: true,
      data: {
        chapters: chaptersWithStatus,
        total: chaptersWithStatus.length,
        unlocked: chaptersWithStatus.filter(c => c.unlock_status !== 'locked').length,
        completed: chaptersWithStatus.filter(c => c.unlock_status === 'completed').length,
      },
    }, 200);

  } catch (error) {
    console.error('Chapters list error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CHAPTERS_LIST_ERROR',
        message: 'Failed to fetch chapters list',
      },
    }, 500);
  }
});

/**
 * GET /chapters/:id
 * Returns chapter detail with full content (only if unlocked)
 */
app.get('/:id', jwtAuth, async (c) => {
  try {
    const user = c.get('user');
    const chapterId = parseInt(c.req.param('id'), 10);

    if (isNaN(chapterId) || chapterId < 1 || chapterId > 12) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_CHAPTER_ID',
          message: 'Chapter ID must be a number between 1 and 12',
        },
      }, 400);
    }

    // const db = createDB(c.env.DB);

    // Get chapter details
    const chapter = await db.query.chapters.findFirst({
      where: (chapters, { eq }) => eq(chapters.id, chapterId),
    });

    if (!chapter) {
      return c.json({
        success: false,
        error: {
          code: 'CHAPTER_NOT_FOUND',
          message: 'Chapter not found',
        },
      }, 404);
    }

    // Get user's progress for this chapter
    const progress = await db.query.userProgress.findFirst({
      where: (progress, { eq, and }) =>
        and(eq(progress.userId, user.id), eq(progress.chapterId, chapterId)),
    });

    // Check if chapter is unlocked (chapter 1 is always unlocked)
    const isUnlocked = chapterId === 1 || progress?.unlockedAt !== null;

    if (!isUnlocked) {
      return c.json({
        success: false,
        error: {
          code: 'CHAPTER_LOCKED',
          message: 'This chapter is locked. Complete prerequisites to unlock.',
        },
        data: {
          id: chapter.id,
          title: chapter.title,
          subtitle: chapter.subtitle,
          cycle: chapter.cycle,
          unlock_status: 'locked',
        },
      }, 403);
    }

    // Parse JSON fields from database
    let content: ChapterContent | null = null;
    let loreMetadata: Record<string, unknown> | null = null;
    let unlockConditions: Record<string, unknown> | null = null;

    try {
      content = chapter.content ? JSON.parse(chapter.content) : null;
      loreMetadata = chapter.loreMetadata ? JSON.parse(chapter.loreMetadata) : null;
      unlockConditions = chapter.unlockConditions ? JSON.parse(chapter.unlockConditions) : null;
    } catch (e) {
      console.error('Failed to parse chapter JSON fields:', e);
    }

    // If no content in database, use static content from chapter-content.ts
    if (!content) {
      const staticContent = getChapterById(chapterId);
      if (staticContent) {
        content = {
          intro: {
            title: "Story Context",
            text: staticContent.storyContext.excerpt,
            duration_minutes: 2,
          },
          practice: {
            title: staticContent.practice.title,
            focus: staticContent.storyContext.keyInsight,
            instructions: staticContent.practice.steps,
            duration_minutes: staticContent.practice.durationMinutes,
          },
          reflection: {
            title: "Reflection",
            questions: staticContent.reflection.prompts,
            duration_minutes: 3,
          },
        };

        // Build lore metadata from static content
        if (!loreMetadata) {
          loreMetadata = {
            affirmation: staticContent.storyContext.keyInsight,
            character_focus: staticContent.storyContext.characterFocus,
            somatic_event: staticContent.storyContext.somaticEvent,
            element: getElementForCycle(staticContent.cycle),
            tarot: getTarotForChapter(chapterId),
            meaning: staticContent.storyContext.keyInsight,
          };
        }
      }
    }

    // Determine unlock status
    let unlockStatus: ChapterDetail['unlock_status'] = 'unlocked';
    if (progress?.completedAt) {
      unlockStatus = 'completed';
    } else if (progress?.completionPercentage && progress.completionPercentage > 0) {
      unlockStatus = 'in_progress';
    }

    const chapterDetail: ChapterDetail = {
      id: chapter.id,
      order: chapter.order,
      title: chapter.title,
      subtitle: chapter.subtitle,
      cycle: chapter.cycle,
      duration_minutes: chapter.durationMinutes,
      description: chapter.description,
      icon_url: chapter.iconUrl,
      color_theme: chapter.colorTheme,
      unlock_status: unlockStatus,
      progress: progress?.completionPercentage || 0,
      unlocked_at: progress?.unlockedAt || null,
      completed_at: progress?.completedAt || null,
      content,
      audio_url: chapter.audioUrl,
      lore_metadata: loreMetadata,
      unlock_conditions: unlockConditions,
    };

    return c.json({
      success: true,
      data: chapterDetail,
    }, 200);

  } catch (error) {
    console.error('Chapter detail error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CHAPTER_DETAIL_ERROR',
        message: 'Failed to fetch chapter details',
      },
    }, 500);
  }
});

/**
 * GET /chapters/progress
 * Get all chapter progress for authenticated user
 */
app.get('/progress', jwtAuth, async (c) => {
  try {
    const user = c.get('user');
    // const db = createDB(c.env.DB);

    // Get all chapters with progress info
    const progressData = await db.query.userProgress.findMany({
      where: (progress, { eq }) => eq(progress.userId, user.id),
      with: {
        chapter: true,
      },
    });

    const formattedProgress = progressData.map(p => {
      const chapterData = p.chapter as { title?: string; order?: number } | undefined;
      return {
        chapter_id: p.chapterId,
        chapter_title: chapterData?.title ?? null,
        chapter_order: chapterData?.order ?? null,
        completion_percentage: p.completionPercentage ?? 0,
        time_spent_seconds: p.timeSpentSeconds ?? 0,
        notes: p.notes,
        unlocked_at: p.unlockedAt,
        completed_at: p.completedAt,
        updated_at: p.updatedAt,
      };
    });

    return c.json({
      success: true,
      data: {
        progress: formattedProgress,
        total_chapters: 12,
        completed: formattedProgress.filter(p => p.completed_at).length,
        in_progress: formattedProgress.filter(p => !p.completed_at && (p.completion_percentage ?? 0) > 0).length,
        total_time_spent: formattedProgress.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0),
      },
    }, 200);

  } catch (error) {
    console.error('Get progress error:', error);
    return c.json({
      success: false,
      error: {
        code: 'GET_PROGRESS_ERROR',
        message: 'Failed to fetch progress',
      },
    }, 500);
  }
});

/**
 * POST /chapters/progress
 * Update chapter progress for authenticated user
 */
app.post('/progress', jwtAuth, zValidator('json', updateProgressSchema), async (c) => {
  try {
    const user = c.get('user');
    const body = c.req.valid('json');
    // const db = createDB(c.env.DB);

    // Verify chapter exists and is unlocked
    const chapter = await db.query.chapters.findFirst({
      where: (chapters, { eq }) => eq(chapters.id, body.chapter_id),
    });

    if (!chapter) {
      return c.json({
        success: false,
        error: {
          code: 'CHAPTER_NOT_FOUND',
          message: 'Chapter not found',
        },
      }, 404);
    }

    const progress = await db.query.userProgress.findFirst({
      where: (progress, { eq, and }) =>
        and(eq(progress.userId, user.id), eq(progress.chapterId, body.chapter_id)),
    });

    // Chapter 1 is always unlocked, others must be unlocked
    const isUnlocked = body.chapter_id === 1 || progress?.unlockedAt !== null;

    if (!isUnlocked) {
      return c.json({
        success: false,
        error: {
          code: 'CHAPTER_LOCKED',
          message: 'Cannot update progress for locked chapter',
        },
      }, 403);
    }

    const now = new Date();
    const nowISO = now.toISOString();
    const completionPercentage = body.mark_complete ? 100 : (body.completion_percentage ?? progress?.completionPercentage ?? 0);
    const completedAt = body.mark_complete ? nowISO : (progress?.completedAt ?? null);

    if (progress) {
      // Update existing progress
      await db.update(userProgress)
        .set({
          completionPercentage,
          timeSpentSeconds: body.time_spent_seconds !== undefined
            ? (progress.timeSpentSeconds || 0) + body.time_spent_seconds
            : progress.timeSpentSeconds,
          notes: body.notes !== undefined ? body.notes : progress.notes,
          completedAt,
          updatedAt: now,
        })
        .where(eq(userProgress.id, progress.id));
    } else {
      // Create new progress entry
      await db.insert(userProgress).values({
        id: `${user.id}-${body.chapter_id}`,
        userId: user.id,
        chapterId: body.chapter_id,
        unlockedAt: body.chapter_id === 1 ? nowISO : null,
        completedAt,
        completionPercentage,
        timeSpentSeconds: body.time_spent_seconds || 0,
        notes: body.notes || null,
        createdAt: now,
        updatedAt: now,
      });
    }

    return c.json({
      success: true,
      data: {
        chapter_id: body.chapter_id,
        completion_percentage: completionPercentage,
        completed: completedAt !== null,
        message: body.mark_complete ? 'Chapter marked as complete!' : 'Progress updated',
      },
    }, 200);

  } catch (error) {
    console.error('Update progress error:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_PROGRESS_ERROR',
        message: 'Failed to update progress',
      },
    }, 500);
  }
});

/**
 * POST /chapters/check-unlock
 * Run unlock evaluation for current user and return newly unlocked chapters
 */
app.post('/check-unlock', jwtAuth, async (c) => {
  try {
    const user = c.get('user');
    // const db = createDB(c.env.DB);

    // Get user's birthdate
    const userRecord = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, user.id),
    });

    if (!userRecord?.birthdate) {
      return c.json({
        success: false,
        error: {
          code: 'BIRTHDATE_REQUIRED',
          message: 'Please set your birthdate to check chapter unlocks',
        },
      }, 400);
    }

    // Get current biorhythm data
    const today = new Date().toISOString().split('T')[0]!;
    const biorhythmSnapshot = await db.query.biorhythmSnapshots.findFirst({
      where: (snapshots, { eq, and }) =>
        and(eq(snapshots.userId, user.id), eq(snapshots.date, today)),
    });

    // Get user's current progress
    const userProgressData = await db.query.userProgress.findMany({
      where: (progress, { eq }) => eq(progress.userId, user.id),
    });

    // Build current biorhythm state
    const currentBiorhythm = biorhythmSnapshot ? {
      physical: biorhythmSnapshot.physical || 0,
      emotional: biorhythmSnapshot.emotional || 0,
      intellectual: biorhythmSnapshot.intellectual || 0,
      spiritual: biorhythmSnapshot.spiritual || 0,
      physicalPeak: biorhythmSnapshot.physicalPeak ?? undefined,
      emotionalPeak: biorhythmSnapshot.emotionalPeak ?? undefined,
      intellectualPeak: biorhythmSnapshot.intellectualPeak ?? undefined,
      spiritualPeak: biorhythmSnapshot.spiritualPeak ?? undefined,
      sunriseTime: biorhythmSnapshot.sunriseTime,
    } : null;

    // Get all chapters with unlock conditions
    const allChapters = await db.query.chapters.findMany({
      orderBy: (chapters, { asc }) => [asc(chapters.order)],
    });

    // Evaluate unlocks
    const unlockedChapterIds = await evaluateUnlocks(
      user.id,
      currentBiorhythm,
      userProgressData,
      allChapters,
      db
    );

    // Get details of newly unlocked chapters
    const newlyUnlocked = await Promise.all(
      unlockedChapterIds.map(async (chapterId) => {
        const chapter = allChapters.find(c => c.id === chapterId);
        return {
          chapter_id: chapterId,
          title: chapter?.title,
          cycle: chapter?.cycle,
        };
      })
    );

    return c.json({
      success: true,
      data: {
        newly_unlocked: newlyUnlocked,
        total_unlocked: userProgressData.length + newlyUnlocked.length,
        biorhythm_checked: currentBiorhythm !== null,
      },
    }, 200);

  } catch (error) {
    console.error('Check unlock error:', error);
    return c.json({
      success: false,
      error: {
        code: 'CHECK_UNLOCK_ERROR',
        message: 'Failed to check chapter unlocks',
      },
    }, 500);
  }
});

export default app;
