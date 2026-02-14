"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock3, FileText, Headphones, Layers } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { DataDisplay, HudPanel, TechFrame } from "@/components/ui/frame";
import { cn } from "@/lib/utils";

interface AdminChapter {
  id: number;
  order: number;
  title: string;
  subtitle: string | null;
  cycle: string | null;
  durationMinutes: number | null;
  hasAudio: boolean;
  hasContent: boolean;
  createdAt: string;
}

interface ChaptersPayload {
  stats: {
    totalChapters: number;
    chaptersWithAudio: number;
    chaptersWithContent: number;
    averageDurationMinutes: number;
  };
  chapters: AdminChapter[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function AdminChaptersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<ChaptersPayload>({
    stats: {
      totalChapters: 0,
      chaptersWithAudio: 0,
      chaptersWithContent: 0,
      averageDurationMinutes: 0,
    },
    chapters: [],
  });

  useEffect(() => {
    let mounted = true;

    const loadChapters = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/chapters");
        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.error || "Failed to load chapters");
        }

        if (mounted) {
          setPayload(data.data);
          setError(null);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load chapters";
        if (mounted) {
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadChapters();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4">
        <Spinner size="xl" />
        <p className="text-muted-foreground">Loading chapter index...</p>
      </div>
    );
  }

  return (
    <TechFrame variant="gold" className="scan-lines min-h-[calc(100vh-8rem)]">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-amber-400" />
          <div>
            <h1 className="text-3xl font-bold text-metallic">Chapter Catalog</h1>
            <p className="text-sm text-muted-foreground">
              Canonical content inventory from Supabase
            </p>
          </div>
        </motion.div>

        {error && (
          <motion.p variants={itemVariants} className="text-sm text-rose-400">
            {error}
          </motion.p>
        )}

        <motion.div variants={containerVariants} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <motion.div variants={itemVariants}>
            <DataDisplay
              label="Total Chapters"
              value={payload.stats.totalChapters}
              icon={<Layers className="h-3 w-3" />}
              variant="default"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DataDisplay
              label="With Audio"
              value={payload.stats.chaptersWithAudio}
              icon={<Headphones className="h-3 w-3" />}
              variant="tech"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DataDisplay
              label="With Content"
              value={payload.stats.chaptersWithContent}
              icon={<FileText className="h-3 w-3" />}
              variant="success"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DataDisplay
              label="Avg Duration"
              value={payload.stats.averageDurationMinutes}
              unit="min"
              icon={<Clock3 className="h-3 w-3" />}
              variant="warning"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HudPanel title="Chapter List" icon={<BookOpen className="h-4 w-4" />} variant="default">
            {payload.chapters.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No chapters found.
              </p>
            ) : (
              <div className="space-y-3">
                {payload.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex flex-col gap-2 rounded-lg border border-metal-700 bg-metal-900/40 p-3 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-metallic">
                        {chapter.order}. {chapter.title}
                      </p>
                      {chapter.subtitle && (
                        <p className="text-sm text-muted-foreground">{chapter.subtitle}</p>
                      )}
                      <p className="text-xs text-metal-500">
                        Created {new Date(chapter.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {chapter.cycle && (
                        <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-xs font-mono text-amber-300">
                          {chapter.cycle.toUpperCase()}
                        </span>
                      )}
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-mono",
                          chapter.hasContent
                            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                            : "border-metal-600 bg-metal-800/40 text-metal-400"
                        )}
                      >
                        {chapter.hasContent ? "CONTENT READY" : "NO CONTENT"}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-mono",
                          chapter.hasAudio
                            ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                            : "border-metal-600 bg-metal-800/40 text-metal-400"
                        )}
                      >
                        {chapter.hasAudio ? "AUDIO READY" : "NO AUDIO"}
                      </span>
                      {typeof chapter.durationMinutes === "number" &&
                        chapter.durationMinutes > 0 && (
                          <span className="rounded-full border border-metal-600 bg-metal-800/40 px-2 py-0.5 text-xs font-mono text-metal-300">
                            {chapter.durationMinutes} min
                          </span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </HudPanel>
        </motion.div>
      </motion.div>
    </TechFrame>
  );
}
