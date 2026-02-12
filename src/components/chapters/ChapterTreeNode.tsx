"use client";

import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  Sparkles,
  Activity,
  Heart,
  Brain,
  Flame,
  Info,
} from "lucide-react";

import { Card, CardCorners } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Cycle type definitions with associated colors and icons
type CycleType = "physical" | "emotional" | "intellectual" | "spiritual";

const cycleConfig: Record<
  CycleType,
  {
    label: string;
    icon: React.ElementType;
    colors: {
      bg: string;
      border: string;
      text: string;
      icon: string;
      glow: string;
      corner: "primary" | "cyan" | "violet" | "emerald";
    };
  }
> = {
  physical: {
    label: "Physical",
    icon: Activity,
    colors: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
      text: "text-amber-400",
      icon: "text-amber-500",
      glow: "shadow-amber-500/20",
      corner: "primary",
    },
  },
  emotional: {
    label: "Emotional",
    icon: Heart,
    colors: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/40",
      text: "text-cyan-400",
      icon: "text-cyan-500",
      glow: "shadow-cyan-500/20",
      corner: "cyan",
    },
  },
  intellectual: {
    label: "Intellectual",
    icon: Brain,
    colors: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/40",
      text: "text-violet-400",
      icon: "text-violet-500",
      glow: "shadow-violet-500/20",
      corner: "violet",
    },
  },
  spiritual: {
    label: "Spiritual",
    icon: Flame,
    colors: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      icon: "text-emerald-500",
      glow: "shadow-emerald-500/20",
      corner: "emerald",
    },
  },
};

interface Chapter {
  id: number;
  title: string;
  unlocked: boolean;
  unlockCycle: CycleType;
  requirement?: string;
}

interface ChapterTreeNodeProps {
  chapters: Chapter[];
  className?: string;
}

