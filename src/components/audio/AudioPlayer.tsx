"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Playback speeds
const PLAYBACK_SPEEDS = [0.5, 1, 1.5] as const;
type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

// Chapter marker
export interface ChapterMarker {
  time: number; // in seconds
  label: string;
}

interface AudioPlayerProps {
  src: string;
  title?: string;
  chapterMarkers?: ChapterMarker[];
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  autoSaveProgress?: boolean;
  className?: string;
  accentColor?: string;
}

export function AudioPlayer({
  src,
  title = "Guided Practice",
  chapterMarkers = [],
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  autoSaveProgress = true,
  className,
  accentColor = "#F1C40F",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Visual waveform simulation
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(40).fill(0.1));

  // Load saved progress
  useEffect(() => {
    if (autoSaveProgress && src) {
      const savedProgress = localStorage.getItem(`audio-progress-${src}`);
      if (savedProgress && audioRef.current) {
        const time = parseFloat(savedProgress);
        if (time > 0 && time < (duration || Infinity)) {
          audioRef.current.currentTime = time;
          setCurrentTime(time);
        }
      }
    }
  }, [src, autoSaveProgress, duration]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime, audio.duration);

      // Save progress
      if (autoSaveProgress && Math.floor(audio.currentTime) % 5 === 0) {
        localStorage.setItem(`audio-progress-${src}`, String(audio.currentTime));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
      if (autoSaveProgress) {
        localStorage.removeItem(`audio-progress-${src}`);
      }
    };

    const handleError = () => {
      setError("Failed to load audio");
      setIsLoaded(false);
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
      setError(null);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [src, onTimeUpdate, onEnded, autoSaveProgress]);

  // Playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Visualizer animation
  useEffect(() => {
    if (!isPlaying) {
      setVisualizerData(Array(40).fill(0.1));
      return;
    }

    const animate = () => {
      setVisualizerData(prev =>
        prev.map((_, i) => {
          // Create wave pattern based on position and time
          const base = Math.sin(Date.now() / 200 + i * 0.3) * 0.3 + 0.4;
          const noise = Math.random() * 0.3;
          return Math.min(1, Math.max(0.1, base + noise));
        })
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Play/Pause toggle
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        await audio.play();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (err) {
      setError("Playback failed");
    }
  }, [isPlaying, isLoaded, onPlay, onPause]);

  // Seek
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(time, duration));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    seek(currentTime + seconds);
  }, [currentTime, seek]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Volume change
  const handleVolumeChange = useCallback((value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  // Cycle playback speed
  const cycleSpeed = useCallback(() => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    setPlaybackSpeed(PLAYBACK_SPEEDS[nextIndex]);
  }, [playbackSpeed]);

  // Seek to marker
  const seekToMarker = useCallback((time: number) => {
    seek(time);
    if (!isPlaying) {
      togglePlay();
    }
  }, [seek, isPlaying, togglePlay]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange([Math.min(1, volume + 0.1)]);
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume - 0.1)]);
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, skip, handleVolumeChange, volume, toggleMute]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress percentage
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    seek(percent * duration);
  }, [duration, seek]);

  if (error) {
    return (
      <div className={cn("p-4 rounded-lg bg-destructive/10 border border-destructive/30", className)}>
        <div className="flex items-center gap-2 text-destructive">
          <VolumeX className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Visualizer */}
      <div className="relative h-16 mb-4 overflow-hidden rounded-lg bg-muted/50">
        {/* Waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-4">
          {visualizerData.map((height, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full"
              style={{
                backgroundColor: accentColor,
                opacity: 0.6 + height * 0.4,
              }}
              animate={{
                height: `${Math.max(8, height * 100)}%`,
              }}
              transition={{
                duration: 0.1,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Title overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm font-medium bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
            {title}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div
          ref={progressRef}
          className="relative h-2 bg-muted rounded-full cursor-pointer group"
          onClick={handleProgressClick}
          role="slider"
          aria-label="Audio progress"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") skip(-5);
            if (e.key === "ArrowRight") skip(5);
          }}
        >
          {/* Progress fill */}
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ backgroundColor: accentColor }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.1 }}
          />

          {/* Chapter markers */}
          {chapterMarkers.map((marker, index) => {
            const markerPercent = (marker.time / duration) * 100;
            return (
              <button
                key={index}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-background border-2 rounded-full hover:scale-150 transition-transform"
                style={{
                  left: `${markerPercent}%`,
                  borderColor: accentColor,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  seekToMarker(marker.time);
                }}
                title={marker.label}
              />
            );
          })}

          {/* Hover thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            style={{
              left: `${progressPercent}%`,
              marginLeft: -8,
              borderColor: accentColor,
            }}
          />
        </div>

        {/* Time display */}
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Left controls */}
        <div className="flex items-center gap-2">
          {/* Playback speed */}
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleSpeed}
            className="text-xs font-medium h-8 px-2"
            title="Playback speed"
          >
            <Gauge className="w-3.5 h-3.5 mr-1" />
            {playbackSpeed}x
          </Button>

          {/* Skip back */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(-10)}
            className="h-10 w-10"
            title="Skip back 10 seconds"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
        </div>

        {/* Play/Pause button */}
        <Button
          size="lg"
          className="h-14 w-14 rounded-full"
          style={{
            backgroundColor: accentColor,
            color: "#0a0a0a",
          }}
          onClick={togglePlay}
          disabled={!isLoaded}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </Button>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Skip forward */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(10)}
            className="h-10 w-10"
            title="Skip forward 10 seconds"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          {/* Restart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => seek(0)}
            className="h-10 w-10"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          {/* Volume control */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="h-10 w-10"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>

            {/* Volume slider */}
            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-popover border rounded-lg shadow-lg"
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <div className="h-24 w-6">
                    <Slider
                      orientation="vertical"
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 text-xs text-muted-foreground text-center">
        <span className="inline-flex items-center gap-1">
          <Headphones className="w-3 h-3" />
          Space to play • ← → to seek • ↑ ↓ for volume • M to mute
        </span>
      </div>

      {/* Chapter markers list */}
      {chapterMarkers.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Chapter Sections
          </p>
          <div className="flex flex-wrap gap-2">
            {chapterMarkers.map((marker, index) => (
              <button
                key={index}
                onClick={() => seekToMarker(marker.time)}
                className={cn(
                  "text-xs px-2 py-1 rounded-md transition-colors",
                  currentTime >= marker.time && currentTime < (chapterMarkers[index + 1]?.time || duration)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {formatTime(marker.time)} - {marker.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Session timer component
interface SessionTimerProps {
  seconds: number;
  isActive: boolean;
  className?: string;
}

export function SessionTimer({ seconds, isActive, className }: SessionTimerProps) {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <div className={cn(
        "w-2 h-2 rounded-full transition-colors",
        isActive ? "bg-green-500 animate-pulse" : "bg-muted"
      )} />
      <span>Session: {formatTime(seconds)}</span>
    </div>
  );
}

export default AudioPlayer;
