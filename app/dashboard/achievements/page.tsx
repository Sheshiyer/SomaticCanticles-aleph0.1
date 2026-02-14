'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TechFrame, HudPanel, DataDisplay } from '@/components/ui/frame';
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
      const res = await fetch(`/api/progress/achievements`, { credentials: 'include' });
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
      case 'unlocked': return !!achievement.unlockedAt;
      case 'locked': return !achievement.unlockedAt;
      case 'common':
      case 'rare':
      case 'epic':
      case 'legendary':
        return achievement.definition.rarity === activeFilter;
      default: return true;
    }
  });

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;

  const statsByRarity = achievements.reduce((acc, achievement) => {
    const rarity = achievement.definition.rarity;
    if (!acc[rarity]) acc[rarity] = { total: 0, unlocked: 0 };
    acc[rarity].total++;
    if (achievement.unlockedAt) acc[rarity].unlocked++;
    return acc;
  }, {} as Record<string, { total: number; unlocked: number }>);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-metallic flex items-center gap-3">
          <Trophy className="h-8 w-8 text-amber-500" />
          Achievements
        </h1>
        <p className="text-muted-foreground">Collect all 8 achievements on your journey</p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TechFrame variant="default" className="scan-lines">
          <HudPanel title="Achievement Progress" icon={<Trophy className="h-5 w-5" />} className="scan-lines">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Progress Ring */}
              <AchievementProgressRing unlocked={unlockedCount} total={totalCount} size={140} />

              {/* Stats */}
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(statsByRarity).map(([rarity, stats]) => (
                    <DataDisplay
                      key={rarity}
                      label={rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      value={`${stats.unlocked} / ${stats.total}`}
                      variant={getDataDisplayVariant(rarity)}
                    />
                  ))}
                </div>

                {/* Next Unlock Hint */}
                {totalCount === 0 ? (
                  <div className="p-3 bg-metal-800/20 border border-metal-700/20 rounded-lg flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Begin your journey to unlock achievements.
                    </p>
                  </div>
                ) : unlockedCount < totalCount ? (
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <p className="text-sm">
                      <span className="font-medium">Next up:</span>{' '}
                      {achievements
                        .filter(a => !a.unlockedAt)
                        .sort((a, b) => b.progress.percentage - a.progress.percentage)[0]?.title}
                      {' '}
                      <span className="text-muted-foreground">
                        ({achievements
                          .filter(a => !a.unlockedAt)
                          .sort((a, b) => b.progress.percentage - a.progress.percentage)[0]?.progress.percentage}% complete)
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-emerald-500" />
                    <p className="text-sm font-medium text-emerald-400">
                      Congratulations! You&apos;ve unlocked all achievements!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </HudPanel>
        </TechFrame>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as FilterType)}>
          <TechFrame variant="tech" size="sm">
            <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0 border-0">
              <TabsTrigger value="all" className="data-[state=active]:bg-metal-700">
                All ({achievements.length})
              </TabsTrigger>
              <TabsTrigger value="unlocked" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                Unlocked ({unlockedCount})
              </TabsTrigger>
              <TabsTrigger value="locked" className="data-[state=active]:bg-metal-700">
                <Lock className="w-3 h-3 mr-1" />
                Locked ({totalCount - unlockedCount})
              </TabsTrigger>
              <TabsTrigger value="rare" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Rare
              </TabsTrigger>
              <TabsTrigger value="epic" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                Epic
              </TabsTrigger>
              <TabsTrigger value="legendary" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
                Legendary
              </TabsTrigger>
            </TabsList>
          </TechFrame>
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
          <AchievementCard key={achievement.id} achievement={achievement} index={index} />
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No achievements found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more achievements.</p>
        </motion.div>
      )}
    </div>
  );
}

function getRarityStyles(rarity: string) {
  switch (rarity) {
    case 'common': return 'bg-metal-800/30 border-metal-700';
    case 'rare': return 'bg-cyan-500/5 border-cyan-500/20';
    case 'epic': return 'bg-violet-500/5 border-violet-500/20';
    case 'legendary': return 'bg-amber-500/5 border-amber-500/20';
    default: return 'bg-metal-800/30 border-metal-700';
  }
}

function getDataDisplayVariant(rarity: string): "default" | "tech" | "success" | "warning" {
  switch (rarity) {
    case 'common': return 'default';
    case 'rare': return 'tech';
    case 'epic': return 'success';
    case 'legendary': return 'warning';
    default: return 'default';
  }
}