// Individual chapter node component
function ChapterNode({
  chapter,
  index,
}: {
  chapter: Chapter;
  index: number;
}) {
  const cycle = cycleConfig[chapter.unlockCycle];
  const CycleIcon = cycle.icon;
  const isEven = index % 2 === 0;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={chapter.unlocked ? { scale: 1.02 } : undefined}
            className={cn("relative", isEven ? "md:mr-auto" : "md:ml-auto")}
          >
            <Card
              variant="glass"
              noPadding
              className={cn(
                "relative w-full md:w-[280px] transition-all duration-300",
                chapter.unlocked
                  ? cn(
                      cycle.colors.bg,
                      cycle.colors.border,
                      "hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    )
                  : "opacity-60 grayscale border-metal-800"
              )}
            >
              {/* Corner accents for unlocked chapters */}
              {chapter.unlocked && <CardCorners color={cycle.colors.corner} />}

              {/* Connection dot - left or right based on position */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full",
                  "border-2 z-10",
                  chapter.unlocked
                    ? cn(cycle.colors.bg, cycle.colors.border, cycle.colors.text)
                    : "bg-metal-800 border-metal-600",
                  isEven ? "-right-1.5" : "-left-1.5"
                )}
              />

              <div className="p-4">
                {/* Header: Chapter number and lock status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold",
                        "bg-metal-800 border border-metal-700",
                        chapter.unlocked ? cycle.colors.text : "text-muted-foreground"
                      )}
                    >
                      {chapter.id}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium uppercase tracking-wider",
                        chapter.unlocked ? cycle.colors.text : "text-muted-foreground"
                      )}
                    >
                      {cycle.label}
                    </span>
                  </div>

                  {/* Lock/Unlock status */}
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg border",
                      chapter.unlocked
                        ? cn(
                            "bg-emerald-500/10 border-emerald-500/30",
                            cycle.colors.text
                          )
                        : "bg-metal-800 border-metal-700"
                    )}
                  >
                    {chapter.unlocked ? (
                      <Unlock className="h-3.5 w-3.5" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    "text-base font-semibold leading-tight text-metallic mb-2",
                    !chapter.unlocked && "text-muted-foreground"
                  )}
                >
                  {chapter.title}
                </h3>

                {/* Cycle indicator with icon */}
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    chapter.unlocked ? "text-muted-foreground" : "text-muted-foreground/60"
                  )}
                >
                  <CycleIcon
                    className={cn(
                      "h-3.5 w-3.5",
                      chapter.unlocked ? cycle.colors.icon : "text-muted-foreground"
                    )}
                  />
                  <span>
                    {chapter.unlocked
                      ? "Available Now"
                      : `Requires ${cycle.label} Cycle`}
                  </span>
                </div>

                {/* Locked requirement hint */}
                {!chapter.unlocked && chapter.requirement && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70">
                    <Info className="h-3 w-3" />
                    <span className="truncate">{chapter.requirement}</span>
                  </div>
                )}

                {/* Unlocked glow effect */}
                {chapter.unlocked && (
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent",
                      cycle.colors.text,
                      "w-full opacity-50"
                    )}
                  />
                )}
              </div>
            </Card>
          </motion.div>
        </TooltipTrigger>

        {/* Tooltip content for locked chapters */}
        {!chapter.unlocked && chapter.requirement && (
          <TooltipContent
            side="top"
            className="max-w-[240px] bg-metal-900/95 border-metal-700"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">Locked Chapter</span>
              </div>
              <p className="text-xs text-muted-foreground">{chapter.requirement}</p>
              <div className="flex items-center gap-1.5 text-xs">
                <Sparkles className={cn("h-3 w-3", cycle.colors.icon)} />
                <span className={cycle.colors.text}>
                  Unlocks with {cycle.label} Cycle
                </span>
              </div>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

// Connection line between nodes
function ConnectionLine({
  index,
  total,
  cycle,
}: {
  index: number;
  total: number;
  cycle: CycleType;
}) {
  if (index >= total - 1) return null;

  const isEven = index % 2 === 0;
  const cycleColors = cycleConfig[cycle];

  return (
    <div
      className={cn(
        "hidden md:block absolute h-px w-[60px] top-1/2 -translate-y-1/2",
        "bg-gradient-to-r",
        isEven
          ? "left-full from-current to-transparent"
          : "right-full from-transparent to-current",
        cycleColors.colors.text,
        "opacity-30"
      )}
    />
  );
}

// Main ChapterTreeNode component
export function ChapterTreeNode({ chapters, className }: ChapterTreeNodeProps) {
  // Ensure chapters are sorted by id
  const sortedChapters = [...chapters].sort((a, b) => a.id - b.id);

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-metallic mb-2">
          Journey Through the Cycles
        </h2>
        <p className="text-sm text-muted-foreground">
          12 chapters aligned with your biorhythm cycles
        </p>
      </motion.div>

      {/* Tree layout container */}
      <div className="relative">
        {/* Central spine line (visible on md+) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-amber-500/20 via-cyan-500/20 to-emerald-500/20" />

        {/* Chapter nodes in alternating zig-zag pattern */}
        <div className="space-y-4 md:space-y-6 relative">
          {sortedChapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={cn(
                "relative flex",
                index % 2 === 0 ? "md:justify-start" : "md:justify-end"
              )}
            >
              <div className="relative w-full md:w-auto">
                <ChapterNode chapter={chapter} index={index} />
                <ConnectionLine
                  index={index}
                  total={sortedChapters.length}
                  cycle={chapter.unlockCycle}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              {sortedChapters.filter((c) => c.unlocked).length} Unlocked
            </span>
          </div>
          <div className="w-px h-4 bg-metal-700" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-metal-600" />
            <span>
              {sortedChapters.filter((c) => !c.unlocked).length} Locked
            </span>
          </div>
          <div className="w-px h-4 bg-metal-700" />
          <div className="text-xs text-muted-foreground">
            {Math.round(
              (sortedChapters.filter((c) => c.unlocked).length /
                sortedChapters.length) *
                100
            )}% Complete
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Default/mock chapters data for easy usage
export const defaultChapters: Chapter[] = [
  {
    id: 1,
    title: "The Choroid Plexus",
    unlocked: true,
    unlockCycle: "physical",
    requirement: "First chapter - always available",
  },
  {
    id: 2,
    title: "Blood-Brain Barrier",
    unlocked: true,
    unlockCycle: "physical",
    requirement: "Complete Chapter 1",
  },
  {
    id: 3,
    title: "Cerebrospinal Fluid",
    unlocked: false,
    unlockCycle: "emotional",
    requirement: "Complete Physical Cycle (Ch. 1-3)",
  },
  {
    id: 4,
    title: "The Ventricular System",
    unlocked: false,
    unlockCycle: "emotional",
    requirement: "Emotional cycle alignment required",
  },
  {
    id: 5,
    title: "Neural Pathways",
    unlocked: false,
    unlockCycle: "emotional",
    requirement: "Complete Emotional Cycle (Ch. 3-5)",
  },
  {
    id: 6,
    title: "Synaptic Transmission",
    unlocked: false,
    unlockCycle: "intellectual",
    requirement: "Intellectual cycle alignment required",
  },
  {
    id: 7,
    title: "Neuroplasticity",
    unlocked: false,
    unlockCycle: "intellectual",
    requirement: "Complete Intellectual Cycle (Ch. 6-7)",
  },
  {
    id: 8,
    title: "The Pineal Gland",
    unlocked: false,
    unlockCycle: "spiritual",
    requirement: "Spiritual cycle alignment required",
  },
  {
    id: 9,
    title: "Circadian Rhythms",
    unlocked: false,
    unlockCycle: "spiritual",
    requirement: "Complete Spiritual Cycle (Ch. 8-9)",
  },
  {
    id: 10,
    title: "The Divine Structure",
    unlocked: false,
    unlockCycle: "spiritual",
    requirement: "Complete Spiritual Cycle (Ch. 8-10)",
  },
  {
    id: 11,
    title: "Integration Phase",
    unlocked: false,
    unlockCycle: "physical",
    requirement: "All cycles must be completed",
  },
  {
    id: 12,
    title: "The Awakening",
    unlocked: false,
    unlockCycle: "spiritual",
    requirement: "Complete all previous chapters",
  },
];

// Skeleton loader for chapter tree
export function ChapterTreeNodeSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-24 rounded-xl border border-metal-800 bg-metal-900/50 animate-pulse",
            i % 2 === 0 ? "md:mr-auto md:w-[280px]" : "md:ml-auto md:w-[280px]"
          )}
        />
      ))}
    </div>
  );
}

export default ChapterTreeNode;
