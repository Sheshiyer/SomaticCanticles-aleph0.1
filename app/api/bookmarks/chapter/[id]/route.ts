import { NextResponse } from "next/server";
import { getSessionAndClient } from "../../../chapters/_helpers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { supabase, session } = await getSessionAndClient();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "AUTH_REQUIRED", message: "Authentication required" },
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
          error: { code: "INVALID_CHAPTER_ID", message: "Invalid chapter id" },
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .select("id,chapter_id,scene_index,created_at")
      .eq("user_id", session.user.id)
      .eq("chapter_id", chapterId)
      .order("created_at", { ascending: false });

    if (error) {
      // If bookmarks table is unavailable, return a safe empty state.
      if (error.message.toLowerCase().includes("does not exist")) {
        return NextResponse.json({ success: true, data: [] });
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error) {
    console.error("Bookmarks GET failed:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch bookmarks";
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message } },
      { status: 500 }
    );
  }
}
