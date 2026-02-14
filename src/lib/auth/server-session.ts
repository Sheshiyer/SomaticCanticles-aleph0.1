import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type SessionFailure = {
  ok: false;
  response: NextResponse;
};

type SessionSuccess = {
  ok: true;
  userId: string;
  email: string | null;
};

export type SessionResult = SessionFailure | SessionSuccess;

export async function requireSession(): Promise<SessionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    return {
      ok: true,
      userId: session.user.id,
      email: session.user.email ?? null,
    };
  } catch (sessionError) {
    console.error("Session guard failed:", sessionError);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      ),
    };
  }
}

export async function getSessionUserId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user.id ?? null;
  } catch {
    return null;
  }
}
