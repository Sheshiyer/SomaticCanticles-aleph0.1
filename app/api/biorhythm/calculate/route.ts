import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  calculateBiorhythm,
  getDaysBetween,
  isValidTimezone,
} from "@/server/lib/biorhythm/calculator";

const calculateSchema = z.object({
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  timezone: z.string().optional(),
});

async function resolveBirthdate(
  providedBirthdate?: string,
  authHeader?: string | null
): Promise<string | null> {
  if (providedBirthdate) {
    return providedBirthdate;
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Fallback: bearer token auth.
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice("Bearer ".length).trim();
      if (token) {
        const tokenClient = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            auth: { autoRefreshToken: false, persistSession: false },
          }
        );
        const { data: tokenUser } = await tokenClient.auth.getUser(token);
        const userId = tokenUser.user?.id;
        const metadataBirthdate =
          typeof tokenUser.user?.user_metadata?.birthdate === "string"
            ? tokenUser.user.user_metadata.birthdate
            : null;
        if (userId) {
          const { data } = await tokenClient
            .from("users")
            .select("birthdate")
            .eq("id", userId)
            .single();
          return data?.birthdate ?? metadataBirthdate;
        }
      }
    }
    return null;
  }

  const metadataBirthdate =
    typeof session.user.user_metadata?.birthdate === "string"
      ? session.user.user_metadata.birthdate
      : null;

  const { data } = await supabase
    .from("users")
    .select("birthdate")
    .eq("id", session.user.id)
    .single();

  return data?.birthdate ?? metadataBirthdate;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = calculateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BIORHYTHM_INVALID_BIRTHDATE",
            message: "Invalid request payload",
          },
        },
        { status: 400 }
      );
    }

    const timezone = parsed.data.timezone || "UTC";
    if (!isValidTimezone(timezone)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BIORHYTHM_CALCULATION_ERROR",
            message: "Invalid timezone",
          },
        },
        { status: 400 }
      );
    }

    const birthdate = await resolveBirthdate(
      parsed.data.birthdate,
      req.headers.get("authorization")
    );
    if (!birthdate) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BIORHYTHM_INVALID_BIRTHDATE",
            message: "Birthdate is required",
          },
        },
        { status: 400 }
      );
    }

    const targetDate = parsed.data.targetDate || new Date().toISOString().split("T")[0];
    const result = calculateBiorhythm(birthdate, targetDate, timezone);
    const days = getDaysBetween(birthdate, targetDate, timezone);

    return NextResponse.json({
      success: true,
      data: {
        date: result.date,
        physical: { date: result.date, value: result.physical, days },
        emotional: { date: result.date, value: result.emotional, days },
        intellectual: { date: result.date, value: result.intellectual, days },
        spiritual: { date: result.date, value: result.spiritual, days },
      },
    });
  } catch (error) {
    console.error("Biorhythm calculate route failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BIORHYTHM_INTERNAL_ERROR",
          message: "Failed to calculate biorhythm",
        },
      },
      { status: 500 }
    );
  }
}
