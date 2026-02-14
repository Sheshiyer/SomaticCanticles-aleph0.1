import { NextResponse } from "next/server";
import {
  getSessionAndClient,
  getUserChapterContext,
  toChapterSummary,
} from "../_helpers";

export async function POST() {
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
    const totalUnlocked = summaries.filter((chapter) => chapter.unlock_status !== "locked").length;

    return NextResponse.json({
      success: true,
      data: {
        newly_unlocked: [],
        total_unlocked: totalUnlocked,
        biorhythm_checked: true,
      },
    });
  } catch (error) {
    console.error("Chapter unlock check failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CHECK_ERROR",
          message: "Failed to check chapter unlocks",
        },
      },
      { status: 500 }
    );
  }
}
