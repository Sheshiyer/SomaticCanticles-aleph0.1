'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  BookOpen,
  Flame,
  Trophy,
  TrendingUp,
  Calendar,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ProgressStats {
  totalChapters: number;
  completedChapters: number;
  unlockedChapters: number;
  completionPercentage: number;
  totalTimeSpent: {
    hours: number;
    minutes: number;
    totalSeconds: number;
  };
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

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.somatic-canticles.com';
      
      // Fetch stats
      const statsRes = await fetch(`${apiUrl}/progress/stats`, {
        credentials: 'include',
      });
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsRes.json();
      setStats(statsData.stats);

      // Fetch recent activity
      const activityRes = await fetch(`${apiUrl}/progress/recent?limit=10`, {
        credentials: 'include',
      });
      if (!activityRes.ok) throw new Error('Failed to fetch activities');
      const activityData = await activityRes.json();
      setActivities(activityData.activities);
    } catch (error) {
      toast.error('Failed to load progress data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (hours: number, minutes: number) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'chapter_completed':
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'chapter_unlocked':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'achievement_unlocked':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'streak_milestone':
        return <Flame className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'chapter_completed':
        return 'bg-green-500/10 border-green-500/20';
      case 'chapter_unlocked':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'achievement_unlocked':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'streak_milestone':
        return 'bg-orange-500/10 border-orange-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your journey through the 12 chapters
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? formatTime(stats.totalTimeSpent.hours, stats.totalTimeSpent.minutes) : '0m'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all chapters
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chapters Completed
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.completedChapters || 0} / {stats?.totalChapters || 12}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.completionPercentage || 0}% complete
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.currentStreak || 0} days
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Best: {stats?.longestStreak || 0} days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Achievements
              </CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.achievementsUnlocked || 0} / 8
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                View all achievements
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
              Your journey through all 12 chapters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">{stats?.completionPercentage || 0}%</span>
              </div>
              <Progress value={stats?.completionPercentage || 0} className="h-3" />
            </div>

            <div className="grid grid-cols-12 gap-1">
              {[...Array(12)].map((_, i) => {
                const chapterNum = i + 1;
                const isCompleted = chapterNum <= (stats?.completedChapters || 0);
                const isUnlocked = chapterNum <= (stats?.unlockedChapters || 0);

                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-xs font-medium
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isUnlocked 
                          ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30' 
                          : 'bg-gray-200 text-gray-400 dark:bg-gray-800'
                      }
                    `}
                  >
                    {chapterNum}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" />
                <span className="text-muted-foreground">Unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-800" />
                <span className="text-muted-foreground">Locked</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
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
                      flex items-center gap-4 p-3 rounded-lg border
                      ${getActivityColor(activity.type)}
                    `}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-background">
                        {getActivityIcon(activity.type)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    {activity.cycle && (
                      <Badge variant="secondary" className="capitalize">
                        {activity.cycle}
                      </Badge>
                    )}
                    {activity.currentCount && (
                      <Badge variant="secondary">
                        {activity.currentCount} days
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
