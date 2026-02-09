"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { LightPillar } from "../effects/LightPillar";

type LightPillarColor = "octave" | "transform" | "solar" | "architect" | "world" | "life" | "unity";
import { cn } from "@/lib/utils";

// Animation phases
export type AnimationPhase = 
  | "idle"
  | "awakening"
  | "transforming"
  | "expanding"
  | "wave"
  | "reveal"
  | "complete";

// Phase configuration
interface PhaseConfig {
  name: string;
  duration: number; // in seconds
  startTime: number;
  endTime: number;
}

const PHASES: Record<AnimationPhase, PhaseConfig> = {
  idle: { name: "Idle", duration: 0, startTime: 0, endTime: 0 },
  awakening: { name: "Awakening", duration: 3, startTime: 0, endTime: 3 },
  transforming: { name: "Transformation", duration: 3, startTime: 3, endTime: 6 },
  expanding: { name: "Expansion", duration: 3, startTime: 6, endTime: 9 },
  wave: { name: "Resonance", duration: 3, startTime: 9, endTime: 12 },
  reveal: { name: "Revelation", duration: 1, startTime: 12, endTime: 13 },
  complete: { name: "Complete", duration: 0, startTime: 13, endTime: 13 },
};

// 13 power-number colors
const COLOR_SEQUENCE = [
  "#FF6B6B", // Octave Red
  "#9B59B6", // Transform Purple
  "#F1C40F", // Solar Gold
  "#3498DB", // Architect Blue
  "#2ECC71", // World Green
  "#E74C3C", // Life Red
  "#1ABC9C", // Unity Teal
  "#E67E22", // Sacred Orange
  "#95A5A6", // Balance Silver
  "#34495E", // Depth Slate
  "#16A085", // Flow Green
  "#D35400", // Ember Orange
  "#8E44AD", // Mystery Violet
] as const;

// Beat timing (8 beats over 13 seconds)
const BEAT_INTERVAL = 13 / 8; // 1.625 seconds

interface UnlockAnimationProps {
  chapterTitle?: string;
  chapterColor?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  reducedMotion?: boolean;
  className?: string;
}

