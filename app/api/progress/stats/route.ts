import { NextResponse } from "next/server";
import { getSessionAndClient, getUserChapterContext, toChapterSummary } from "../../chapters/_helpers";

interface StreakRow {
  streak_type: string;
  current_count: number | null;
  longest_count: number | null;
}

export async function GET() {
  try {
    const { supabase, session } = await getSessionAndClient();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { chapters, progressByChapterId } = await getUserChapterContext(session.user.id);
    const summaries = chapters.map((chapter) =>
      toChapterSummary(chapter, progressByChapterId.get(chapter.id))
    );

    const totalChapters = summaries.length;
    const completedChapters = summaries.filter((chapter) => chapter.unlock_status === "completed").length;
    const unlockedChapters = summaries.filter((chapter) => chapter.unlock_status !== "locked").length;
    const completionPercentage =
      totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    const timeSpent = Array.from(progressByChapterId.values()).reduce(
      (sum, row) => sum + (row.time_spent_seconds ?? 0),
      0
    );

    const { data: streakRows } = await supabase
      .from("streaks")
      .select("streak_type,current_count,longest_count")
      .eq("user_id", session.user.id);

    const daily = ((streakRows as StreakRow[] | null) ?? []).find(
      (row) => row.streak_type === "daily"
    );

    const { count: achievementsUnlockedCount } = await supabase
      .from("achievements")
      .select("id", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .not("unlocked_at", "is", null);

    return NextResponse.json({
      stats: {
        totalChapters,
        completedChapters,
        unlockedChapters,
        completionPercentage,
        totalTimeSpent: {
          hours: Math.floor(timeSpent / 3600),
          minutes: Math.floor((timeSpent % 3600) / 60),
          totalSeconds: timeSpent,
        },
        currentStreak: Number(daily?.current_count || 0),
        longestStreak: Number(daily?.longest_count || 0),
        achievementsUnlocked: Number(achievementsUnlockedCount || 0),
      },
    });
  } catch (error) {
    console.error("Progress stats route failed:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch progress stats";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
