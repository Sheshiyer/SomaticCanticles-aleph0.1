import { NextRequest, NextResponse } from "next/server";
import {
  getSessionAndClient,
  getUserChapterContext,
  toChapterSummary,
} from "../_helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolved = await params;
    const chapterId = Number(resolved.id);
    if (!Number.isFinite(chapterId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CHAPTER_ID",
            message: "Invalid chapter id",
          },
        },
        { status: 400 }
      );
    }

    const { chapters, progressByChapterId } = await getUserChapterContext(session.user.id);
    const chapter =
      chapters.find((item) => item.id === chapterId) ??
      chapters.find((item) => item.order === chapterId);

    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Chapter not found",
          },
        },
        { status: 404 }
      );
    }

    const progress = progressByChapterId.get(chapter.id);
    const summary = toChapterSummary(chapter, progress);
    if (summary.unlock_status === "locked") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CHAPTER_LOCKED",
            message: "This chapter is locked",
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...summary,
        content: chapter.content ?? null,
        audio_url: chapter.audio_url ?? null,
        lore_metadata: chapter.lore_metadata ?? null,
        unlock_conditions: chapter.unlock_conditions ?? null,
      },
    });
  } catch (error) {
    console.error("Chapter detail route failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch chapter details";
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
