"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Lock, CheckCircle2, Play } from "lucide-react";
import { UnlockAnimation } from "./UnlockAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Cycle color mapping
const cycleColors = {
  physical: {
    primary: "#ef4444",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    glow: "shadow-red-500/20",
  },
  emotional: {
    primary: "#3b82f6",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  intellectual: {
    primary: "#eab308",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    glow: "shadow-yellow-500/20",
  },
  spiritual: {
    primary: "#a855f7",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
  },
};

const cycleNames = {
  physical: "Physical",
  emotional: "Emotional",
  intellectual: "Intellectual",
  spiritual: "Spiritual",
};

export interface ChapterPreview {
  id: number;
  order: number;
  title: string;
  subtitle?: string | null;
  cycle: keyof typeof cycleColors | null;
  durationMinutes?: number | null;
  description?: string | null;
  lore?: {
    element?: string;
    tarot?: string;
    affirmation?: string;
    meaning?: string;
  };
}

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: ChapterPreview | null;
  onStartChapter?: (chapterId: number) => void;
  className?: string;
}

export function UnlockModal({
  isOpen,
  onClose,
  chapter,
  onStartChapter,
  className,
}: UnlockModalProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAnimationComplete(reducedMotion);
    }
  }, [isOpen, reducedMotion]);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  const handleStartChapter = useCallback(() => {
    if (chapter) {
      onStartChapter?.(chapter.id);
    }
    onClose();
  }, [chapter, onStartChapter, onClose]);

  const handleSkip = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  const colors = chapter?.cycle ? cycleColors[chapter.cycle] : cycleColors.physical;

  if (!chapter) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={animationComplete ? onClose : undefined}
          />

          {/* Modal container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={cn(
                "relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-background shadow-2xl",
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Close button (visible after animation) */}
              {animationComplete && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Animation container */}
              {!animationComplete && (
                <div className="aspect-video w-full">
                  <UnlockAnimation
                    chapterTitle={chapter.title}
                    chapterColor={colors.primary}
                    onComplete={handleAnimationComplete}
                    onSkip={handleSkip}
                    reducedMotion={reducedMotion}
                    className="w-full h-full"
                  />
                </div>
              )}

              {/* Chapter preview (shown after animation) */}
              <AnimatePresence>
                {animationComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Header */}
                    <div className={cn("p-6 text-center", colors.bg)}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className={cn(
                          "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
                          "bg-background border-2",
                          colors.border
                        )}
                        style={{ boxShadow: `0 0 30px ${colors.primary}40` }}
                      >
                        <Sparkles className={cn("w-8 h-8", colors.text)} />
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm uppercase tracking-wider text-muted-foreground mb-2"
                      >
                        Chapter {chapter.order} Unlocked
                      </motion.p>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl md:text-3xl font-bold mb-2"
                      >
                        {chapter.title}
                      </motion.h2>

                      {chapter.subtitle && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-muted-foreground"
                        >
                          {chapter.subtitle}
                        </motion.p>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Tags */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-2"
                      >
                        {chapter.cycle && (
                          <span
                            className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                              colors.bg,
                              colors.text
                            )}
                          >
                            {cycleNames[chapter.cycle]}
                          </span>
                        )}
                        {chapter.durationMinutes && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                            {chapter.durationMinutes} min
                          </span>
                        )}
                      </motion.div>

                      {/* Description */}
                      {chapter.description && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-center text-muted-foreground leading-relaxed"
                        >
                          {chapter.description}
                        </motion.p>
                      )}

                      {/* Lore card */}
                      {chapter.lore && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Card className={cn("border-2", colors.border, colors.bg)}>
                            <CardContent className="p-4 space-y-3">
                              {chapter.lore.affirmation && (
                                <p className="text-lg font-medium italic text-center">
                                  &ldquo;{chapter.lore.affirmation}&rdquo;
                                </p>
                              )}
                              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                                {chapter.lore.element && (
                                  <span>Element: {chapter.lore.element}</span>
                                )}
                                {chapter.lore.tarot && (
                                  <span>Tarot: {chapter.lore.tarot}</span>
                                )}
                              </div>
                              {chapter.lore.meaning && (
                                <p className="text-xs text-center text-muted-foreground">
                                  {chapter.lore.meaning}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      {/* Confetti effect */}
                      <ConfettiEffect color={colors.primary} />

                      {/* Actions */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
                      >
                        <Button
                          size="lg"
                          className="w-full sm:w-auto gap-2"
                          style={{ 
                            backgroundColor: colors.primary,
                            color: "#ffffff",
                          }}
                          onClick={handleStartChapter}
                        >
                          <Play className="w-4 h-4" />
                          Start Chapter
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto"
                          onClick={onClose}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Continue Later
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Confetti effect component
interface ConfettiEffectProps {
  color: string;
}

function ConfettiEffect({ color }: ConfettiEffectProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 1 + Math.random() * 1;
        const size = 6 + Math.random() * 6;

        return (
          <motion.div
            key={`confetti-${i}`}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`,
              top: -20,
              width: size,
              height: size,
              backgroundColor: color,
              opacity: 0.6,
            }}
            initial={{ y: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: [0, 400],
              rotate: [0, 720],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration,
              delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

// Hook for using unlock modal
export function useUnlockModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [chapter, setChapter] = useState<ChapterPreview | null>(null);

  const openUnlockModal = useCallback((chapterData: ChapterPreview) => {
    setChapter(chapterData);
    setIsOpen(true);
  }, []);

  const closeUnlockModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setChapter(null), 300);
  }, []);

  return {
    isOpen,
    chapter,
    openUnlockModal,
    closeUnlockModal,
  };
}

export default UnlockModal;
