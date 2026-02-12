"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BookOpen, Filter, Sparkles, RefreshCcw } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChapterCard, ChapterCardSkeleton } from "@/components/chapters/ChapterCard";
import {
  getChaptersList,
  checkChapterUnlocks,
  invalidateChapterCache,
  type ChapterSummary,
} from "@/lib/chapters/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

type CycleFilter = "all" | "physical" | "emotional" | "intellectual" | "spiritual";
type SortOrder = "unlock" | "order";

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<ChapterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingUnlocks, setCheckingUnlocks] = useState(false);
  const [cycleFilter, setCycleFilter] = useState<CycleFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("unlock");
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    completed: 0,
  });

  // Fetch chapters
  const fetchChapters = useCallback(async (showToast = false) => {
    try {
      const response = await getChaptersList();

      if (response.success && response.data) {
        setChapters(response.data.chapters);
        setStats({
          total: response.data.total,
          unlocked: response.data.unlocked,
          completed: response.data.completed,
        });
        if (showToast) {
          toast.success("Chapters refreshed");
        }
      } else {
        toast.error(response.error?.message || "Failed to load chapters");
      }
    } catch (error) {
      toast.error("Failed to load chapters");
      console.error("Fetch chapters error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for unlocks
  const handleCheckUnlocks = useCallback(async () => {
    try {
      setCheckingUnlocks(true);
      const response = await checkChapterUnlocks();

      if (response.success && response.data) {
        const newlyUnlocked = response.data.newly_unlocked;
        if (newlyUnlocked.length > 0) {
          toast.success(
            `Unlocked ${newlyUnlocked.length} new chapter${newlyUnlocked.length > 1 ? "s" : ""
            }!`,
            {
              description: newlyUnlocked.map((c) => c.title).join(", "),
            }
          );
          // Refresh chapters to show unlocked status
          await fetchChapters();
        } else {
          toast.info("No new chapters unlocked yet");
        }
      } else {
        toast.error(response.error?.message || "Failed to check unlocks");
      }
    } catch (error) {
      toast.error("Failed to check unlocks");
      console.error("Check unlocks error:", error);
    } finally {
      setCheckingUnlocks(false);
    }
  }, [fetchChapters]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...chapters];

    // Apply cycle filter
    if (cycleFilter !== "all") {
      filtered = filtered.filter((c) => c.cycle === cycleFilter);
    }

    // Apply sorting
    if (sortOrder === "unlock") {
      // Sort by unlock status (unlocked first), then by order
      filtered.sort((a, b) => {
        const aUnlocked = a.unlock_status !== "locked" ? 0 : 1;
        const bUnlocked = b.unlock_status !== "locked" ? 0 : 1;
        if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
        return a.order - b.order;
      });
    } else {
      // Sort by chapter order
      filtered.sort((a, b) => a.order - b.order);
    }

    setFilteredChapters(filtered);
  }, [chapters, cycleFilter, sortOrder]);

  // Initial fetch
  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // Check unlocks on mount
  useEffect(() => {
    handleCheckUnlocks();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <ChapterCardSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ErrorBoundary>
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">The 12 Somatic Canticles</h1>
            <p className="text-muted-foreground">
              {stats.completed}/{stats.total} chapters completed · {stats.unlocked} unlocked
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                invalidateChapterCache();
                fetchChapters(true);
              }}
              className="text-xs opacity-50 hover:opacity-100"
            >
              <RefreshCcw className="mr-2 h-3 w-3" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckUnlocks}
              disabled={checkingUnlocks}
            >
              {checkingUnlocks ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Checking...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Check Unlocks
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Progress overview */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Your Journey</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((stats.completed / stats.total) * 100)}% complete
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-center"
          variants={itemVariants}
        >
          <Tabs
            value={cycleFilter}
            onValueChange={(v) => setCycleFilter(v as CycleFilter)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-5 sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="physical">Body</TabsTrigger>
              <TabsTrigger value="emotional">Heart</TabsTrigger>
              <TabsTrigger value="intellectual">Mind</TabsTrigger>
              <TabsTrigger value="spiritual">Spirit</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="rounded-md border bg-transparent px-3 py-1.5 text-sm"
            >
              <option value="unlock">Sort by Unlock Status</option>
              <option value="order">Sort by Chapter Order</option>
            </select>
          </div>
        </motion.div>

        {/* Chapter grid */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
        >
          {filteredChapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              id={chapter.id}
              order={chapter.order}
              title={chapter.title}
              subtitle={chapter.subtitle}
              cycle={chapter.cycle}
              durationMinutes={chapter.duration_minutes}
              description={chapter.description}
              unlockStatus={chapter.unlock_status}
              progress={chapter.progress}
              iconUrl={chapter.icon_url}
              index={index}
            />
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredChapters.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No chapters found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more chapters.
            </p>
          </motion.div>
        )}
      </ErrorBoundary>
    </motion.div>
  );
}
