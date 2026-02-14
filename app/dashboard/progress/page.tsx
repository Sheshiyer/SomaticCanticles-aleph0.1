'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, BookOpen, Flame, Trophy, TrendingUp, Calendar, ChevronRight, Activity, CheckCircle2, Scroll
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { TechFrame, HudPanel, DataDisplay } from '@/components/ui/frame';
import { Button } from '@/components/ui/button';
import { trilogyData } from '@/lib/lore/trilogy-data';
import { LORE_DEFINITIONS } from '@/lib/chapters/lore';
import { toast } from 'sonner';

interface ProgressStats {
  totalChapters: number;
  completedChapters: number;
  unlockedChapters: number;
  completionPercentage: number;
  totalTimeSpent: { hours: number; minutes: number; totalSeconds: number };
  currentStreak: number;
  longestStreak: number;
  achievementsUnlocked: number;
}

interface ActivityItem {
  type: 'chapter_completed' | 'chapter_unlocked' | 'achievement_unlocked' | 'streak_milestone';
  id: string;
  title: string;
  timestamp: string;
  details?: Record<string, unknown>;
  cycle?: string;
  chapterId?: number;
  achievementType?: string;
  streakType?: string;
  currentCount?: number;
}

type ChapterUnlockStatus = 'locked' | 'unlocked' | 'in-progress' | 'in_progress' | 'completed';

interface ChapterListItem {
  id: number;
  order: number;
  title: string;
  cycle?: string | null;
  unlock_status: ChapterUnlockStatus;
}

