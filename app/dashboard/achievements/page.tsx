'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Filter, Lock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AchievementCard, AchievementProgressRing, type Achievement } from '@/components/achievements/AchievementCard';
import { toast } from 'sonner';

type FilterType = 'all' | 'unlocked' | 'locked' | 'common' | 'rare' | 'epic' | 'legendary';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.somatic-canticles.com';
      const res = await fetch(`${apiUrl}/progress/achievements`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch achievements');
      const data = await res.json();
      setAchievements(data.achievements);
    } catch (error) {
      toast.error('Failed to load achievements');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAchievements = achievements.filter((achievement) => {
    switch (activeFilter) {
      case 'unlocked':
        return !!achievement.unlockedAt;
      case 'locked':
        return !achievement.unlockedAt;
      case 'common':
      case 'rare':
      case 'epic':
      case 'legendary':
        return achievement.definition.rarity === activeFilter;
      default:
        return true;
    }
  });

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;

  // Group achievements by rarity for stats
  const statsByRarity = achievements.reduce((acc, achievement) => {
    const rarity = achievement.definition.rarity;
    if (!acc[rarity]) {
      acc[rarity] = { total: 0, unlocked: 0 };
    }
    acc[rarity].total++;
    if (achievement.unlockedAt) {
      acc[rarity].unlocked++;
    }
    return acc;
  }, {} as Record<string, { total: number; unlocked: number }>);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Achievements
        </h1>
        <p className="text-muted-foreground mt-1">
          Collect all 8 achievements on your journey
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Progress Ring */}
              <AchievementProgressRing 
                unlocked={unlockedCount} 
                total={totalCount}
                size={140}
              />

              {/* Stats */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(statsByRarity).map(([rarity, stats]) => (
                    <div 
                      key={rarity}
                      className={`
                        p-3 rounded-lg border text-center
                        ${rarity === 'common' && 'bg-gray-500/5 border-gray-500/20'}
                        ${rarity === 'rare' && 'bg-blue-500/5 border-blue-500/20'}
                        ${rarity === 'epic' && 'bg-purple-500/5 border-purple-500/20'}
                        ${rarity === 'legendary' && 'bg-yellow-500/5 border-yellow-500/20'}
                      `}
                    >
                      <div className="capitalize text-sm text-muted-foreground mb-1">
                        {rarity}
                      </div>
                      <div className="text-xl font-bold">
                        {stats.unlocked} <span className="text-muted-foreground text-sm">/ {stats.total}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Unlock Hint */}
                {unlockedCount < totalCount && (
                  <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <p className="text-sm">
                      <span className="font-medium">Next up:</span>{' '}
                      {achievements
                        .filter(a => !a.unlockedAt)
                        .sort((a, b) => b.progress.percentage - a.progress.percentage)[0]?.title}
                      {' '}
                      ({achievements
                        .filter(a => !a.unlockedAt)
                        .sort((a, b) => b.progress.percentage - a.progress.percentage)[0]?.progress.percentage}% complete)
                    </p>
                  </div>
                )}

                {unlockedCount === totalCount && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      Congratulations! You've unlocked all achievements!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as FilterType)}>
          <TabsList className="flex-wrap h-auto gap-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All ({achievements.length})
            </TabsTrigger>
            <TabsTrigger value="unlocked" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Unlocked ({unlockedCount})
            </TabsTrigger>
            <TabsTrigger value="locked" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white">
              <Lock className="w-3 h-3 mr-1" />
              Locked ({totalCount - unlockedCount})
            </TabsTrigger>
            <TabsTrigger value="rare" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Rare
            </TabsTrigger>
            <TabsTrigger value="epic" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Epic
            </TabsTrigger>
            <TabsTrigger value="legendary" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Legendary
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Achievement Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {filteredAchievements.map((achievement, index) => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement}
            index={index}
          />
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No achievements found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more achievements.
          </p>
        </motion.div>
      )}
    </div>
  );
}
