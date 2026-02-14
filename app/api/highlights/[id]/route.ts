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
    const highlightId = resolved.id;
    if (!highlightId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_HIGHLIGHT_ID", message: "Invalid highlight id" },
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("highlights")
      .delete()
      .eq("id", highlightId)
      .eq("user_id", session.user.id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Highlights DELETE failed:", error);
    const message = error instanceof Error ? error.message : "Failed to delete highlight";
    return NextResponse.json(
      { success: false, error: { code: "DELETE_ERROR", message } },
      { status: 500 }
    );
  }
}