function normalizeUnlockStatus(status: ChapterUnlockStatus): 'locked' | 'unlocked' | 'in-progress' | 'completed' {
  if (status === 'in_progress') return 'in-progress';
  return status;
}

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [chapterList, setChapterList] = useState<ChapterListItem[]>([]);
  const [achievementTotal, setAchievementTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      
      const [statsRes, activityRes] = await Promise.all([
        fetch(`/api/progress/stats`, { credentials: 'include' }),
        fetch(`/api/progress/recent?limit=10`, { credentials: 'include' })
      ]);

      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      if (!activityRes.ok) throw new Error('Failed to fetch activities');

      const [statsData, activityData] = await Promise.all([
        statsRes.json(),
        activityRes.json()
      ]);

      setStats(statsData.stats);
      setActivities(activityData.activities);

      // Optional parallel data: chapter topology + achievement summary
      const [chaptersResult, achievementsResult] = await Promise.allSettled([
        fetch(`/api/chapters/list`, { credentials: 'include' }),
        fetch(`/api/progress/achievements`, { credentials: 'include' }),
      ]);

      if (chaptersResult.status === 'fulfilled' && chaptersResult.value.ok) {
        const chaptersData = await chaptersResult.value.json();
        const chapters = Array.isArray(chaptersData?.data?.chapters)
          ? chaptersData.data.chapters.map((chapter: Record<string, unknown>) => ({
              id: Number(chapter.id),
              order: Number(chapter.order),
              title: String(chapter.title ?? `Chapter ${chapter.order}`),
              cycle: (chapter.cycle as string | null | undefined) ?? null,
              unlock_status: (chapter.unlock_status as ChapterUnlockStatus | undefined) ?? 'locked',
            }))
          : [];

        setChapterList(
          chapters
            .filter((chapter: ChapterListItem) => Number.isFinite(chapter.id) && Number.isFinite(chapter.order))
            .sort((a: ChapterListItem, b: ChapterListItem) => a.order - b.order)
        );
      } else {
        setChapterList([]);
      }

      if (achievementsResult.status === 'fulfilled' && achievementsResult.value.ok) {
        const achievementsData = await achievementsResult.value.json();
        setAchievementTotal(Number(achievementsData?.summary?.total || 0));
      } else {
        setAchievementTotal(0);
      }
    } catch (error) {
      toast.error('Failed to load progress data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (hours: number, minutes: number) => {
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'chapter_completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'chapter_unlocked': return <TrendingUp className="h-4 w-4 text-cyan-500" />;
      case 'achievement_unlocked': return <Trophy className="h-4 w-4 text-amber-500" />;
      case 'streak_milestone': return <Flame className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityStyles = (type: ActivityItem['type']) => {
    switch (type) {
      case 'chapter_completed': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'chapter_unlocked': return 'bg-cyan-500/10 border-cyan-500/20';
      case 'achievement_unlocked': return 'bg-amber-500/10 border-amber-500/20';
      case 'streak_milestone': return 'bg-orange-500/10 border-orange-500/20';
      default: return 'bg-metal-800/50 border-metal-700';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const totalChapters = stats?.totalChapters || chapterList.length || 0;
  const resolvedAchievementTotal = achievementTotal || Math.max(stats?.achievementsUnlocked || 0, 0);
  const chapterSlots =
    chapterList.length > 0
      ? chapterList.map((chapter) => ({
          id: chapter.id,
          order: chapter.order,
          title: chapter.title,
          unlock_status: normalizeUnlockStatus(chapter.unlock_status),
        }))
      : Array.from({ length: totalChapters }, (_, index) => {
          const chapterNum = index + 1;
          const completed = chapterNum <= (stats?.completedChapters || 0);
          const unlocked = chapterNum <= (stats?.unlockedChapters || 0);
          return {
            id: chapterNum,
            order: chapterNum,
            title: `Chapter ${chapterNum}`,
            unlock_status: completed ? 'completed' as const : unlocked ? 'unlocked' as const : 'locked' as const,
          };
        });

  const loreEntriesTotal = Object.keys(LORE_DEFINITIONS).length;
  const unlockedLoreNodes = chapterSlots.filter((chapter) => chapter.unlock_status !== 'locked').length;
  const completedLoreNodes = chapterSlots.filter((chapter) => chapter.unlock_status === 'completed').length;
  const trilogyBooks = trilogyData.books.map((book) => {
    const chapterNumbers = new Set(book.chapters.map((chapter) => chapter.chapter_number));
    const matchedSlots = chapterSlots.filter((slot) => chapterNumbers.has(slot.order));
    const totalInBook = matchedSlots.length > 0 ? matchedSlots.length : book.chapters.length;
    const unlockedInBook = matchedSlots.filter((slot) => slot.unlock_status !== 'locked').length;
    const completedInBook = matchedSlots.filter((slot) => slot.unlock_status === 'completed').length;
    const progress = totalInBook > 0 ? Math.round((completedInBook / totalInBook) * 100) : 0;
    return {
      id: book.id,
      title: book.title,
      total: totalInBook,
      unlocked: unlockedInBook,
      completed: completedInBook,
      progress,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-metallic">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your journey through {totalChapters || 'your'} somatic canticles
        </p>
      </div>

      {/* Stats Cards - DataDisplay */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DataDisplay
            label="Total Time"
            value={stats ? formatTime(stats.totalTimeSpent.hours, stats.totalTimeSpent.minutes) : '0m'}
            icon={<Clock className="h-4 w-4" />}
            variant="default"
            trendValue="Across all chapters"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DataDisplay
            label="Chapters Completed"
            value={`${stats?.completedChapters || 0} / ${totalChapters || 0}`}
            icon={<BookOpen className="h-4 w-4" />}
            variant="success"
            trendValue={`${stats?.completionPercentage || 0}% complete`}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataDisplay
            label="Current Streak"
            value={`${stats?.currentStreak || 0} days`}
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            variant="warning"
            trendValue={`Best: ${stats?.longestStreak || 0} days`}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DataDisplay
            label="Achievements"
            value={`${stats?.achievementsUnlocked || 0} / ${resolvedAchievementTotal || 0}`}
            icon={<Trophy className="h-4 w-4 text-amber-500" />}
            variant="tech"
            trendValue={resolvedAchievementTotal ? 'Live achievement total' : 'Achievement scan pending'}
          />
        </motion.div>
      </div>

      {/* Overall Progress - HudPanel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <HudPanel title="Overall Progress" variant="tech" className="scan-lines">
          <p className="text-sm text-muted-foreground mb-6">
            Your journey through all {totalChapters || 0} chapters
          </p>
          <div className="space-y-6">
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium font-mono data-value">{stats?.completionPercentage || 0}%</span>
              </div>
              <Progress 
                value={stats?.completionPercentage || 0} 
                variant="tech" 
                size="lg" 
                showValue 
              />
            </div>

            {/* Chapter Grid - TechFrame */}
            <TechFrame variant="default" size="sm">
              <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9 lg:grid-cols-12">
                {chapterSlots.map((chapter, index) => {
                  const isCompleted = chapter.unlock_status === 'completed';
                  const isUnlocked = chapter.unlock_status !== 'locked';

                  return (
                    <motion.div
                      key={chapter.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + Math.min(index, 20) * 0.03 }}
                      title={chapter.title}
                      className={`
                        aspect-square rounded-md flex items-center justify-center text-xs font-medium
                        ${isCompleted 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : isUnlocked 
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                            : 'bg-metal-800/50 text-metal-500 border border-metal-700'
                        }
                      `}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : chapter.order}
                    </motion.div>
                  );
                })}
              </div>
            </TechFrame>

            {/* Legend */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-cyan-500/10 border border-cyan-500/30" />
                <span className="text-muted-foreground">Unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-metal-800/50 border border-metal-700" />
                <span className="text-muted-foreground">Locked</span>
              </div>
            </div>
          </div>
        </HudPanel>
      </motion.div>

      {/* Lore + Easter Egg Tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <HudPanel
          title="Lore Matrix"
          variant="tech"
          className="scan-lines"
          icon={<Scroll className="h-5 w-5" />}
        >
          <p className="mb-4 text-sm text-muted-foreground">
            Trilogy-aware progression with space for lore and hidden unlocks.
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            {trilogyBooks.map((book) => (
              <div key={book.id} className="rounded-lg border border-metal-700 bg-metal-900/40 p-3">
                <p className="text-sm font-semibold text-metallic">{book.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {book.completed}/{book.total} completed · {book.unlocked} unlocked
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-metal-800">
                  <div
                    className="h-full rounded-full bg-cyan-500/80 transition-all"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <DataDisplay
              label="Lore Terms"
              value={loreEntriesTotal}
              variant="default"
              trendValue="Oracle lexicon entries"
            />
            <DataDisplay
              label="Lore Nodes Unlocked"
              value={unlockedLoreNodes}
              variant="tech"
              trendValue={`${completedLoreNodes} fully integrated`}
            />
            <DataDisplay
              label="Easter Egg Slots"
              value={chapterSlots.length}
              variant="warning"
              trendValue="Bound to chapter unlock flow"
            />
          </div>

          <div className="mt-4">
            <Link href="/chapters">
              <Button variant="outline" size="sm">
                Open Chapters & Lore
              </Button>
            </Link>
          </div>
        </HudPanel>
      </motion.div>

      {/* Recent Activity - HudPanel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <HudPanel 
          title="Recent Activity" 
          variant="default" 
          className="scan-lines"
          icon={<Calendar className="h-5 w-5" />}
        >
          <p className="text-sm text-muted-foreground mb-4">Your latest accomplishments</p>
          {activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activity yet. Start your journey!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border
                    ${getActivityStyles(activity.type)}
                  `}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-metal-900">
                      {getActivityIcon(activity.type)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</p>
                  </div>
                  {activity.cycle && (
                    <Badge variant="outline" className="capitalize text-xs">
                      {activity.cycle}
                    </Badge>
                  )}
                  {activity.currentCount && (
                    <Badge variant="outline" className="text-xs">
                      {activity.currentCount} days
                    </Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          )}
        </HudPanel>
      </motion.div>
    </div>
  );
}
