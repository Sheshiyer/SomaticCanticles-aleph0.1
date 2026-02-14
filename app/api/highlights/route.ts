import { NextRequest, NextResponse } from "next/server";
import { getSessionAndClient } from "../chapters/_helpers";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const chapterId = Number(body?.chapter_id);
    const sceneIndex = Number(body?.scene_index);
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const color = typeof body?.color === "string" ? body.color : "primary";

    if (!Number.isFinite(chapterId) || !Number.isFinite(sceneIndex) || !text) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_REQUEST", message: "chapter_id, scene_index, and text are required" },
        },
        { status: 400 }
      );
    }

    const payload = {
      id: `highlight_${crypto.randomUUID()}`,
      user_id: session.user.id,
      chapter_id: chapterId,
      scene_index: sceneIndex,
      text,
      color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("highlights")
      .insert(payload)
      .select("id,chapter_id,scene_index,text,color,created_at")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Highlights POST failed:", error);
    const message = error instanceof Error ? error.message : "Failed to save highlight";
    return NextResponse.json(
      { success: false, error: { code: "SAVE_ERROR", message } },
      { status: 500 }
    );
  }
}
