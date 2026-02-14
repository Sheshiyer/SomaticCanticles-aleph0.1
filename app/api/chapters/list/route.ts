import { NextResponse } from "next/server";
import {
  getSessionAndClient,
  getUserChapterContext,
  toChapterSummary,
} from "../_helpers";

export async function GET() {
  try {
    const { session } = await getSessionAndClient();
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

    const { chapters, progressByChapterId } = await getUserChapterContext(session.user.id);
    const summaries = chapters.map((chapter) =>
      toChapterSummary(chapter, progressByChapterId.get(chapter.id))
    );
    const unlocked = summaries.filter((chapter) => chapter.unlock_status !== "locked").length;
    const completed = summaries.filter((chapter) => chapter.unlock_status === "completed").length;

    return NextResponse.json({
      success: true,
      data: {
        chapters: summaries,
        total: summaries.length,
        unlocked,
        completed,
      },
    });
  } catch (error) {
    console.error("Chapters list route failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch chapters",
        },
      },
      { status: 500 }
    );
  }
}
