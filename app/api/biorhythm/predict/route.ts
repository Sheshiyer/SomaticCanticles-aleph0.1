import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { calculateAllCycles, isValidTimezone } from "@/server/lib/biorhythm/calculator";

type CycleKey = "physical" | "emotional" | "intellectual" | "spiritual";

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

function buildDateIndex(
  values: Array<{ date: string; peaks: string[]; criticalDays: string[] }>
) {
  const cycles: CycleKey[] = ["physical", "emotional", "intellectual", "spiritual"];
  const peaks: Record<CycleKey, string[]> = {
    physical: [],
    emotional: [],
    intellectual: [],
    spiritual: [],
  };
  const criticalDays: Record<CycleKey, string[]> = {
    physical: [],
    emotional: [],
    intellectual: [],
    spiritual: [],
  };

  values.forEach((day) => {
    cycles.forEach((cycle) => {
      if (day.peaks.includes(cycle)) {
        peaks[cycle].push(day.date);
      }
      if (day.criticalDays.includes(cycle)) {
        criticalDays[cycle].push(day.date);
      }
    });
  });

  return { peaks, criticalDays };
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const startDate = params.get("startDate") || new Date().toISOString().split("T")[0];
    const birthdateParam = params.get("birthdate") || undefined;
    const timezone = params.get("timezone") || "UTC";
    const daysParam = params.get("days");
    const days = daysParam ? Number(daysParam) : 30;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate || "")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BIORHYTHM_INVALID_DATE_RANGE",
            message: "Invalid startDate format",
          },
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(days) || days < 1 || days > 90) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BIORHYTHM_INVALID_DATE_RANGE",
            message: "days must be between 1 and 90",
          },
        },
        { status: 400 }
      );
    }

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
      birthdateParam,
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

    const predictions = calculateAllCycles(birthdate, startDate, days, timezone);
    const projected = predictions.map((day) => ({
      date: day.date,
      physical: day.physical,
      emotional: day.emotional,
      intellectual: day.intellectual,
      spiritual: day.spiritual,
      peaks: day.peaks,
      criticalDays: day.criticalDays,
    }));

    const { peaks, criticalDays } = buildDateIndex(projected);
    const endDate = projected[projected.length - 1]?.date ?? startDate;

    return NextResponse.json({
      success: true,
      data: {
        startDate,
        endDate,
        predictions: projected.map((day) => ({
          date: day.date,
          physical: day.physical,
          emotional: day.emotional,
          intellectual: day.intellectual,
          spiritual: day.spiritual,
        })),
        peaks,
        criticalDays,
      },
    });
  } catch (error) {
    console.error("Biorhythm predict route failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BIORHYTHM_INTERNAL_ERROR",
          message: "Failed to generate prediction",
        },
      },
      { status: 500 }
    );
  }
}
