"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  type BiorhythmData,
  CYCLE_CONFIGS,
  getCycleStatus,
} from "../../lib/biorhythm";

export interface BiorhythmWheelProps {
  /** Biorhythm data to display */
  data: BiorhythmData;
  /** Size of the wheel in pixels */
  size?: number;
  /** Whether to show animated transitions */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * BiorhythmWheel - SVG-based circular visualization of biorhythm cycles
 * 
 * Displays 4 cycles as colored concentric rings:
 * - Physical (red/octave) - inner ring
 * - Emotional (purple/transform)
 * - Intellectual (blue/architect)
 * - Spiritual (gold/solar) - outer ring
 */
export function BiorhythmWheel({
  data,
  size = 280,
  animated = true,
  className,
}: BiorhythmWheelProps) {
  const center = size / 2;
  const strokeWidth = Math.max(8, size / 35);
  const gap = strokeWidth + 4;

  // Calculate ring radii (from inner to outer)
  const radii = [
    size * 0.18, // Physical - inner
    size * 0.25, // Emotional
    size * 0.32, // Intellectual
    size * 0.39, // Spiritual - outer
  ];

  // Calculate position on circle for a given value (-1 to 1)
  const getPosition = (radius: number, value: number) => {
    // Map value (-1 to 1) to angle (-90° to 270°) starting from top
    const angle = (value + 1) * Math.PI;
    return {
      x: center + radius * Math.cos(angle - Math.PI / 2),
      y: center + radius * Math.sin(angle - Math.PI / 2),
    };
  };

  // Get cycle values in order
  const cycleValues = [
    data.physical.value,
    data.emotional.value,
    data.intellectual.value,
    data.spiritual.value,
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const ringVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1, ease: "easeInOut" as const },
        opacity: { duration: 0.3 },
      },
    },
  };

  const markerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        delay: 0.8,
      },
    },
  };

  return (
    <motion.div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      variants={containerVariants}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background glow effect */}
        <defs>
          {CYCLE_CONFIGS.map((config, index) => (
            <filter key={config.key} id={`glow-${config.key}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          
          {/* Gradient definitions */}
          <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--solar-19)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--transform-13)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Center background circle */}
        <circle
          cx={center}
          cy={center}
          r={radii[0] - strokeWidth}
          fill="url(#centerGradient)"
          opacity={0.5}
        />

        {/* Concentric rings for each cycle */}
        {CYCLE_CONFIGS.map((config, index) => {
          const radius = radii[index];
          const value = cycleValues[index];
          const pos = getPosition(radius, value);
          const status = getCycleStatus(value);
          const isHighlighted = status === "peak" || status === "critical";

          return (
            <g key={config.key}>
              {/* Background ring track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={config.colorValue}
                strokeWidth={strokeWidth}
                opacity={0.15}
              />

              {/* Active arc showing current phase */}
              {animated ? (
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={config.colorValue}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${(value + 1) * Math.PI * radius} ${2 * Math.PI * radius}`}
                  filter={isHighlighted ? `url(#glow-${config.key})` : undefined}
                  variants={ringVariants}
                />
              ) : (
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={config.colorValue}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${(value + 1) * Math.PI * radius} ${2 * Math.PI * radius}`}
                  filter={isHighlighted ? `url(#glow-${config.key})` : undefined}
                />
              )}

              {/* Current position marker */}
              {animated ? (
                <motion.g variants={markerVariants}>
                  {/* Outer glow */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={strokeWidth}
                    fill={config.colorValue}
                    opacity={0.3}
                  />
                  {/* Inner marker */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={strokeWidth * 0.6}
                    fill={config.colorValue}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                </motion.g>
              ) : (
                <g>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={strokeWidth}
                    fill={config.colorValue}
                    opacity={0.3}
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={strokeWidth * 0.6}
                    fill={config.colorValue}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Center label */}
        <g transform={`translate(${center}, ${center}) rotate(90)`}>
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-xs font-medium"
            style={{ fontSize: Math.max(10, size / 25) }}
          >
            {new Date(data.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </text>
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2">
        {CYCLE_CONFIGS.map((config, index) => {
          const value = cycleValues[index];
          const status = getCycleStatus(value);
          
          return (
            <motion.div
              key={config.key}
              className="flex items-center gap-1.5 rounded-full bg-card/80 px-2 py-1 text-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: config.colorValue }}
              />
              <span className="text-muted-foreground hidden sm:inline">
                {config.name}
              </span>
              {status === "peak" && (
                <span className="text-[10px] text-yellow-500">★</span>
              )}
              {status === "critical" && (
                <span className="text-[10px] text-red-500">!</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default BiorhythmWheel;