export function UnlockAnimation({
  chapterTitle = "Chapter Unlocked",
  chapterColor = "#F1C40F",
  onComplete,
  onSkip,
  reducedMotion = false,
  className,
}: UnlockAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [beatCount, setBeatCount] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const controls = useAnimation();

  // Get current interpolated color
  const getCurrentColor = useCallback(() => {
    if (phase === "awakening") return COLOR_SEQUENCE[1]; // Violet
    if (phase === "reveal" || phase === "complete") return chapterColor;
    
    const colorProgress = (elapsedTime - 3) / 3; // 3-6 second window
    if (colorProgress < 0) return COLOR_SEQUENCE[0];
    if (colorProgress >= 1) return COLOR_SEQUENCE[12];
    
    const index = Math.floor(colorProgress * 13);
    return COLOR_SEQUENCE[Math.min(index, 12)];
  }, [phase, elapsedTime, chapterColor]);

  // Animation loop
  useEffect(() => {
    if (phase === "idle") return;
    if (reducedMotion) {
      setPhase("complete");
      setProgress(100);
      onComplete?.();
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      setElapsedTime(elapsed);
      setProgress(Math.min((elapsed / 13) * 100, 100));

      // Determine current phase
      if (elapsed < 3) setPhase("awakening");
      else if (elapsed < 6) setPhase("transforming");
      else if (elapsed < 9) setPhase("expanding");
      else if (elapsed < 12) setPhase("wave");
      else if (elapsed < 13) setPhase("reveal");
      else {
        setPhase("complete");
        onComplete?.();
        return;
      }

      // Update color index during transformation phase
      if (elapsed >= 3 && elapsed < 6) {
        const colorProgress = (elapsed - 3) / 3;
        setCurrentColorIndex(Math.floor(colorProgress * 13));
      }

      // Beat detection
      const currentBeat = Math.floor(elapsed / BEAT_INTERVAL);
      if (currentBeat !== beatCount && currentBeat < 8) {
        setBeatCount(currentBeat);
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 300);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, beatCount, reducedMotion, onComplete]);

  // Start animation
  const startAnimation = useCallback(() => {
    startTimeRef.current = 0;
    setPhase("awakening");
  }, []);

  // Skip animation
  const handleSkip = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setPhase("complete");
    setProgress(100);
    onSkip?.();
    onComplete?.();
  }, [onSkip, onComplete]);

  // Auto-start on mount
  useEffect(() => {
    const timer = setTimeout(startAnimation, 100);
    return () => clearTimeout(timer);
  }, [startAnimation]);

  // Render light pillars based on phase
  const renderLightPillars = () => {
    const pillarConfigs = {
      idle: { count: 0, colors: [] as string[], intensity: "low" as const },
      awakening: { 
        count: 3, 
        colors: ["transform", "solar", "transform"] as const, 
        intensity: "medium" as const 
      },
      transforming: { 
        count: 5, 
        colors: ["octave", "transform", "solar", "architect", "world"] as const, 
        intensity: "high" as const 
      },
      expanding: { 
        count: 7, 
        colors: ["octave", "transform", "solar", "architect", "world", "life", "unity"] as const, 
        intensity: "high" as const 
      },
      wave: { 
        count: 8, 
        colors: ["octave", "transform", "solar", "architect", "world", "life", "unity", "octave"] as const, 
        intensity: "high" as const 
      },
      reveal: { 
        count: 13, 
        colors: Array(13).fill("solar") as Array<"solar">, 
        intensity: "high" as const 
      },
      complete: { 
        count: 3, 
        colors: ["solar", "solar", "solar"] as const, 
        intensity: "medium" as const 
      },
    };

    const config = pillarConfigs[phase];
    const currentColor = getCurrentColor();

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-end justify-center gap-8" style={{ height: "60%" }}>
          {Array.from({ length: config.count }).map((_, i) => (
            <motion.div
              key={`${phase}-${i}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: `${60 + (i % 3) * 20}%`, 
                opacity: 1,
                scale: showPulse ? 1.1 : 1,
              }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.1,
                scale: { duration: 0.15 }
              }}
            >
              <LightPillar
                color={config.colors[i % config.colors.length] as LightPillarColor}
                intensity={config.intensity}
                height="100%"
                width={phase === "reveal" ? 6 : 4}
                animate={phase !== "complete"}
                style={{
                  filter: `drop-shadow(0 0 20px ${currentColor})`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Render 19-point mandala
  const renderMandala = () => {
    if (phase !== "expanding" && phase !== "wave" && phase !== "reveal") return null;

    const points = 19;
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    // Generate 19 points on a circle
    const generatePoints = () => {
      return Array.from({ length: points }, (_, i) => {
        const angle = (i * 2 * Math.PI) / points - Math.PI / 2;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });
    };

    const mandalaPoints = generatePoints();
    const currentColor = getCurrentColor();

    return (
      <motion.svg
        className="absolute inset-0 m-auto pointer-events-none"
        width="300"
        height="300"
        viewBox="0 0 300 300"
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={{ 
          scale: phase === "expanding" ? [0, 1.5, 1] : phase === "wave" ? 1.2 : 1,
          rotate: phase === "expanding" ? 360 : phase === "wave" ? 720 : 0,
          opacity: 1 
        }}
        transition={{ 
          duration: 3, 
          ease: [0.34, 1.56, 0.64, 1],
          rotate: { duration: 3, ease: "linear" }
        }}
      >
        {/* Outer circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={currentColor}
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Inner circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.5}
          fill="none"
          stroke={currentColor}
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Connect points to center */}
        {mandalaPoints.map((point, i) => (
          <line
            key={`line-${i}`}
            x1={centerX}
            y1={centerY}
            x2={point.x}
            y2={point.y}
            stroke={currentColor}
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Connect adjacent points */}
        {mandalaPoints.map((point, i) => {
          const nextPoint = mandalaPoints[(i + 1) % points];
          return (
            <line
              key={`connect-${i}`}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke={currentColor}
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Connect every 6th point (sacred geometry) */}
        {mandalaPoints.map((point, i) => {
          const nextPoint = mandalaPoints[(i + 6) % points];
          return (
            <line
              key={`sacred-${i}`}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke={currentColor}
              strokeWidth="1.5"
              opacity="0.4"
            />
          );
        })}

        {/* Points */}
        {mandalaPoints.map((point, i) => (
          <motion.circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={currentColor}
            initial={{ scale: 0 }}
            animate={{ scale: showPulse ? 1.5 : 1 }}
            transition={{ duration: 0.15 }}
          />
        ))}

        {/* Center glow */}
        <circle
          cx={centerX}
          cy={centerY}
          r="20"
          fill={currentColor}
          opacity="0.3"
          filter="blur(10px)"
        />
      </motion.svg>
    );
  };

  // Render sound wave rings
  const renderSoundWaves = () => {
    if (phase !== "wave" && phase !== "reveal") return null;

    const currentColor = getCurrentColor();

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 1, 2, 3, 4].map((ring) => (
          <motion.div
            key={`wave-${ring}`}
            className="absolute rounded-full border-2"
            style={{ borderColor: currentColor }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: [0, 100 + ring * 80],
              height: [0, 100 + ring * 80],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: phase === "wave" ? Infinity : 0,
              delay: ring * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    );
  };

  // Render pulse rings on beat
  const renderPulseRings = () => {
    if (!showPulse || phase === "complete") return null;

    const currentColor = getCurrentColor();

    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            boxShadow: `0 0 60px 30px ${currentColor}40`,
          }}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.div>
    );
  };

  // Render chapter title
  const renderChapterTitle = () => {
    if (phase !== "reveal" && phase !== "complete") return null;

    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="text-center"
          style={{
            textShadow: `0 0 40px ${chapterColor}80`,
          }}
        >
          <motion.p
            className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Unlocked
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-bold"
            style={{ color: chapterColor }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {chapterTitle}
          </motion.h2>
        </motion.div>

        {/* Particle burst */}
        {phase === "reveal" && (
          <ParticleBurst color={chapterColor} count={30} />
        )}
      </motion.div>
    );
  };

  // Progress indicator
  const renderProgress = () => {
    if (phase === "complete" || phase === "idle") return null;

    return (
      <div className="absolute bottom-8 left-8 right-8 z-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {PHASES[phase].name}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.ceil(13 - elapsedTime)}s
          </span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: getCurrentColor() }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    );
  };

  // Background color based on phase
  const getBackgroundStyle = () => {
    const currentColor = getCurrentColor();
    
    switch (phase) {
      case "idle":
        return { background: "#0a0a0a" };
      case "awakening":
        return { 
          background: `radial-gradient(circle at center, ${currentColor}15 0%, transparent 70%)`,
        };
      case "transforming":
        return { 
          background: `radial-gradient(circle at center, ${currentColor}20 0%, ${COLOR_SEQUENCE[(currentColorIndex + 6) % 13]}10 50%, transparent 70%)`,
        };
      case "expanding":
      case "wave":
        return { 
          background: `radial-gradient(circle at center, ${currentColor}25 0%, transparent 60%)`,
        };
      case "reveal":
      case "complete":
        return { 
          background: `radial-gradient(circle at center, ${chapterColor}30 0%, transparent 70%)`,
        };
      default:
        return { background: "#0a0a0a" };
    }
  };

  // Reduced motion variant
  if (reducedMotion) {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[400px] p-8", className)}>
        <div 
          className="w-20 h-20 rounded-full mb-6 flex items-center justify-center"
          style={{ backgroundColor: `${chapterColor}20`, border: `2px solid ${chapterColor}` }}
        >
          <span className="text-2xl">✦</span>
        </div>
        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Unlocked</p>
        <h2 className="text-3xl font-bold text-center" style={{ color: chapterColor }}>
          {chapterTitle}
        </h2>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      style={{ 
        ...getBackgroundStyle(),
        willChange: "background",
      }}
    >
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-50 px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors rounded-md bg-background/50 backdrop-blur-sm"
        aria-label="Skip animation"
      >
        Skip
      </button>

      {/* Animation layers */}
      {renderLightPillars()}
      {renderMandala()}
      {renderSoundWaves()}
      {renderPulseRings()}
      {renderChapterTitle()}
      {renderProgress()}

      {/* Beat indicator */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`beat-${i}`}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-150",
              i < beatCount ? "bg-primary scale-100" : "bg-muted scale-75"
            )}
            style={{
              backgroundColor: i < beatCount ? getCurrentColor() : undefined,
              transform: i === beatCount && showPulse ? "scale(1.5)" : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Particle burst component
interface ParticleBurstProps {
  color: string;
  count: number;
}

function ParticleBurst({ color, count }: ParticleBurstProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360;
        const distance = 100 + Math.random() * 100;
        const size = 4 + Math.random() * 8;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 1,
              scale: 0,
            }}
            animate={{ 
              x: Math.cos((angle * Math.PI) / 180) * distance,
              y: Math.sin((angle * Math.PI) / 180) * distance,
              opacity: 0,
              scale: [0, 1, 0.5],
            }}
            transition={{ 
              duration: 1 + Math.random() * 0.5,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

export default UnlockAnimation;
