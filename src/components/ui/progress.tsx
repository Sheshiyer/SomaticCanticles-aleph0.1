"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const progressVariants = {
  default: {
    track: "bg-metal-800",
    indicator: "bg-primary",
  },
  tech: {
    track: "bg-metal-800 border border-metal-700",
    indicator: "bg-gradient-to-r from-cyan-500 to-cyan-400",
  },
  success: {
    track: "bg-metal-800",
    indicator: "bg-gradient-to-r from-emerald-500 to-emerald-400",
  },
  warning: {
    track: "bg-metal-800",
    indicator: "bg-gradient-to-r from-amber-500 to-amber-400",
  },
  danger: {
    track: "bg-metal-800",
    indicator: "bg-gradient-to-r from-rose-500 to-rose-400",
  },
  rainbow: {
    track: "bg-metal-800",
    indicator: "bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500",
  },
};

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: keyof typeof progressVariants;
  size?: "sm" | "default" | "lg";
  showValue?: boolean;
  valueLabel?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ 
  className, 
  value, 
  variant = "default",
  size = "default",
  showValue = false,
  valueLabel,
  ...props 
}, ref) => {
  const variantStyles = progressVariants[variant];
  
  const sizeClasses = {
    sm: "h-1.5",
    default: "h-2",
    lg: "h-3",
  };
  
  return (
    <div className="w-full space-y-1">
      {(showValue || valueLabel) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          {valueLabel && <span>{valueLabel}</span>}
          {showValue && <span>{Math.round(value || 0)}%</span>}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full",
          variantStyles.track,
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out",
            variantStyles.indicator,
            variant === "tech" && "shadow-[0_0_10px_rgba(6,182,212,0.5)]",
            variant === "success" && "shadow-[0_0_10px_rgba(16,185,129,0.5)]",
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

// Segmented progress for chapter completion
function SegmentedProgress({ 
  segments, 
  className 
}: { 
  segments: { completed: boolean; current?: boolean }[];
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1", className)}>
      {segments.map((segment, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-all duration-300",
            segment.completed 
              ? "bg-emerald-500" 
              : segment.current 
                ? "bg-amber-500 animate-pulse"
                : "bg-metal-800"
          )}
        />
      ))}
    </div>
  );
}

export { Progress, SegmentedProgress };
