import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and, desc, sql, count, sum, gte } from 'drizzle-orm';
import type { Env, Variables } from '../index';
import { createDb } from '../../lib/db';
import { userProgress, chapters, achievements, streaks, biorhythmSnapshots } from '../../db/schema';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply auth middleware to all routes
app.use('*', authMiddleware);

/**
 * GET /progress/stats - Get overall progress statistics
 */
app.get('/stats', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const db = createDb(c.env.DB);

  // Get total chapters count
  const totalChaptersResult = await db
    .select({ count: count() })
    .from(chapters);
  const totalChapters = totalChaptersResult[0]?.count || 12;

  // Get user's progress stats
  const progressStats = await db
    .select({
      completedCount: count(),
      totalTimeSpent: sum(userProgress.timeSpentSeconds),
    })
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, user.id),
        sql`${userProgress.completedAt} IS NOT NULL`
      )
    );

  // Get unlocked count
  const unlockedStats = await db
    .select({
      unlockedCount: count(),
    })
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, user.id),
        sql`${userProgress.unlockedAt} IS NOT NULL`
      )
    );

  // Get streak data
  const streakData = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, user.id));

  const dailyStreak = streakData.find(s => s.streakType === 'daily');
  const currentStreak = dailyStreak?.currentCount || 0;
  const longestStreak = dailyStreak?.longestCount || 0;

  // Calculate completion percentage
  const completedCount = Number(progressStats[0]?.completedCount || 0);
  const unlockedCount = Number(unlockedStats[0]?.unlockedCount || 0);
  const completionPercentage = Math.round((completedCount / totalChapters) * 100);

  // Get achievement count
  const achievementCount = await db
    .select({ count: count() })
    .from(achievements)
    .where(
      and(
        eq(achievements.userId, user.id),
        sql`${achievements.unlockedAt} IS NOT NULL`
      )
    );

  // Get total time spent in hours and minutes
  const totalSeconds = Number(progressStats[0]?.totalTimeSpent || 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

  return c.json({
    stats: {
      totalChapters,
      completedChapters: completedCount,
      unlockedChapters: unlockedCount,
      completionPercentage,
      totalTimeSpent: {
        hours: totalHours,
        minutes: totalMinutes,
        totalSeconds,
      },
      currentStreak,
      longestStreak,
      achievementsUnlocked: Number(achievementCount[0]?.count || 0),
    },
  });
});

/**
 * GET /progress/recent - Get recent activity
 */
app.get('/recent', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const db = createDb(c.env.DB);

  // Get query parameters
  const limit = parseInt(c.req.query('limit') || '10', 10);
  const offset = parseInt(c.req.query('offset') || '0', 10);

  // Get recent progress updates
  const recentProgress = await db
    .select({
      id: userProgress.id,
      chapterId: userProgress.chapterId,
      chapterTitle: chapters.title,
      chapterCycle: chapters.cycle,
      unlockedAt: userProgress.unlockedAt,
      completedAt: userProgress.completedAt,
      timeSpentSeconds: userProgress.timeSpentSeconds,
      completionPercentage: userProgress.completionPercentage,
      updatedAt: userProgress.updatedAt,
    })
    .from(userProgress)
    .innerJoin(chapters, eq(userProgress.chapterId, chapters.id))
    .where(eq(userProgress.userId, user.id))
    .orderBy(desc(userProgress.updatedAt))
    .limit(limit)
    .offset(offset);

  // Get recent achievements
  const recentAchievements = await db
    .select({
      id: achievements.id,
      type: achievements.achievementType,
      title: achievements.title,
      description: achievements.description,
      unlockedAt: achievements.unlockedAt,
      iconUrl: achievements.iconUrl,
    })
    .from(achievements)
    .where(
      and(
        eq(achievements.userId, user.id),
        sql`${achievements.unlockedAt} IS NOT NULL`
      )
    )
    .orderBy(desc(achievements.unlockedAt))
    .limit(limit);

  // Get recent streak updates
  const recentStreaks = await db
    .select({
      streakType: streaks.streakType,
      currentCount: streaks.currentCount,
      longestCount: streaks.longestCount,
      lastActivityDate: streaks.lastActivityDate,
      updatedAt: streaks.updatedAt,
    })
    .from(streaks)
    .where(eq(streaks.userId, user.id))
    .orderBy(desc(streaks.updatedAt))
    .limit(limit);

  // Combine and format activities
  const activities = [
    ...recentProgress.map(p => ({
      type: p.completedAt ? 'chapter_completed' : 'chapter_unlocked' as const,
      id: p.id,
      title: p.chapterTitle,
      cycle: p.chapterCycle,
      chapterId: p.chapterId,
      timestamp: p.updatedAt,
      details: {
        completed: !!p.completedAt,
        completionPercentage: p.completionPercentage,
        timeSpentSeconds: p.timeSpentSeconds,
      },
    })),
    ...recentAchievements.map(a => ({
      type: 'achievement_unlocked' as const,
      id: a.id,
      title: a.title,
      achievementType: a.type,
      timestamp: a.unlockedAt,
      details: {
        description: a.description,
        iconUrl: a.iconUrl,
      },
    })),
    ...recentStreaks
      .filter(s => s.currentCount > 0)
      .map(s => ({
        type: 'streak_milestone' as const,
        id: `${user.id}-${s.streakType}`,
        streakType: s.streakType,
        currentCount: s.currentCount,
        timestamp: s.updatedAt,
        details: {
          longestCount: s.longestCount,
          lastActivityDate: s.lastActivityDate,
        },
      })),
  ].sort((a, b) => 
    new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
  ).slice(0, limit);

  return c.json({
    activities,
    pagination: {
      limit,
      offset,
      hasMore: recentProgress.length === limit,
    },
  });
});

