import { NextRequest, NextResponse } from "next/server";
import { getSessionAndClient } from "../../chapters/_helpers";

interface ChapterProgressRow {
  id: string;
  chapter_id: number;
  unlocked_at: string | null;
  completed_at: string | null;
  completion_percentage: number | null;
  time_spent_seconds: number | null;
  updated_at: string | null;
}

interface ChapterRow {
  id: number;
  title: string;
  cycle: string | null;
}

interface AchievementRow {
  id: string;
  title: string | null;
  description: string | null;
  achievement_type: string | null;
  unlocked_at: string | null;
  icon_url: string | null;
}

interface StreakRow {
  streak_type: string;
  current_count: number | null;
  longest_count: number | null;
  updated_at: string | null;
}

export async function GET(req: NextRequest) {
  try {
    const { supabase, session } = await getSessionAndClient();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const limitParam = Number(req.nextUrl.searchParams.get("limit") || "10");
    const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(50, limitParam)) : 10;

    const { data: progressRows } = await supabase
      .from("user_progress")
      .select("id,chapter_id,unlocked_at,completed_at,completion_percentage,time_spent_seconds,updated_at")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false })
      .limit(limit);

    const chapterIds = ((progressRows as ChapterProgressRow[] | null) ?? []).map((row) => row.chapter_id);

    let chapterMap = new Map<number, ChapterRow>();
    if (chapterIds.length > 0) {
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id,title,cycle")
        .in("id", chapterIds);

      chapterMap = new Map(
        ((chapters as ChapterRow[] | null) ?? []).map((chapter) => [chapter.id, chapter])
      );
    }

    const { data: achievementRows } = await supabase
      .from("achievements")
      .select("id,title,description,achievement_type,unlocked_at,icon_url")
      .eq("user_id", session.user.id)
      .not("unlocked_at", "is", null)
      .order("unlocked_at", { ascending: false })
      .limit(limit);

    const { data: streakRows } = await supabase
      .from("streaks")
      .select("streak_type,current_count,longest_count,updated_at")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false })
      .limit(3);

    const progressActivities = ((progressRows as ChapterProgressRow[] | null) ?? []).map((row) => {
      const chapter = chapterMap.get(row.chapter_id);
      const completed = Boolean(row.completed_at) || Number(row.completion_percentage || 0) >= 100;
      return {
        type: completed ? "chapter_completed" : "chapter_unlocked",
        id: row.id,
        title: chapter?.title ?? `Chapter ${row.chapter_id}`,
        cycle: chapter?.cycle ?? null,
        chapterId: row.chapter_id,
        timestamp: row.updated_at ?? row.completed_at ?? row.unlocked_at,
        details: {
          completed,
          completionPercentage: row.completion_percentage,
          timeSpentSeconds: row.time_spent_seconds,
        },
      };
    });

    const achievementActivities = ((achievementRows as AchievementRow[] | null) ?? []).map((row) => ({
      type: "achievement_unlocked",
      id: row.id,
      title: row.title ?? "Achievement Unlocked",
      achievementType: row.achievement_type,
      timestamp: row.unlocked_at,
      details: {
        description: row.description,
        iconUrl: row.icon_url,
      },
    }));

    const streakActivities = ((streakRows as StreakRow[] | null) ?? [])
      .filter((row) => Number(row.current_count || 0) > 0)
      .map((row) => ({
        type: "streak_milestone",
        id: `${session.user.id}-${row.streak_type}`,
        streakType: row.streak_type,
        currentCount: row.current_count,
        timestamp: row.updated_at,
        details: {
          longestCount: row.longest_count,
        },
      }));

    const activities = [...progressActivities, ...achievementActivities, ...streakActivities]
      .filter((item) => Boolean(item.timestamp))
      .sort(
        (a, b) =>
          new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime()
      )
      .slice(0, limit);

    return NextResponse.json({
      activities,
      pagination: {
        limit,
        offset: 0,
        hasMore: false,
      },
    });
  } catch (error) {
    console.error("Progress recent route failed:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch recent activity";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
