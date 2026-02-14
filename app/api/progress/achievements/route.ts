import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AchievementType =
  | "first_chapter"
  | "chapter_master"
  | "seven_day_streak"
  | "forty_four_day_streak"
  | "morning_person"
  | "night_owl"
  | "cycle_master"
  | "completionist";

type Rarity = "common" | "rare" | "epic" | "legendary";

interface AchievementDefinition {
  type: AchievementType;
  title: string;
  description: string;
  iconName: string;
  rarity: Rarity;
}

const DEFINITIONS: AchievementDefinition[] = [
  {
    type: "first_chapter",
    title: "First Chapter",
    description: "Complete your first chapter",
    iconName: "BookOpen",
    rarity: "common",
  },
  {
    type: "chapter_master",
    title: "Chapter Master",
    description: "Complete all available chapters",
    iconName: "Crown",
    rarity: "legendary",
  },
  {
    type: "seven_day_streak",
    title: "7-Day Streak",
    description: "Maintain a daily practice streak for 7 days",
    iconName: "Flame",
    rarity: "common",
  },
  {
    type: "forty_four_day_streak",
    title: "44-Day Streak",
    description: "Maintain a daily practice streak for 44 days",
    iconName: "Star",
    rarity: "epic",
  },
  {
    type: "morning_person",
    title: "Morning Person",
    description: "Complete a chapter between 5 AM and 9 AM",
    iconName: "Sunrise",
    rarity: "rare",
  },
  {
    type: "night_owl",
    title: "Night Owl",
    description: "Complete a chapter between 10 PM and 2 AM",
    iconName: "Moon",
    rarity: "rare",
  },
  {
    type: "cycle_master",
    title: "Cycle Master",
    description: "Complete at least one chapter during each biorhythm peak",
    iconName: "Activity",
    rarity: "epic",
  },
  {
    type: "completionist",
    title: "Completionist",
    description: "Unlock all other achievements",
    iconName: "Award",
    rarity: "legendary",
  },
];

interface AchievementRow {
  id: string;
  achievement_type: AchievementType;
  title: string | null;
  description: string | null;
  unlocked_at: string | null;
  icon_url: string | null;
}

interface StreakRow {
  streak_type: string;
  current_count: number | null;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const [{ count: totalChaptersCount }, { count: completedChaptersCount }] = await Promise.all([
      supabase.from("chapters").select("id", { count: "exact", head: true }),
      supabase
        .from("user_progress")
        .select("chapter_id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .not("completed_at", "is", null),
    ]);

    const { data: streakRows } = await supabase
      .from("streaks")
      .select("streak_type,current_count")
      .eq("user_id", user.id);

    const dailyStreak =
      ((streakRows as StreakRow[] | null) ?? []).find((row) => row.streak_type === "daily")
        ?.current_count ?? 0;

    const { data: achievementRows, error: achievementsError } = await supabase
      .from("achievements")
      .select("id,achievement_type,title,description,unlocked_at,icon_url")
      .eq("user_id", user.id);

    // If the table does not exist yet in this environment, return definitions with zero progress.
    const rows = achievementsError
      ? []
      : (((achievementRows as AchievementRow[] | null) ?? []).filter(Boolean) as AchievementRow[]);

    const rowByType = new Map<AchievementType, AchievementRow>();
    rows.forEach((row) => rowByType.set(row.achievement_type, row));

    const totalChapters = Number(totalChaptersCount || 0);
    const completedChapters = Number(completedChaptersCount || 0);

    const achievements = DEFINITIONS.map((definition) => {
      const row = rowByType.get(definition.type);
      let target = 1;
      let current = row?.unlocked_at ? 1 : 0;

      switch (definition.type) {
        case "first_chapter":
          target = 1;
          current = Math.min(completedChapters, 1);
          break;
        case "chapter_master":
          target = Math.max(totalChapters, 1);
          current = completedChapters;
          break;
        case "seven_day_streak":
          target = 7;
          current = Number(dailyStreak || 0);
          break;
        case "forty_four_day_streak":
          target = 44;
          current = Number(dailyStreak || 0);
          break;
        default:
          target = 1;
          current = row?.unlocked_at ? 1 : 0;
      }

      const percentage = target > 0 ? Math.max(0, Math.min(100, Math.round((current / target) * 100))) : 0;

      return {
        id: row?.id ?? `ach-${user.id}-${definition.type}`,
        achievementType: definition.type,
        title: row?.title ?? definition.title,
        description: row?.description ?? definition.description,
        unlockedAt: row?.unlocked_at ?? null,
        iconUrl: row?.icon_url ?? null,
        definition: {
          iconName: definition.iconName,
          rarity: definition.rarity,
        },
        progress: {
          current,
          target,
          percentage,
        },
      };
    });

    const unlocked = achievements.filter((item) => item.unlockedAt).length;
    const total = achievements.length;

    return NextResponse.json({
      success: true,
      achievements,
      summary: {
        total,
        unlocked,
        locked: total - unlocked,
        completionPercentage: total > 0 ? Math.round((unlocked / total) * 100) : 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch achievements";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
