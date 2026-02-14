import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/admin/server-auth";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) {
    return auth.response;
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Supabase service role key is not configured" },
      { status: 500 }
    );
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { data: chapters, error } = await supabaseAdmin
      .from("chapters")
      .select("id, order, title, subtitle, cycle, duration_minutes, audio_url, content, created_at")
      .order("order", { ascending: true });

    if (error) {
      console.error("Admin chapters query error:", error);
      return NextResponse.json(
        { error: "Failed to load chapters" },
        { status: 500 }
      );
    }

    const allChapters = chapters ?? [];
    const chaptersWithAudio = allChapters.filter((chapter) => Boolean(chapter.audio_url)).length;
    const chaptersWithContent = allChapters.filter((chapter) => Boolean(chapter.content)).length;
    const durationValues = allChapters
      .map((chapter) => chapter.duration_minutes ?? 0)
      .filter((duration) => duration > 0);
    const averageDuration =
      durationValues.length > 0
        ? Math.round(
            durationValues.reduce((total, duration) => total + duration, 0) /
              durationValues.length
          )
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalChapters: allChapters.length,
          chaptersWithAudio,
          chaptersWithContent,
          averageDurationMinutes: averageDuration,
        },
        chapters: allChapters.map((chapter) => ({
          id: chapter.id,
          order: chapter.order,
          title: chapter.title,
          subtitle: chapter.subtitle,
          cycle: chapter.cycle,
          durationMinutes: chapter.duration_minutes,
          hasAudio: Boolean(chapter.audio_url),
          hasContent: Boolean(chapter.content),
          createdAt: chapter.created_at,
        })),
      },
    });
  } catch (error) {
    console.error("Admin chapters route failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
