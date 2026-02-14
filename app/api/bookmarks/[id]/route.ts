import { NextResponse } from "next/server";
import { getSessionAndClient } from "../../chapters/_helpers";

export async function DELETE(
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
    const bookmarkId = resolved.id;
    if (!bookmarkId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_BOOKMARK_ID", message: "Invalid bookmark id" },
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId)
      .eq("user_id", session.user.id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bookmarks DELETE failed:", error);
    const message = error instanceof Error ? error.message : "Failed to delete bookmark";
    return NextResponse.json(
      { success: false, error: { code: "DELETE_ERROR", message } },
      { status: 500 }
    );
  }
}
