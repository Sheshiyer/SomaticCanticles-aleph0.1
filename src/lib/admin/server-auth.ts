import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AdminAuthFailure = {
  ok: false;
  response: NextResponse;
};

type AdminAuthSuccess = {
  ok: true;
  userId: string;
  email: string | null;
};

export type AdminAuthResult = AdminAuthFailure | AdminAuthSuccess;

export async function requireAdminSession(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    const role = userData?.role || user.user_metadata?.role;
    if (role !== "admin") {
      return {
        ok: false,
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    return {
      ok: true,
      userId: user.id,
      email: user.email ?? null,
    };
  } catch (error) {
    console.error("Admin auth guard failed:", error);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      ),
    };
  }
}
