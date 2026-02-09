"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Lock,
  BookOpen,
  ArrowLeft,
  Activity,
} from "lucide-react";

import { Button } from "../../../../src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../src/components/ui/tabs";
import { Progress } from "../../../../src/components/ui/progress";
import { Textarea } from "../../../../src/components/ui/textarea";
import { Spinner } from "../../../../src/components/ui/spinner";
import { AudioPlayer, SessionTimer } from "../../../../src/components/audio/AudioPlayer";

import {
  getChapterDetail,
  getChaptersList,
  completeChapter,
  addChapterTime,
  saveChapterNotes,
  type ChapterDetail,
  type ChapterSummary,
} from "../../../../src/lib/chapters/api";

// Cycle colors
const cycleColors = {
  physical: {
    bg: "bg-ember-500/10",
    border: "border-ember-500/30",
    text: "text-ember-400",
    button: "bg-ember-500 hover:bg-ember-600",
    accent: "#ef4444",
  },
  emotional: {
    bg: "bg-ocean-500/10",
    border: "border-ocean-500/30",
    text: "text-ocean-400",
    button: "bg-ocean-500 hover:bg-ocean-600",
    accent: "#3b82f6",
  },
  intellectual: {
    bg: "bg-solar-500/10",
    border: "border-solar-500/30",
    text: "text-solar-400",
    button: "bg-solar-500 hover:bg-solar-600",
    accent: "#eab308",
  },
  spiritual: {
    bg: "bg-lunar-500/10",
    border: "border-lunar-500/30",
    text: "text-lunar-400",
    button: "bg-lunar-500 hover:bg-lunar-600",
    accent: "#a855f7",
  },
};

const cycleNames = {
  physical: "Physical",
  emotional: "Emotional",
  intellectual: "Intellectual",
  spiritual: "Spiritual",
};

interface ChapterDetailPageClientProps {
  chapterId: number;
}

// Audio chapter markers
const getChapterMarkers = (chapterOrder: number) => {
  const markers: Record<number, Array<{ time: number; label: string }>> = {
    1: [
      { time: 0, label: "Introduction" },
      { time: 60, label: "The Breath" },
      { time: 180, label: "Body Awareness" },
      { time: 300, label: "Closing" },
    ],
    2: [
      { time: 0, label: "Setup" },
      { time: 90, label: "Breathwork" },
      { time: 240, label: "Integration" },
    ],
  };
  return markers[chapterOrder] || [
    { time: 0, label: "Introduction" },
    { time: 120, label: "Practice" },
    { time: 300, label: "Reflection" },
  ];
};

