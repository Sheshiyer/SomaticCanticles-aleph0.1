"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronLeft, ChevronRight, Clock, CheckCircle2, Sparkles, Lock, BookOpen,
  ArrowLeft, Activity, Scroll, Brain, Lightbulb, Play, Pause, Book
} from "lucide-react";

import { RelatedLore } from "@/components/reading/RelatedLore";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TechFrame, HudPanel, DataDisplay } from "@/components/ui/frame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

import {
  getChapterDetail, getChaptersList, completeChapter, addChapterTime, saveChapterNotes,
  type ChapterDetail, type ChapterSummary,
} from "@/lib/chapters/api";

const cycleColors = {
  physical: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    accent: "#f59e0b",
    icon: Activity,
  },
  emotional: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    accent: "#06b6d4",
    icon: Brain,
  },
  intellectual: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    accent: "#8b5cf6",
    icon: Lightbulb,
  },
  spiritual: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    accent: "#10b981",
    icon: Sparkles,
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

  const fetchChapter = useCallback(async () => {
    try {
      setLoading(true);
      const detailResponse = await getChapterDetail(chapterId);

      if (detailResponse.success && detailResponse.data) {
        setChapter(detailResponse.data);
        setNotes(detailResponse.data.content?.reflection?.questions?.join("\n\n") || "");
      } else if (detailResponse.error?.code === "CHAPTER_LOCKED") {
        toast.error("This chapter is locked");
        router.push("/chapters");
      } else {
        toast.error(detailResponse.error?.message || "Failed to load chapter");
      }

      try {
        const listResponse = await getChaptersList();
        if (listResponse.success && listResponse.data) {
          setAllChapters(listResponse.data.chapters);
        }
      } catch (listError) {
        console.error("Failed to load chapter list:", listError);
      }
    } catch (error) {
      toast.error("Failed to load chapter");
      console.error("Fetch chapter error:", error);
    } finally {
      setLoading(false);
    }
  }, [chapterId, router]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  const handleComplete = async () => {
    try {
      setCompleting(true);
      if (sessionTime > 0) {
        await addChapterTime(chapterId, sessionTime);
        setSessionTime(0);
      }

      const response = await completeChapter(chapterId);
      if (response.success) {
        toast.success("Chapter completed! 🎉", { description: "Great work on your somatic practice." });
        await fetchChapter();
      } else {
        toast.error(response.error?.message || "Failed to complete chapter");
      }
    } catch (error) {
      toast.error("Failed to complete chapter");
    } finally {
      setCompleting(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await saveChapterNotes(chapterId, notes);
      toast.success("Notes saved");
    } catch (error) {
      toast.error("Failed to save notes");
    }
  };

  const getAdjacentChapters = () => {
    const currentIndex = allChapters.findIndex((c) => c.id === chapterId);
    return {
      prevChapter: currentIndex > 0 ? allChapters[currentIndex - 1] : null,
      nextChapter: currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null,
    };
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
  const CycleIcon = colors.icon;
  const { prevChapter, nextChapter } = getAdjacentChapters();
  const completedCount = allChapters.filter((c) => c.unlock_status === "completed").length;
  const totalChapters = allChapters.length || Math.max(chapter.order, 1);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Section */}
      <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" onClick={() => router.push("/chapters")} className="h-8 px-2">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <span className="text-muted-foreground">Chapter {chapter.order} of {totalChapters}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{completedCount} completed</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-metallic">{chapter.title}</h1>
              {chapter.unlock_status === "completed" && (
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              )}
            </div>
            {chapter.subtitle && (
              <p className="text-lg text-muted-foreground">{chapter.subtitle}</p>
            )}
          </div>

          <Button
            size="lg"
            className="md:w-auto w-full gap-2 px-6"
            onClick={() => router.push(`/chapters/${chapter.id}/read`)}
            shine
          >
            <BookOpen className="h-5 w-5" />
            Read Manuscript
          </Button>
        </div>

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-3">
          {chapter.cycle && (
            <Badge variant="outline" className={cn("gap-1.5 px-3 py-1", colors.badge)}>
              <CycleIcon className="h-3.5 w-3.5" />
              {cycleNames[chapter.cycle]}
            </Badge>
          )}
          {chapter.duration_minutes && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {chapter.duration_minutes} minutes
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className={cn("font-mono font-medium", colors.text)}>{chapter.progress}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={chapter.progress} variant={chapter.cycle === "emotional" ? "tech" : chapter.cycle === "spiritual" ? "success" : "default"} size="sm" />
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TechFrame variant="tech" size="sm">
          <TabsList className="grid w-full grid-cols-4 bg-metal-800/50 p-1">
            <TabsTrigger value="intro" className="gap-2 data-[state=active]:bg-metal-700">
              <Scroll className="h-4 w-4" />
              Introduction
            </TabsTrigger>
            <TabsTrigger value="practice" className="gap-2 data-[state=active]:bg-metal-700">
              <Activity className="h-4 w-4" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="reflection" className="gap-2 data-[state=active]:bg-metal-700">
              <Brain className="h-4 w-4" />
              Reflection
            </TabsTrigger>
            <TabsTrigger value="grimoire" className="gap-2 data-[state=active]:bg-metal-700">
              <Book className="h-4 w-4" />
              Grimoire
            </TabsTrigger>
          </TabsList>
        </TechFrame>

        {/* Intro Tab */}
        <TabsContent value="intro" className="space-y-6 animate-in fade-in-50 duration-500">
          <HudPanel title="Chapter Overview" icon={<Scroll className="h-5 w-5" />} className="scan-lines">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-metallic flex items-center gap-2">
                <Scroll className="h-5 w-5 text-primary" />
                Chapter Overview
              </h3>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                {chapter.description}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-metal-900/50 border border-metal-800 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
              <div className="space-y-2 text-center md:text-left">
                <h4 className="font-bold text-foreground">Begin Your Journey</h4>
                <p className="text-sm text-muted-foreground">Immerse yourself in the sacred text of this canticle.</p>
              </div>
              <Button
                size="lg"
                variant="glow"
                className="gap-2 px-8 shrink-0"
                onClick={() => router.push(`/chapters/${chapter.id}/read`)}
              >
                <BookOpen className="h-5 w-5" />
                Open Manuscript
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Wisdom Card - only show if lore metadata exists */}
              {chapter.lore_metadata && (
                <HudPanel title="Wisdom" icon={<Sparkles className="h-5 w-5" />} variant="tech">
                  {(chapter.lore_metadata as { affirmation?: string }).affirmation && (
                    <blockquote className="text-lg font-medium italic border-l-2 border-primary/50 pl-4">
                      &ldquo;{(chapter.lore_metadata as { affirmation: string }).affirmation}&rdquo;
                    </blockquote>
                  )}
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    {(chapter.lore_metadata as { element?: string }).element && (
                      <p><span className="text-foreground">Element:</span> {(chapter.lore_metadata as { element: string }).element}</p>
                    )}
                    {(chapter.lore_metadata as { book_name?: string }).book_name && (
                      <p><span className="text-foreground">Book:</span> {(chapter.lore_metadata as { book_name: string }).book_name}</p>
                    )}
                    {(chapter.lore_metadata as { tarot?: string }).tarot && (
                      <p><span className="text-foreground">Tarot:</span> {(chapter.lore_metadata as { tarot: string }).tarot}</p>
                    )}
                  </div>
                </HudPanel>
              )}
            </div>
          </HudPanel>
        </TabsContent>

        {/* Practice Tab */}
        <TabsContent value="practice" className="space-y-6">
          <HudPanel title={chapter.content?.practice?.title || "Somatic Practice"} icon={<Activity className="h-5 w-5" />} variant="tech" className="scan-lines">
            {chapter.content?.practice?.instructions ? (
              <ol className="list-decimal space-y-3 pl-5">
                {chapter.content.practice.instructions.map((instruction, index) => (
                  <li key={index} className="leading-relaxed pl-2">
                    {instruction}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted-foreground">Practice instructions coming soon...</p>
            )}

            {/* Audio Player Section */}
            <div className="rounded-xl border border-metal-700 bg-metal-900/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2 text-metallic">
                  <Activity className="w-4 h-4 text-primary" />
                  Guided Audio Practice
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {chapter.audio_url ? (
                <div className="space-y-4">
                  {/* Simple Audio Player UI */}
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-12 w-12 rounded-full"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <div className="flex-1 space-y-2">
                      <div className="h-1.5 bg-metal-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-primary rounded-full" />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0:00</span>
                        <span>{chapter.duration_minutes}:00</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Audio: {chapter.title} - {chapter.duration_minutes} minute guided practice
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-center">
                  <Activity className="w-10 h-10 mb-3 opacity-50" />
                  <p>Audio for this chapter is coming soon</p>
                  <p className="text-sm">Practice with the written instructions above</p>
                </div>
              )}
            </div>
          </HudPanel>
        </TabsContent>

        {/* Reflection Tab */}
        <TabsContent value="reflection" className="space-y-6">
          <HudPanel title={chapter.content?.reflection?.title || "Reflection"} icon={<Brain className="h-5 w-5" />} variant="default" className="scan-lines">
            {chapter.content?.reflection?.questions ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">Take a moment to reflect on these questions:</p>
                <ol className="space-y-3">
                  {chapter.content.reflection.questions.map((question, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{question}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-muted-foreground">Reflection questions coming soon...</p>
            )}
          </HudPanel>

          {/* Notes Card */}
          <HudPanel title="Your Notes" icon={<BookOpen className="h-5 w-5" />} variant="default" className="scan-lines">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your reflections here..."
              className="min-h-[150px] resize-none"
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveNotes} variant="outline">
                Save Notes
              </Button>
            </div>
          </HudPanel>
        </TabsContent>

        {/* Grimoire Tab */}
        <TabsContent value="grimoire" className="space-y-6">
          <HudPanel title="Archives & Lore" icon={<Book className="h-5 w-5" />} variant="default" className="scan-lines">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Unlock the deeper mysteries of the {chapter.cycle} cycle. As you progress, more entries from the World Bible will appear here.
              </p>
              <RelatedLore cycle={chapter.cycle} />
            </div>
          </HudPanel>
        </TabsContent>
      </Tabs >

      {/* Navigation & Actions */}
      < div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-metal-800" >
        <div className="flex items-center gap-2">
          {prevChapter && prevChapter.unlock_status !== "locked" ? (
            <Button variant="outline" onClick={() => router.push(`/chapters/${prevChapter.id}`)}>
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
            <Button variant="outline" onClick={() => router.push(`/chapters/${nextChapter.id}`)}>
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

        {
          chapter.unlock_status !== "completed" ? (
            <Button
              size="lg"
              onClick={handleComplete}
              disabled={completing}
              className="gap-2"
              shine
            >
              {completing ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Mark as Complete
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Completed</span>
            </div>
          )
        }
      </div >
    </motion.div >
  );
}

export default ChapterDetailPageClient;
