'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, BookOpen, Flame, Trophy, TrendingUp, Calendar, ChevronRight, Activity, Lock, CheckCircle2
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
      
      const [statsRes, activityRes] = await Promise.all([
        fetch(`${apiUrl}/progress/stats`, { credentials: 'include' }),
        fetch(`${apiUrl}/progress/recent?limit=10`, { credentials: 'include' })
      ]);

      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      if (!activityRes.ok) throw new Error('Failed to fetch activities');

      const [statsData, activityData] = await Promise.all([
        statsRes.json(),
        activityRes.json()
      ]);

      setStats(statsData.stats);
      setActivities(activityData.activities);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-metallic">Your Progress</h1>
        <p className="text-muted-foreground">Track your journey through the 12 somatic canticles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Time"
          value={stats ? formatTime(stats.totalTimeSpent.hours, stats.totalTimeSpent.minutes) : '0m'}
          subtitle="Across all chapters"
          icon={<Clock className="h-4 w-4" />}
          delay={0.1}
        />
        <StatCard
          title="Chapters Completed"
          value={`${stats?.completedChapters || 0} / ${stats?.totalChapters || 12}`}
          subtitle={`${stats?.completionPercentage || 0}% complete`}
          icon={<BookOpen className="h-4 w-4" />}
          delay={0.2}
        />
        <StatCard
          title="Current Streak"
          value={`${stats?.currentStreak || 0} days`}
          subtitle={`Best: ${stats?.longestStreak || 0} days`}
          icon={<Flame className="h-4 w-4 text-orange-500" />}
          delay={0.3}
        />
        <StatCard
          title="Achievements"
          value={`${stats?.achievementsUnlocked || 0} / 8`}
          subtitle="View all achievements"
          icon={<Trophy className="h-4 w-4 text-amber-500" />}
          delay={0.4}
        />
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="glass" noPadding className="border-metal-700/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-metallic">Overall Progress</CardTitle>
            <CardDescription>Your journey through all 12 chapters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium font-mono">{stats?.completionPercentage || 0}%</span>
              </div>
              <Progress 
                value={stats?.completionPercentage || 0} 
                variant="tech" 
                size="lg" 
                showValue 
              />
            </div>

            {/* Chapter Grid */}
            <div className="grid grid-cols-12 gap-1.5">
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
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : isUnlocked 
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                          : 'bg-metal-800/50 text-metal-500 border border-metal-700'
                      }
                    `}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : chapterNum}
                  </motion.div>
                );
              })}
            </div>

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
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card variant="glass" noPadding className="border-metal-700/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-metallic">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  title, value, subtitle, icon, delay 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card variant="glass" noPadding className="border-metal-700/50 h-full">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <div className="text-muted-foreground">{icon}</div>
          </div>
          <div className="text-2xl font-bold text-metallic font-mono">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