export function ChapterDetailPageClient({ chapterId }: ChapterDetailPageClientProps) {
  const router = useRouter();

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [allChapters, setAllChapters] = useState<ChapterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("intro");
  const [audioProgress, setAudioProgress] = useState(0);
  const [biorhythmSync, setBiorhythmSync] = useState<{ value: number; phase: string } | null>(null);

  // Fetch chapter detail
  const fetchChapter = useCallback(async () => {
    try {
      setLoading(true);
      const [detailResponse, listResponse] = await Promise.all([
        getChapterDetail(chapterId),
        getChaptersList(),
      ]);

      if (detailResponse.success && detailResponse.data) {
        setChapter(detailResponse.data);
        setNotes(detailResponse.data.content?.reflection?.questions?.join("\n\n") || "");
        
        // Set initial audio progress from saved state
        const savedProgress = localStorage.getItem(`audio-progress-${detailResponse.data.audio_url}`);
        if (savedProgress) {
          setAudioProgress(parseFloat(savedProgress));
        }
      } else if (detailResponse.error?.code === "CHAPTER_LOCKED") {
        toast.error("This chapter is locked");
        router.push("/chapters");
      } else {
        toast.error(detailResponse.error?.message || "Failed to load chapter");
      }

      if (listResponse.success && listResponse.data) {
        setAllChapters(listResponse.data.chapters);
      }
    } catch (error) {
      toast.error("Failed to load chapter");
      console.error("Fetch chapter error:", error);
    } finally {
      setLoading(false);
    }
  }, [chapterId, router]);

  // Track session time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Save session time when leaving
  useEffect(() => {
    return () => {
      if (sessionTime > 0 && chapter) {
        addChapterTime(chapterId, sessionTime).catch(console.error);
      }
    };
  }, [sessionTime, chapterId, chapter]);

  // Simulate biorhythm sync visualization
  useEffect(() => {
    if (!isPlaying || !chapter?.cycle) return;

    const interval = setInterval(() => {
      // Simulate biorhythm value fluctuation during playback
      const baseValue = 0.5 + Math.sin(Date.now() / 10000) * 0.3;
      const noise = (Math.random() - 0.5) * 0.1;
      const value = Math.max(0, Math.min(1, baseValue + noise));
      
      let phase = "neutral";
      if (value > 0.7) phase = "peak";
      else if (value > 0.4) phase = "balanced";
      else if (value > 0.1) phase = "low";
      else phase = "critical";

      setBiorhythmSync({ value, phase });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, chapter?.cycle]);

  // Initial fetch
  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  // Handle complete chapter
  const handleComplete = async () => {
    try {
      setCompleting(true);
      
      // Save any remaining session time
      if (sessionTime > 0) {
        await addChapterTime(chapterId, sessionTime);
        setSessionTime(0);
      }

      const response = await completeChapter(chapterId);

      if (response.success) {
        toast.success("Chapter completed! 🎉", {
          description: "Great work on your somatic practice.",
        });
        await fetchChapter();
      } else {
        toast.error(response.error?.message || "Failed to complete chapter");
      }
    } catch (error) {
      toast.error("Failed to complete chapter");
      console.error("Complete chapter error:", error);
    } finally {
      setCompleting(false);
    }
  };

  // Handle save notes
  const handleSaveNotes = async () => {
    try {
      await saveChapterNotes(chapterId, notes);
      toast.success("Notes saved");
    } catch (error) {
      toast.error("Failed to save notes");
      console.error("Save notes error:", error);
    }
  };

  // Get prev/next chapter
  const getAdjacentChapters = () => {
    const currentIndex = allChapters.findIndex((c) => c.id === chapterId);
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;
    return { prevChapter, nextChapter };
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle audio time update
  const handleAudioTimeUpdate = (currentTime: number, duration: number) => {
    if (duration > 0) {
      const progress = (currentTime / duration) * 100;
      // Auto-complete at 90% progress
      if (progress >= 90 && chapter?.unlock_status !== "completed") {
        // Silently track without auto-completing
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Spinner size="xl" />
        <p className="text-muted-foreground">Loading chapter...</p>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Chapter not found</p>
        <Button variant="outline" onClick={() => router.push("/chapters")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chapters
        </Button>
      </div>
    );
  }

  const colors = chapter.cycle ? cycleColors[chapter.cycle] : cycleColors.physical;
  const { prevChapter, nextChapter } = getAdjacentChapters();
  const completedCount = allChapters.filter((c) => c.unlock_status === "completed").length;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/chapters")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <span className="text-sm text-muted-foreground">
            Chapter {chapter.order} of 12
          </span>
          <span className="text-sm text-muted-foreground">
            · {completedCount} completed
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{chapter.title}</h1>
            {chapter.unlock_status === "completed" && (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
          </div>
          {chapter.subtitle && (
            <p className="text-lg text-muted-foreground">{chapter.subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {chapter.cycle && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colors.bg} ${colors.text}`}
            >
              {cycleNames[chapter.cycle]}
            </span>
          )}
          {chapter.duration_minutes && (
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {chapter.duration_minutes} minutes
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            {chapter.progress}% complete
          </span>
        </div>

        {/* Progress bar */}
        <Progress value={chapter.progress} className="h-2" />
      </div>

      {/* Content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="intro">Introduction</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="reflection">Reflection</TabsTrigger>
        </TabsList>

        {/* Intro Tab */}
        <TabsContent value="intro" className="space-y-6">
          <Card className={`${colors.bg} ${colors.border} border-2`}>
            <CardHeader>
              <CardTitle>{chapter.content?.intro?.title || "Introduction"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                {chapter.content?.intro?.text || chapter.description}
              </p>
              {chapter.content?.intro?.duration_minutes && (
                <p className="text-sm text-muted-foreground">
                  Estimated reading time: {chapter.content.intro.duration_minutes} minutes
                </p>
              )}
            </CardContent>
          </Card>

          {/* Lore metadata */}
          {chapter.lore_metadata && (() => {
            const lore = chapter.lore_metadata as {
              affirmation?: string;
              element?: string;
              tarot?: string;
              meaning?: string;
            };
            return (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Wisdom
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lore.affirmation && (
                    <p className="text-lg font-medium italic">
                      &ldquo;{lore.affirmation}&rdquo;
                    </p>
                  )}
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    {lore.element && (
                      <p>{`Element: ${lore.element}`}</p>
                    )}
                    {lore.tarot && (
                      <p>{`Tarot: ${lore.tarot}`}</p>
                    )}
                    {lore.meaning && (
                      <p>{`Meaning: ${lore.meaning}`}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </TabsContent>

        {/* Practice Tab */}
        <TabsContent value="practice" className="space-y-6">
          <Card className={`${colors.bg} ${colors.border} border-2`}>
            <CardHeader>
              <CardTitle>
                {chapter.content?.practice?.title || "Somatic Practice"}
              </CardTitle>
              {chapter.content?.practice?.focus && (
                <CardDescription>
                  Focus: {chapter.content.practice.focus}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {chapter.content?.practice?.instructions ? (
                <ol className="list-decimal space-y-3 pl-5">
                  {chapter.content.practice.instructions.map((instruction, index) => (
                    <li key={index} className="leading-relaxed">
                      {instruction}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">Practice instructions coming soon...</p>
              )}

              {/* Audio Player */}
              <div className="mt-6 rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Guided Audio Practice
                  </h3>
                  <SessionTimer seconds={sessionTime} isActive={isPlaying} />
                </div>

                {chapter.audio_url ? (
                  <>
                    <AudioPlayer
                      src={chapter.audio_url}
                      title={`Chapter ${chapter.order}: ${chapter.title}`}
                      chapterMarkers={getChapterMarkers(chapter.order)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={handleAudioTimeUpdate}
                      accentColor={colors.accent}
                    />

                    {/* Biorhythm Sync Visualization */}
                    {isPlaying && biorhythmSync && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Biorhythm Sync</span>
                              <span className={cn(
                                "text-xs font-medium",
                                biorhythmSync.phase === "peak" && "text-green-500",
                                biorhythmSync.phase === "balanced" && "text-blue-500",
                                biorhythmSync.phase === "low" && "text-amber-500",
                                biorhythmSync.phase === "critical" && "text-red-500",
                              )}>
                                {biorhythmSync.phase.charAt(0).toUpperCase() + biorhythmSync.phase.slice(1)}
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className={cn(
                                  "h-full rounded-full transition-colors duration-500",
                                  biorhythmSync.phase === "peak" && "bg-green-500",
                                  biorhythmSync.phase === "balanced" && "bg-blue-500",
                                  biorhythmSync.phase === "low" && "bg-amber-500",
                                  biorhythmSync.phase === "critical" && "bg-red-500",
                                )}
                                animate={{ width: `${biorhythmSync.value * 100}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mb-3 opacity-50" />
                    <p>Audio for this chapter is coming soon</p>
                    <p className="text-sm mt-1">Practice with the written instructions above</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reflection Tab */}
        <TabsContent value="reflection" className="space-y-6">
          <Card className={`${colors.bg} ${colors.border} border-2`}>
            <CardHeader>
              <CardTitle>
                {chapter.content?.reflection?.title || "Reflection"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chapter.content?.reflection?.questions ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Take a moment to reflect on these questions:
                  </p>
                  <ul className="space-y-3">
                    {chapter.content.reflection.questions.map((question, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted-foreground">Reflection questions coming soon...</p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Your Notes</CardTitle>
              <CardDescription>
                Record your insights and experiences from this chapter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your reflections here..."
                className="min-h-[150px]"
              />
              <Button onClick={handleSaveNotes} variant="outline">
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {prevChapter && prevChapter.unlock_status !== "locked" ? (
            <Button
              variant="outline"
              onClick={() => router.push(`/chapters/${prevChapter.id}`)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}

          {nextChapter && nextChapter.unlock_status !== "locked" ? (
            <Button
              variant="outline"
              onClick={() => router.push(`/chapters/${nextChapter.id}`)}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : nextChapter ? (
            <Button variant="outline" disabled>
              <Lock className="mr-2 h-4 w-4" />
              Locked
            </Button>
          ) : null}
        </div>

        {chapter.unlock_status !== "completed" ? (
          <Button
            size="lg"
            className={colors.button}
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Mark as Complete
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Completed</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Helper for className concatenation
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default ChapterDetailPageClient;
