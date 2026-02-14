import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

type UnlockStatus = "locked" | "unlocked" | "in-progress" | "completed";

interface ChapterRow {
  id: number;
  order: number;
  title: string;
  subtitle: string | null;
  cycle: "physical" | "emotional" | "intellectual" | "spiritual" | null;
  duration_minutes: number | null;
  description: string | null;
  icon_url: string | null;
  color_theme: string | null;
  content?: unknown;
  audio_url?: string | null;
  lore_metadata?: Record<string, unknown> | null;
  unlock_conditions?: Record<string, unknown> | null;
  created_at?: string;
}

interface ProgressRow {
  chapter_id: number;
  unlocked_at: string | null;
  completed_at: string | null;
  completion_percentage: number | null;
  time_spent_seconds: number | null;
  notes: string | null;
  updated_at: string | null;
}

export interface ChapterSummaryDTO {
  id: number;
  order: number;
  title: string;
  subtitle: string | null;
  cycle: "physical" | "emotional" | "intellectual" | "spiritual" | null;
  duration_minutes: number | null;
  description: string | null;
  icon_url: string | null;
  color_theme: string | null;
  unlock_status: UnlockStatus;
  progress: number;
  unlocked_at: string | null;
  completed_at: string | null;
}

export interface UserChapterContext {
  chapters: ChapterRow[];
  progressByChapterId: Map<number, ProgressRow>;
}

type MinimalSession = {
  user: {
    id: string;
    email?: string | null;
  };
};

export async function getSessionAndClient() {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!error && session) {
    return { supabase, session: session as MinimalSession };
  }

  // Fallback for token-based calls where cookie session is missing.
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    if (token) {
      const tokenClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: { autoRefreshToken: false, persistSession: false },
        }
      );

      const { data: userData, error: userError } = await tokenClient.auth.getUser(token);
      if (!userError && userData.user) {
        return {
          supabase,
          session: {
            user: {
              id: userData.user.id,
              email: userData.user.email,
            },
          } as MinimalSession,
        };
      }
    }
  }

  return { supabase, session: null as null };
}

export async function getUserChapterContext(userId: string): Promise<UserChapterContext> {
  const supabase = await createClient();
  const [{ data: chapters, error: chaptersError }, { data: progress, error: progressError }] =
    await Promise.all([
      supabase
        .from("chapters")
        .select("*")
        .order("order", { ascending: true }),
      supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId),
    ]);

  if (chaptersError) {
    throw new Error(`Failed to load chapters: ${chaptersError.message}`);
  }

  if (progressError) {
    throw new Error(`Failed to load progress: ${progressError.message}`);
  }

  const progressByChapterId = new Map<number, ProgressRow>();
  (progress ?? []).forEach((row) => progressByChapterId.set(row.chapter_id, row));

  return {
    chapters: (chapters ?? []) as ChapterRow[],
    progressByChapterId,
  };
}

export function toChapterSummary(
  chapter: ChapterRow,
  progress?: ProgressRow
): ChapterSummaryDTO {
  const completion = Math.max(0, Math.min(100, progress?.completion_percentage ?? 0));
  const completed = Boolean(progress?.completed_at) || completion >= 100;
  const inProgress = !completed && completion > 0;
  const unlockedByProgress = Boolean(progress?.unlocked_at) || inProgress || completed;
  const unlockedByDefault = chapter.order <= 2;
  const unlocked = unlockedByProgress || unlockedByDefault;

  const unlockStatus: UnlockStatus = completed
    ? "completed"
    : inProgress
      ? "in-progress"
      : unlocked
        ? "unlocked"
        : "locked";

  return {
    id: chapter.id,
    order: chapter.order,
    title: chapter.title,
    subtitle: chapter.subtitle,
    cycle: chapter.cycle,
    duration_minutes: chapter.duration_minutes,
    description: chapter.description,
    icon_url: chapter.icon_url,
    color_theme: chapter.color_theme,
    unlock_status: unlockStatus,
    progress: completion,
    unlocked_at: progress?.unlocked_at ?? (unlockedByDefault ? chapter.created_at ?? null : null),
    completed_at: progress?.completed_at ?? null,
  };
}
