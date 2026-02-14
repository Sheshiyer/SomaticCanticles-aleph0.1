import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/admin/server-auth";

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
      { data: users, error: usersError },
      { count: totalUsers, error: totalUsersError },
      { count: adminUsers, error: adminUsersError },
      { count: recentSignups, error: recentSignupsError },
    ] = await Promise.all([
      supabaseAdmin
        .from("users")
        .select("id, email, role, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin"),
      supabaseAdmin
        .from("users")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
    ]);

    if (usersError || totalUsersError || adminUsersError || recentSignupsError) {
      console.error("Admin users query error:", {
        usersError,
        totalUsersError,
        adminUsersError,
        recentSignupsError,
      });
      return NextResponse.json(
        { error: "Failed to load users" },
        { status: 500 }
      );
    }

    const total = totalUsers ?? 0;
    const admins = adminUsers ?? 0;
    const members = Math.max(total - admins, 0);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers: total,
          adminUsers: admins,
          memberUsers: members,
          recentSignups: recentSignups ?? 0,
        },
        users: (users ?? []).map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        })),
      },
    });
  } catch (error) {
    console.error("Admin users route failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
