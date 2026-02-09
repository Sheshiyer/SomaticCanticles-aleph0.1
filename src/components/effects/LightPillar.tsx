"use client";

import { cn } from "@/lib/utils";

interface LightPillarProps {
  /**
   * The color variant of the pillar - maps to power-number colors
   * @default "solar"
   */
  color?: "octave" | "transform" | "solar" | "architect" | "world" | "life" | "unity";
  /**
   * The intensity of the glow effect
   * @default "medium"
   */
  intensity?: "low" | "medium" | "high";
  /**
   * Whether the pillar should animate
   * @default true
   */
  animate?: boolean;
  /**
   * The height of the pillar
   * @default "100%"
   */
  height?: string | number;
  /**
   * The width of the pillar
   * @default 4
   */
  width?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

const colorMap = {
  octave: "#FF6B6B",
  transform: "#9B59B6",
  solar: "#F1C40F",
  architect: "#3498DB",
  world: "#2ECC71",
  life: "#E74C3C",
  unity: "#1ABC9C",
};

const intensityMap = {
  low: {
    blur: "blur-[60px]",
    opacity: 0.2,
    spread: 20,
  },
  medium: {
    blur: "blur-[100px]",
    opacity: 0.4,
    spread: 40,
  },
  high: {
    blur: "blur-[140px]",
    opacity: 0.6,
    spread: 60,
  },
};

export function LightPillar({
  color = "solar",
  intensity = "medium",
  animate = true,
  height = "100%",
  width = 4,
  className,
  style,
}: LightPillarProps) {
  const colorValue = colorMap[color];
  const intensityConfig = intensityMap[intensity];

  return (
    <div
      className={cn(
        "relative pointer-events-none",
        className
      )}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: `${width}px`,
        ...style,
      }}
    >
      {/* Core pillar */}
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          animate && "animate-[pillar-glow_4s_ease-in-out_infinite]"
        )}
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${colorValue} 20%, ${colorValue} 80%, transparent 100%)`,
          opacity: 0.8,
        }}
      />
      
      {/* Glow effect */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 rounded-full",
          intensityConfig.blur,
          animate && "animate-[pillar-pulse_3s_ease-in-out_infinite]"
        )}
        style={{
          width: `${width * intensityConfig.spread}px`,
          height: "80%",
          top: "10%",
          background: colorValue,
          opacity: intensityConfig.opacity,
        }}
      />
      
      {/* Secondary glow (inner) */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 rounded-full blur-[20px]",
          animate && "animate-[pillar-pulse_3s_ease-in-out_infinite_0.5s]"
        )}
        style={{
          width: `${width * 4}px`,
          height: "60%",
          top: "20%",
          background: colorValue,
          opacity: intensityConfig.opacity * 1.5,
        }}
      />
    </div>
  );
}

/**
 * Multiple pillars arranged in a group
 */
interface LightPillarGroupProps {
  /**
   * Number of pillars to render
   * @default 3
   */
  count?: number;
  /**
   * Spacing between pillars
   * @default 40
   */
  spacing?: number;
  /**
   * Colors for each pillar (cycles through if fewer than count)
   */
  colors?: LightPillarProps["color"][];
  /**
   * Intensity of all pillars
   * @default "medium"
   */
  intensity?: LightPillarProps["intensity"];
  /**
   * Whether pillars should animate
   * @default true
   */
  animate?: boolean;
  /**
   * Height of all pillars
   * @default "100%"
   */
  height?: string | number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function LightPillarGroup({
  count = 3,
  spacing = 40,
  colors = ["solar", "transform", "architect"],
  intensity = "medium",
  animate = true,
  height = "100%",
  className,
}: LightPillarGroupProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ gap: `${spacing}px` }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <LightPillar
          key={index}
          color={colors[index % colors.length]}
          intensity={intensity}
          animate={animate}
          height={height}
          style={{
            animationDelay: `${index * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

export default LightPillar;
