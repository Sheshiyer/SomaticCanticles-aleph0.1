import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionAndClient } from "../_helpers";

const updateProgressSchema = z.object({
  chapter_id: z.number().int().positive(),
  completion_percentage: z.number().min(0).max(100).optional(),
  time_spent_seconds: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  mark_complete: z.boolean().optional(),
});

export async function GET() {
  try {
    const { supabase, session } = await getSessionAndClient();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AUTH_REQUIRED",
            message: "Authentication required",
          },
        },
        { status: 401 }
      );
    }

    const { data: progressRows, error: progressError } = await supabase
      .from("user_progress")
      .select(
        "chapter_id, completion_percentage, time_spent_seconds, notes, unlocked_at, completed_at, updated_at"
      )
      .eq("user_id", session.user.id);

    if (progressError) {
      throw new Error(progressError.message);
    }

    const chapterIds = (progressRows ?? []).map((row) => row.chapter_id);
    let chapterMap = new Map<number, { title: string; order: number }>();

    if (chapterIds.length > 0) {
      const { data: chapterRows, error: chapterError } = await supabase
        .from("chapters")
        .select("id, title, order")
        .in("id", chapterIds);

      if (chapterError) {
        throw new Error(chapterError.message);
      }

      chapterMap = new Map(
        (chapterRows ?? []).map((chapter) => [
          chapter.id,
          { title: chapter.title, order: chapter.order },
        ])
      );
    }

    const progress = (progressRows ?? []).map((row) => ({
      chapter_id: row.chapter_id,
      chapter_title: chapterMap.get(row.chapter_id)?.title ?? null,
      chapter_order: chapterMap.get(row.chapter_id)?.order ?? null,
      completion_percentage: row.completion_percentage,
      time_spent_seconds: row.time_spent_seconds,
      notes: row.notes,
      unlocked_at: row.unlocked_at,
      completed_at: row.completed_at,
      updated_at: row.updated_at,
    }));

    const completed = progress.filter((row) => (row.completion_percentage ?? 0) >= 100).length;
    const inProgress = progress.filter((row) => {
      const completion = row.completion_percentage ?? 0;
      return completion > 0 && completion < 100;
    }).length;
    const totalTimeSpent = progress.reduce(
      (sum, row) => sum + (row.time_spent_seconds ?? 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        progress,
        total_chapters: progress.length,
        completed,
        in_progress: inProgress,
        total_time_spent: totalTimeSpent,
      },
    });
  } catch (error) {
    console.error("Chapter progress GET failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch progress";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { supabase, session } = await getSessionAndClient();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AUTH_REQUIRED",
            message: "Authentication required",
          },
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = updateProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid progress payload",
          },
        },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const nowIso = new Date().toISOString();

    const { data: existing } = await supabase
      .from("user_progress")
      .select("completion_percentage, time_spent_seconds, unlocked_at")
      .eq("user_id", session.user.id)
      .eq("chapter_id", payload.chapter_id)
      .single();

    const existingCompletion = existing?.completion_percentage ?? 0;
    const existingTime = existing?.time_spent_seconds ?? 0;
    const completionPercentage = payload.mark_complete
      ? 100
      : payload.completion_percentage ?? existingCompletion;
    const totalTime = existingTime + (payload.time_spent_seconds ?? 0);

    const upsertData = {
      user_id: session.user.id,
      chapter_id: payload.chapter_id,
      completion_percentage: completionPercentage,
      time_spent_seconds: totalTime,
      notes: payload.notes,
      unlocked_at: existing?.unlocked_at ?? nowIso,
      completed_at: payload.mark_complete
        ? nowIso
        : completionPercentage >= 100
          ? nowIso
          : null,
      updated_at: nowIso,
    };

    const { error } = await supabase
      .from("user_progress")
      .upsert(upsertData, { onConflict: "user_id,chapter_id" });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        chapter_id: payload.chapter_id,
        completion_percentage: completionPercentage,
        completed: completionPercentage >= 100,
        message: payload.mark_complete
          ? "Chapter marked complete"
          : "Progress updated",
      },
    });
  } catch (error) {
    console.error("Chapter progress POST failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update progress";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPDATE_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
