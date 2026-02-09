"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  type BiorhythmData,
  CYCLE_CONFIGS,
  formatCyclePercentage,
  isPeak,
  isCritical,
  getCycleStatus,
} from "../../lib/biorhythm";
import { LightPillar } from "../effects/LightPillar";

export interface CycleBarsProps {
  /** Biorhythm data to display */
  data: BiorhythmData;
  /** Whether to show animated transitions */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show compact layout */
  compact?: boolean;
}

/**
 * CycleBars - Horizontal progress bars for each biorhythm cycle
 * 
 * Shows percentage (-100% to +100%) for each cycle with:
 * - Color coding matching the biorhythm wheel
 * - Peak indicator (>80%)
 * - Critical indicator (near 0)
 * - Current value text display
 */
export function CycleBars({
  data,
  animated = true,
  className,
  compact = false,
}: CycleBarsProps) {
  const cycles = [
    { ...CYCLE_CONFIGS[0], value: data.physical.value },
    { ...CYCLE_CONFIGS[1], value: data.emotional.value },
    { ...CYCLE_CONFIGS[2], value: data.intellectual.value },
    { ...CYCLE_CONFIGS[3], value: data.spiritual.value },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      className={cn("w-full space-y-3", className)}
      variants={containerVariants}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
    >
      {cycles.map((cycle) => {
        const percentage = cycle.value * 100;
        const status = getCycleStatus(cycle.value);
        const peak = isPeak(cycle.value);
        const critical = isCritical(cycle.value);

        return (
          <motion.div
            key={cycle.key}
            className={cn(
              "relative rounded-lg bg-card/50 p-3 transition-colors",
              peak && "bg-yellow-500/5",
              critical && "bg-red-500/5"
            )}
            variants={itemVariants}
          >
            {/* Header with name and value */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Color indicator */}
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: cycle.colorValue }}
                />
                
                {/* Cycle name */}
                <span className="text-sm font-medium text-foreground">
                  {cycle.name}
                </span>
                
                {/* Status indicators */}
                {peak && (
                  <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Peak
                  </span>
                )}
                {critical && (
                  <span className="flex items-center gap-0.5 text-xs text-red-500">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Critical
                  </span>
                )}
              </div>

              {/* Percentage value */}
              <span
                className={cn(
                  "text-sm font-bold tabular-nums",
                  percentage > 0 ? "text-green-500" : "text-red-500",
                  peak && "text-yellow-500"
                )}
              >
                {formatCyclePercentage(cycle.value)}
              </span>
            </div>

            {/* Progress bar container */}
            <div className="relative h-3 overflow-hidden rounded-full bg-muted">
              {/* Center marker (0%) */}
              <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-foreground/20" />

              {/* Progress bar */}
              {animated ? (
                <motion.div
                  className="absolute top-0 h-full rounded-full transition-all"
                  style={{
                    backgroundColor: cycle.colorValue,
                    left: percentage >= 0 ? "50%" : `${50 + percentage / 2}%`,
                    width: `${Math.abs(percentage) / 2}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{
                    left: percentage >= 0 ? "50%" : `${50 + percentage / 2}%`,
                    width: `${Math.abs(percentage) / 2}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              ) : (
                <div
                  className="absolute top-0 h-full rounded-full"
                  style={{
                    backgroundColor: cycle.colorValue,
                    left: percentage >= 0 ? "50%" : `${50 + percentage / 2}%`,
                    width: `${Math.abs(percentage) / 2}%`,
                  }}
                />
              )}

              {/* Glow effect for peaks */}
              {peak && (
                <div
                  className="absolute top-0 h-full w-1/2 rounded-full opacity-50 blur-sm"
                  style={{
                    backgroundColor: cycle.colorValue,
                    left: "50%",
                  }}
                />
              )}
            </div>

            {/* Description (only in non-compact mode) */}
            {!compact && (
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">
                {cycle.description}
              </p>
            )}

            {/* Days in cycle indicator */}
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                Day {data[cycle.key].days % cycle.length} of {cycle.length}
              </span>
              <span className="capitalize">{status}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default CycleBars;