/**
 * GET /progress/achievements - Get achievement progress
 */
app.get('/achievements', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const db = createDb(c.env.DB);

  // Get all achievements for the user
  const userAchievements = await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, user.id));

  // Get progress stats for calculating partial achievements
  const progressStats = await db
    .select({
      completedCount: count(),
    })
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, user.id),
        sql`${userProgress.completedAt} IS NOT NULL`
      )
    );

  const streakData = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, user.id));

  const completedCount = Number(progressStats[0]?.completedCount || 0);
  const dailyStreak = streakData.find(s => s.streakType === 'daily');

  // Calculate progress for each achievement
  const achievementProgress = userAchievements.map(achievement => {
    let progress = 0;
    let target = 1;

    switch (achievement.achievementType) {
      case 'first_chapter':
        progress = Math.min(completedCount, 1);
        target = 1;
        break;
      case 'chapter_master':
        progress = completedCount;
        target = 12;
        break;
      case 'seven_day_streak':
        progress = dailyStreak?.currentCount || 0;
        target = 7;
        break;
      case 'forty_four_day_streak':
        progress = dailyStreak?.currentCount || 0;
        target = 44;
        break;
      case 'morning_person':
      case 'night_owl':
      case 'cycle_master':
      case 'completionist':
        progress = achievement.unlockedAt ? 1 : 0;
        target = 1;
        break;
    }

    return {
      ...achievement,
      progress: {
        current: progress,
        target,
        percentage: Math.round((progress / target) * 100),
      },
    };
  });

  // Calculate summary
  const totalAchievements = achievementProgress.length;
  const unlockedAchievements = achievementProgress.filter(a => a.unlockedAt).length;

  return c.json({
    achievements: achievementProgress,
    summary: {
      total: totalAchievements,
      unlocked: unlockedAchievements,
      locked: totalAchievements - unlockedAchievements,
      completionPercentage: Math.round((unlockedAchievements / totalAchievements) * 100),
    },
  });
});

/**
 * POST /progress/track - Track progress update
 */
const trackProgressSchema = z.object({
  chapterId: z.number().int().positive(),
  action: z.enum(['start', 'complete', 'progress']),
  progressPercentage: z.number().int().min(0).max(100).optional(),
  timeSpentSeconds: z.number().int().min(0).optional(),
  notes: z.string().max(1000).optional(),
});

app.post('/track', zValidator('json', trackProgressSchema), async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const data = c.req.valid('json');
  const db = createDb(c.env.DB);
  const now = new Date().toISOString();

  const progressId = `${user.id}-${data.chapterId}`;

  try {
    // Check if chapter exists and is unlocked
    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, user.id),
          eq(userProgress.chapterId, data.chapterId)
        )
      )
      .limit(1);

    if (existingProgress.length === 0 || !existingProgress[0].unlockedAt) {
      return c.json({ error: 'Chapter not unlocked' }, 403);
    }

    // Update progress based on action
    const updateData: Partial<typeof userProgress.$inferInsert> = {
      updatedAt: now,
    };

    if (data.action === 'complete') {
      updateData.completedAt = now;
      updateData.completionPercentage = 100;
    } else if (data.progressPercentage !== undefined) {
      updateData.completionPercentage = data.progressPercentage;
    }

    if (data.timeSpentSeconds !== undefined) {
      const currentTime = existingProgress[0].timeSpentSeconds || 0;
      updateData.timeSpentSeconds = currentTime + data.timeSpentSeconds;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    await db
      .update(userProgress)
      .set(updateData)
      .where(eq(userProgress.id, progressId));

    return c.json({
      success: true,
      message: `Progress tracked for chapter ${data.chapterId}`,
      progress: {
        chapterId: data.chapterId,
        action: data.action,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error('Error tracking progress:', error);
    return c.json({ error: 'Failed to track progress' }, 500);
  }
});

/**
 * GET /progress/chapter/:chapterId - Get specific chapter progress
 */
app.get('/chapter/:chapterId', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const chapterId = parseInt(c.req.param('chapterId'), 10);
  if (isNaN(chapterId)) {
    return c.json({ error: 'Invalid chapter ID' }, 400);
  }

  const db = createDb(c.env.DB);

  const progress = await db
    .select({
      id: userProgress.id,
      chapterId: userProgress.chapterId,
      chapterTitle: chapters.title,
      chapterCycle: chapters.cycle,
      unlockedAt: userProgress.unlockedAt,
      completedAt: userProgress.completedAt,
      timeSpentSeconds: userProgress.timeSpentSeconds,
      completionPercentage: userProgress.completionPercentage,
      notes: userProgress.notes,
      updatedAt: userProgress.updatedAt,
    })
    .from(userProgress)
    .innerJoin(chapters, eq(userProgress.chapterId, chapters.id))
    .where(
      and(
        eq(userProgress.userId, user.id),
        eq(userProgress.chapterId, chapterId)
      )
    )
    .limit(1);

  if (progress.length === 0) {
    return c.json({ error: 'Progress not found' }, 404);
  }

  return c.json({ progress: progress[0] });
});

export default app;
