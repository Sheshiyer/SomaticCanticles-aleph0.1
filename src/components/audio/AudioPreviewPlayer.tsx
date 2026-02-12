"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock,
  BookOpen,
  Headphones,
  ChevronDown,
  SkipBack,
  SkipForward,
} from "lucide-react";

import { Card, CardCorners, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface Chapter {
  id: number;
  title: string;
  duration: string;
  previewAvailable: boolean;
}

interface AudioPreviewPlayerProps {
  chapters: Chapter[];
  className?: string;
}

// Waveform visualization component
function WaveformVisualization({ isPlaying }: { isPlaying: boolean }) {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial random bars
    setBars(Array.from({ length: 40 }, () => Math.random() * 0.6 + 0.2));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => Math.random() * 0.7 + 0.3)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-center justify-center gap-[2px] h-full px-4">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-amber-500/60 to-cyan-500/60 rounded-full"
          animate={{
            height: `${Math.max(15, height * 100)}%`,
            opacity: isPlaying ? 0.8 + Math.random() * 0.2 : 0.4,
          }}
          transition={{
            duration: 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Chapter selector dropdown
function ChapterSelector({
  chapters,
  selectedChapter,
  onSelect,
  isOpen,
  onToggle,
}: {
  chapters: Chapter[];
  selectedChapter: Chapter;
  onSelect: (chapter: Chapter) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg",
          "bg-metal-800/50 border border-metal-700",
          "text-sm text-foreground hover:border-metal-600 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/30"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">
            Ch. {selectedChapter.id}: {selectedChapter.title}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-1 z-50",
              "max-h-[200px] overflow-y-auto",
              "bg-metal-900/95 backdrop-blur-sm border border-metal-700 rounded-lg",
              "shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            )}
          >
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => {
                  onSelect(chapter);
                  onToggle();
                }}
                disabled={!chapter.previewAvailable}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-left",
                  "text-sm transition-colors",
                  chapter.id === selectedChapter.id
                    ? "bg-metal-800 text-primary"
                    : "hover:bg-metal-800/50",
                  !chapter.previewAvailable && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="truncate">
                  Ch. {chapter.id}: {chapter.title}
                </span>
                {chapter.previewAvailable ? (
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {chapter.duration}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    Locked
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main AudioPreviewPlayer component
export function AudioPreviewPlayer({
  chapters,
  className,
}: AudioPreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(960); // 16 minutes in seconds
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(
    chapters.find((c) => c.previewAvailable) || chapters[0]
  );
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Calculate total duration
  const totalDurationMinutes = chapters.reduce((total, chapter) => {
    const [mins] = chapter.duration.split(":").map(Number);
    return total + (mins || 0);
  }, 0);

  const availableChapters = chapters.filter((c) => c.previewAvailable).length;

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Mock progress update
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!selectedChapter.previewAvailable) return;
    setIsPlaying((prev) => !prev);
  }, [selectedChapter.previewAvailable]);

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    setCurrentTime((prev) => {
      const newTime = Math.max(0, Math.min(prev + seconds, duration));
      return newTime;
    });
  }, [duration]);

  // Handle volume change
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Progress percentage
  const progressPercent = (currentTime / duration) * 100;

  return (
    <Card
      variant="glass"
      className={cn("w-full max-w-xl mx-auto overflow-visible", className)}
    >
      <CardCorners color="cyan" />

      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-cyan-500" />
              Audio Preview
            </CardTitle>
            <CardDescription>
              Experience guided somatic practice sessions
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total Duration</div>
            <div className="text-sm font-medium text-metallic">
              {totalDurationMinutes} minutes
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Waveform visualization */}
      <div className="relative h-20 mx-5 mb-4 rounded-lg overflow-hidden bg-metal-950/50 border border-metal-800">
        <WaveformVisualization isPlaying={isPlaying} />

        {/* Overlay title when not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-metal-950/30">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Play className="h-4 w-4" />
              Click play to preview
            </span>
          </div>
        )}

        {/* Progress overlay */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Chapter selector */}
      <div className="px-5 mb-4">
        <ChapterSelector
          chapters={chapters}
          selectedChapter={selectedChapter}
          onSelect={(chapter) => {
            setSelectedChapter(chapter);
            setCurrentTime(0);
            setIsPlaying(false);
          }}
          isOpen={isSelectorOpen}
          onToggle={() => setIsSelectorOpen((prev) => !prev)}
        />
      </div>

      {/* Time display */}
      <div className="px-5 mb-4 flex items-center justify-between text-sm">
        <span className="font-mono text-cyan-400">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 mx-4">
          <div className="h-1.5 bg-metal-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-cyan-500"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
        <span className="font-mono text-muted-foreground">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Skip back */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(-10)}
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          {/* Center: Play/Pause */}
          <Button
            size="lg"
            className={cn(
              "h-14 w-14 rounded-full",
              selectedChapter.previewAvailable
                ? "bg-gradient-to-b from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500"
                : "bg-metal-800 text-muted-foreground cursor-not-allowed"
            )}
            onClick={togglePlay}
            disabled={!selectedChapter.previewAvailable}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>

          {/* Right: Skip forward */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(10)}
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume control */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            {/* Volume slider popup */}
            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-metal-900/95 backdrop-blur-sm border border-metal-700 rounded-lg shadow-lg"
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <div className="h-24 w-6">
                    <Slider
                      orientation="vertical"
                      value={[isMuted ? 0 : volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-24">
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
            />
          </div>

          <span className="text-xs text-muted-foreground w-8">
            {isMuted ? 0 : volume}%
          </span>
        </div>
      </div>

      {/* Footer stats */}
      <div className="px-5 py-4 border-t border-metal-800/50 bg-metal-900/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Total: {totalDurationMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span>
                Chapters: {availableChapters}/{chapters.length} available
              </span>
            </div>
          </div>
          <div className="text-muted-foreground">
            {Math.round((availableChapters / chapters.length) * 100)}% unlocked
          </div>
        </div>
      </div>
    </Card>
  );
}

// Default/mock chapters data for easy usage
export const defaultAudioChapters: Chapter[] = [
  { id: 1, title: "The Choroid Plexus", duration: "16:00", previewAvailable: true },
  { id: 2, title: "Blood-Brain Barrier", duration: "14:30", previewAvailable: true },
  { id: 3, title: "Cerebrospinal Fluid", duration: "15:45", previewAvailable: false },
  { id: 4, title: "The Ventricular System", duration: "13:20", previewAvailable: false },
  { id: 5, title: "Neural Pathways", duration: "17:10", previewAvailable: false },
  { id: 6, title: "Synaptic Transmission", duration: "12:45", previewAvailable: false },
  { id: 7, title: "Neuroplasticity", duration: "18:30", previewAvailable: false },
  { id: 8, title: "The Pineal Gland", duration: "11:15", previewAvailable: false },
  { id: 9, title: "Circadian Rhythms", duration: "14:00", previewAvailable: false },
  { id: 10, title: "The Divine Structure", duration: "16:45", previewAvailable: false },
  { id: 11, title: "Integration Phase", duration: "13:30", previewAvailable: false },
  { id: 12, title: "The Awakening", duration: "19:00", previewAvailable: false },
];

// Skeleton loader
export function AudioPreviewPlayerSkeleton() {
  return (
    <Card variant="glass" className="w-full max-w-xl mx-auto">
      <div className="p-5 space-y-4">
        <div className="h-5 w-32 bg-metal-800 rounded animate-pulse" />
        <div className="h-20 bg-metal-800/50 rounded-lg animate-pulse" />
        <div className="h-10 bg-metal-800 rounded-lg animate-pulse" />
        <div className="flex justify-center gap-4">
          <div className="h-10 w-10 rounded-full bg-metal-800 animate-pulse" />
          <div className="h-14 w-14 rounded-full bg-metal-800 animate-pulse" />
          <div className="h-10 w-10 rounded-full bg-metal-800 animate-pulse" />
        </div>
      </div>
    </Card>
  );
}

export default AudioPreviewPlayer;
