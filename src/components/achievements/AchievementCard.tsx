'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Crown,
  Flame,
  Star,
  Sunrise,
  Moon,
  Activity,
  Award,
  Lock,
  Share2,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

// Achievement rarity colors
const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-yellow-500',
};

const RARITY_BADGE_COLORS = {
  common: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  rare: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  epic: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  legendary: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
};

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Crown,
  Flame,
  Star,
  Sunrise,
  Moon,
  Activity,
  Award,
};

export interface Achievement {
  id: string;
  achievementType: string;
  title: string;
  description: string;
  unlockedAt: string | null;
  iconUrl: string | null;
  definition: {
    iconName: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  progress: {
    current: number;
    target: number;
    percentage: number;
  };
}

interface AchievementCardProps {
  achievement: Achievement;
  index?: number;
}

export function AchievementCard({ achievement, index = 0 }: AchievementCardProps) {
  const isUnlocked = !!achievement.unlockedAt;
  const Icon = ICON_MAP[achievement.definition.iconName] || Award;
  const rarity = achievement.definition.rarity;

  const handleShare = async () => {
    const shareData = {
      title: `I unlocked "${achievement.title}" in Somatic Canticles!`,
      text: achievement.description,
      url: window.location.origin + '/dashboard/achievements',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        toast.success('Achievement copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`
                relative overflow-hidden transition-all duration-300
                ${isUnlocked 
                  ? 'border-2' 
                  : 'opacity-75 grayscale'
                }
                ${isUnlocked && rarity === 'legendary' ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/20' : ''}
                ${isUnlocked && rarity === 'epic' ? 'border-purple-400/50 shadow-lg shadow-purple-400/20' : ''}
              `}
            >
              {/* Rarity gradient background */}
              {isUnlocked && (
                <div
                  className={`
                    absolute inset-0 opacity-10 bg-gradient-to-br
                    ${RARITY_COLORS[rarity]}
                  `}
                />
              )}

              <CardContent className="p-4 relative">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`
                      relative flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center
                      ${isUnlocked
                        ? `bg-gradient-to-br ${RARITY_COLORS[rarity]} text-white shadow-lg`
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                      }
                    `}
                  >
                    <Icon className="w-8 h-8" />
                    
                    {/* Lock overlay for locked achievements */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    )}

                    {/* Checkmark for unlocked */}
                    {isUnlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{achievement.title}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${RARITY_BADGE_COLORS[rarity]}`}
                      >
                        {rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {achievement.description}
                    </p>

                    {/* Progress bar for locked achievements */}
                    {!isUnlocked && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {achievement.progress.current} / {achievement.progress.target}
                          </span>
                        </div>
                        <Progress 
                          value={achievement.progress.percentage} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {/* Unlock date for unlocked achievements */}
                    {isUnlocked && achievement.unlockedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Share button */}
                  {isUnlocked && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{achievement.description}</p>
          {!isUnlocked && (
            <p className="text-xs text-muted-foreground mt-1">
              Progress: {achievement.progress.percentage}%
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Achievement progress ring component
interface AchievementProgressRingProps {
  unlocked: number;
  total: number;
  size?: number;
}

export function AchievementProgressRing({ 
  unlocked, 
  total, 
  size = 120 
}: AchievementProgressRingProps) {
  const percentage = Math.round((unlocked / total) * 100);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-800"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-primary"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
        <span className="text-2xl font-bold">{percentage}%</span>
        <span className="text-xs text-muted-foreground">{unlocked}/{total}</span>
      </div>
    </div>
  );
}
