"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2, Play, Sparkles } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { cn } from "../../lib/utils";

// Cycle type with associated colors (power-number design system)
const cycleColors = {
  physical: {
    bg: "bg-ember-500/10",
    border: "border-ember-500/30",
    text: "text-ember-400",
    icon: "text-ember-500",
    progress: "bg-ember-500",
    glow: "shadow-ember-500/20",
  },
  emotional: {
    bg: "bg-ocean-500/10",
    border: "border-ocean-500/30",
    text: "text-ocean-400",
    icon: "text-ocean-500",
    progress: "bg-ocean-500",
    glow: "shadow-ocean-500/20",
  },
  intellectual: {
    bg: "bg-solar-500/10",
    border: "border-solar-500/30",
    text: "text-solar-400",
    icon: "text-solar-500",
    progress: "bg-solar-500",
    glow: "shadow-solar-500/20",
  },
  spiritual: {
    bg: "bg-lunar-500/10",
    border: "border-lunar-500/30",
    text: "text-lunar-400",
    icon: "text-lunar-500",
    progress: "bg-lunar-500",
    glow: "shadow-lunar-500/20",
  },
};

const cycleNames = {
  physical: "Physical",
  emotional: "Emotional",
  intellectual: "Intellectual",
  spiritual: "Spiritual",
};

type CycleType = keyof typeof cycleColors;
type UnlockStatus = "locked" | "unlocked" | "in-progress" | "completed";

interface ChapterCardProps {
  id: number;
  order: number;
  title: string;
  subtitle: string | null;
  cycle: CycleType | null;
  durationMinutes: number | null;
  description: string | null;
  unlockStatus: UnlockStatus;
  progress: number;
  iconUrl?: string | null;
  index?: number;
}

export function ChapterCard({
  id,
  order,
  title,
  subtitle,
  cycle,
  durationMinutes,
  description,
  unlockStatus,
  progress,
  iconUrl,
  index = 0,
}: ChapterCardProps) {
  const colors = cycle ? cycleColors[cycle] : cycleColors.physical;
  const isLocked = unlockStatus === "locked";
  const isCompleted = unlockStatus === "completed";
  const isInProgress = unlockStatus === "in-progress";

  const cardContent = (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        colors.bg,
        isLocked
          ? "opacity-60 grayscale"
          : `hover:border-opacity-100 hover:shadow-lg hover:${colors.glow}`,
        colors.border,
        "border-2"
      )}
    >
      {/* Status indicator */}
      <div className="absolute right-3 top-3">
        {isLocked && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        {isCompleted && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
        )}
        {isInProgress && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
            <Play className="h-4 w-4 text-amber-500" />
          </div>
        )}
        {unlockStatus === "unlocked" && !isCompleted && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>

      <CardContent className="p-5">
        {/* Chapter number */}
        <div className={cn("mb-2 text-sm font-medium", colors.text)}>
          Chapter {order}
        </div>

        {/* Title */}
        <h3 className="mb-1 text-lg font-bold leading-tight">{title}</h3>

        {/* Subtitle */}
        {subtitle && (
          <p className="mb-3 text-sm text-muted-foreground">{subtitle}</p>
        )}

        {/* Cycle badge */}
        {cycle && (
          <div className="mb-3 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                colors.bg,
                colors.text
              )}
            >
              {cycleNames[cycle]}
            </span>
            {durationMinutes && (
              <span className="text-xs text-muted-foreground">
                {durationMinutes} min
              </span>
            )}
          </div>
        )}

        {/* Description (only show if unlocked) */}
        {!isLocked && description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* Progress bar */}
        {(isInProgress || isCompleted) && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className={colors.text}>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-1.5"
              // @ts-expect-error - custom color class
              indicatorClassName={colors.progress}
            />
          </div>
        )}

        {/* Locked message */}
        {isLocked && (
          <p className="mt-3 text-xs text-muted-foreground">
            Complete prerequisites to unlock
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (isLocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/chapters/${id}`} className="block">
        {cardContent}
      </Link>
    </motion.div>
  );
}

// Skeleton loader for chapter cards
export function ChapterCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="mb-2 h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="mb-1 h-6 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="mb-3 flex gap-2">
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
