"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2, Play, Sparkles, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardCorners, CardStatus } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Cycle type with associated colors (enhanced tech design system)
const cycleColors = {
  physical: {
    bg: "bg-amber-500/5",
    border: "border-amber-500/30",
    borderHover: "hover:border-amber-500/50",
    text: "text-amber-400",
    icon: "text-amber-500",
    progress: "amber",
    glow: "shadow-amber-500/10",
    glowHover: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    corner: "border-amber-500/40",
  },
  emotional: {
    bg: "bg-cyan-500/5",
    border: "border-cyan-500/30",
    borderHover: "hover:border-cyan-500/50",
    text: "text-cyan-400",
    icon: "text-cyan-500",
    progress: "tech",
    glow: "shadow-cyan-500/10",
    glowHover: "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    corner: "border-cyan-500/40",
  },
  intellectual: {
    bg: "bg-violet-500/5",
    border: "border-violet-500/30",
    borderHover: "hover:border-violet-500/50",
    text: "text-violet-400",
    icon: "text-violet-500",
    progress: "default",
    glow: "shadow-violet-500/10",
    glowHover: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    corner: "border-violet-500/40",
  },
  spiritual: {
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/30",
    borderHover: "hover:border-emerald-500/50",
    text: "text-emerald-400",
    icon: "text-emerald-500",
    progress: "success",
    glow: "shadow-emerald-500/10",
    glowHover: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    corner: "border-emerald-500/40",
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
      variant="glass"
      noPadding
      className={cn(
        "relative overflow-hidden transition-all duration-300 group",
        colors.bg,
        isLocked
          ? "opacity-60 grayscale border-metal-800"
          : cn(colors.border, colors.borderHover, colors.glowHover),
        "hover:-translate-y-0.5",
      )}
    >
      {/* Corner accents */}
      {!isLocked && <CardCorners color={cycle === "emotional" ? "cyan" : cycle === "spiritual" ? "emerald" : cycle === "intellectual" ? "violet" : "primary"} />}
      
      {/* Top gradient line */}
      <div className={cn(
        "absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-50",
        colors.text
      )} />
      
      <CardContent className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          {/* Chapter number with icon */}
          <div className="flex items-center gap-2">
            <span className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold",
              "bg-metal-800 border border-metal-700",
              colors.text
            )}>
              {order}
            </span>
            <span className={cn("text-xs font-medium uppercase tracking-wider", colors.text)}>
              {cycle && cycleNames[cycle]}
            </span>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            {durationMinutes && !isLocked && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {durationMinutes}m
              </span>
            )}
            {isLocked && (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-metal-800 border border-metal-700">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
            {isCompleted && (
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border",
                "bg-emerald-500/10 border-emerald-500/30"
              )}>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            )}
            {isInProgress && (
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border",
                "bg-amber-500/10 border-amber-500/30"
              )}>
                <Play className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              </div>
            )}
            {unlockStatus === "unlocked" && !isCompleted && (
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border",
                "bg-amber-500/10 border-amber-500/30"
              )}>
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className={cn(
          "mb-1 text-lg font-bold leading-tight text-metallic",
          !isLocked && "group-hover:text-white transition-colors"
        )}>
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && (
          <p className="mb-3 text-sm text-muted-foreground line-clamp-1">{subtitle}</p>
        )}

        {/* Description (only show if unlocked) */}
        {!isLocked && description && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Locked message */}
        {isLocked && (
          <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-metal-800/50 border border-metal-700/50">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Complete previous chapters to unlock
            </span>
          </div>
        )}

        {/* Progress section */}
        {!isLocked && (isInProgress || isCompleted) && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className={cn("font-mono font-medium", colors.text)}>
                {progress}%
              </span>
            </div>
            <Progress
              value={progress}
              variant={colors.progress as "default" | "tech" | "success" | "warning" | "amber" | "danger"}
              size="sm"
            />
          </div>
        )}
        
        {/* Action hint for unlocked chapters */}
        {!isLocked && !isCompleted && !isInProgress && (
          <div className={cn(
            "mt-4 flex items-center gap-1 text-xs font-medium",
            colors.text
          )}>
            <span>Begin Chapter</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        )}
      </CardContent>
      
      {/* Bottom tech line decoration */}
      <div className={cn(
        "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-500",
        colors.text,
        isCompleted ? "w-full opacity-100" : isInProgress ? "w-3/4 opacity-70" : "w-1/4 opacity-0 group-hover:opacity-30"
      )} />
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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Link href={`/chapters/${id}`} className="block">
        {cardContent}
      </Link>
    </motion.div>
  );
}

// Enhanced skeleton loader for chapter cards
export function ChapterCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="relative rounded-xl border border-metal-800 bg-metal-900/50 backdrop-blur-sm p-5 overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-metal-800 animate-pulse" />
            <div className="h-3 w-16 rounded bg-metal-800 animate-pulse" />
          </div>
          <div className="w-7 h-7 rounded-lg bg-metal-800 animate-pulse" />
        </div>
        
        <div className="h-5 w-3/4 rounded bg-metal-800 animate-pulse mb-2" />
        <div className="h-4 w-1/2 rounded bg-metal-800 animate-pulse mb-4" />
        <div className="h-8 w-full rounded bg-metal-800 animate-pulse" />
      </div>
    </motion.div>
  );
}

// Mini chapter card for sidebar/progress displays
export function ChapterCardMini({
  order,
  title,
  cycle,
  unlockStatus,
}: {
  order: number;
  title: string;
  cycle: CycleType | null;
  unlockStatus: UnlockStatus;
}) {
  const colors = cycle ? cycleColors[cycle] : cycleColors.physical;
  const isLocked = unlockStatus === "locked";
  const isCompleted = unlockStatus === "completed";
  
  return (
    <div className={cn(
      "flex items-center gap-3 p-2 rounded-lg border transition-colors",
      isLocked 
        ? "bg-metal-900/30 border-metal-800 opacity-50" 
        : cn("bg-metal-900/50 border-metal-800 hover:border-metal-700", colors.border)
    )}>
      <span className={cn(
        "flex items-center justify-center w-6 h-6 rounded text-xs font-bold shrink-0",
        "bg-metal-800 border border-metal-700",
        isLocked ? "text-muted-foreground" : colors.text
      )}>
        {isCompleted ? "✓" : order}
      </span>
      <span className={cn(
        "text-sm truncate",
        isLocked ? "text-muted-foreground" : "text-foreground"
      )}>
        {title}
      </span>
    </div>
  );
}
