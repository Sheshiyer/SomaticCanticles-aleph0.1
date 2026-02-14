import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/admin/server-auth";

function getSupabaseDashboardUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return "https://supabase.com/dashboard";
  }

  const match = supabaseUrl.match(/^https:\/\/([^.]+)\.supabase\.co/i);
  if (!match?.[1]) {
    return "https://supabase.com/dashboard";
  }

  return `https://supabase.com/dashboard/project/${match[1]}`;
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) {
    return auth.response;
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Supabase service role key is not configured" },
      { status: 500 }
    );
  }

  try {
    const supabaseAdmin = createAdminClient();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: totalUsers, error: totalUsersError },
      { count: totalChapters, error: totalChaptersError },
      { count: completedChapters, error: completedChaptersError },
      { count: recentSignups, error: recentSignupsError },
      { data: recentUsers, error: recentUsersError },
      { data: recentProgress, error: recentProgressError },
    ] = await Promise.all([
      supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("chapters").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("user_progress")
        .select("id", { count: "exact", head: true })
        .not("completed_at", "is", null),
      supabaseAdmin
        .from("users")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      supabaseAdmin
        .from("users")
        .select("id, email, role, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
      supabaseAdmin
        .from("user_progress")
        .select("user_id")
        .gte("updated_at", sevenDaysAgo),
    ]);

    if (
      totalUsersError ||
      totalChaptersError ||
      completedChaptersError ||
      recentSignupsError ||
      recentUsersError ||
      recentProgressError
    ) {
      console.error("Admin overview query error:", {
        totalUsersError,
        totalChaptersError,
        completedChaptersError,
        recentSignupsError,
        recentUsersError,
        recentProgressError,
      });
      return NextResponse.json(
        { error: "Failed to load admin overview" },
        { status: 500 }
      );
    }

    const activeUsers = new Set(
      (recentProgress ?? [])
        .map((entry) => entry.user_id)
        .filter((userId): userId is string => Boolean(userId))
    ).size;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers: totalUsers ?? 0,
          activeUsers,
          totalChapters: totalChapters ?? 0,
          completedChapters: completedChapters ?? 0,
          recentSignups: recentSignups ?? 0,
        },
        recentUsers: (recentUsers ?? []).map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        })),
        infrastructure: {
          supabase: {
            label: "Supabase Platform",
            href: getSupabaseDashboardUrl(),
            description: "Auth, Postgres, Storage, and Edge Functions",
          },
          cloudflare: {
            label: "Cloudflare DNS",
            href: "https://dash.cloudflare.com/?to=/:account/domains",
            description: "DNS and domain routing only (no Workers/D1/R2)",
          },
          github: {
            label: "GitHub Repository",
            href: "https://github.com/Sheshiyer/SomaticCanticles-aleph0.1",
            description: "Source code and deployment history",
          },
        },
      },
    });
  } catch (error) {
    console.error("Admin overview route failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
