import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSession } from "@/lib/auth/server-session";

const updateProfileSchema = z.object({
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  timezone: z.string().min(1).optional(),
});

function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireSession();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid profile payload" } },
        { status: 400 }
      );
    }

    const timezone = parsed.data.timezone;
    if (timezone && !isValidTimezone(timezone)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid timezone" } },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const birthdate =
      parsed.data.birthdate === undefined ? null : parsed.data.birthdate;
    const resolvedTimezone =
      timezone ??
      (typeof user.user_metadata?.timezone === "string"
        ? user.user_metadata.timezone
        : "UTC");

    const admin = createAdminClient();

    // Merge auth metadata so dashboard fallbacks always have latest values.
    const mergedMetadata = {
      ...(user.user_metadata || {}),
      birthdate,
      timezone: resolvedTimezone,
    };

    const { error: authUpdateError } = await admin.auth.admin.updateUserById(
      auth.userId,
      { user_metadata: mergedMetadata }
    );
    if (authUpdateError) {
      throw authUpdateError;
    }

    const { data: currentProfile } = await admin
      .from("users")
      .select("role")
      .eq("id", auth.userId)
      .maybeSingle();

    const { error: upsertError } = await admin.from("users").upsert(
      {
        id: auth.userId,
        email: auth.email || user.email || "",
        role: currentProfile?.role || "user",
        birthdate,
        timezone: resolvedTimezone,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      throw upsertError;
    }

    return NextResponse.json({
      success: true,
      data: {
        birthdate,
        timezone: resolvedTimezone,
      },
    });
  } catch (error) {
    console.error("Profile update route failed:", error);
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}
