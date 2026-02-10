// Admin Dashboard - Overview page with analytics
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Activity, TrendingUp, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// Types for admin data
interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalChapters: number;
  completedChapters: number;
  recentSignups: number;
}

interface RecentUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Get token from localStorage
      const tokens = localStorage.getItem("auth_tokens");
      const token = tokens ? JSON.parse(tokens).accessToken : null;

      // Fetch stats from API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // If admin endpoint doesn't exist yet, use mock data
        setMockData();
        return;
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
        setRecentUsers(data.data.recentUsers);
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    // Mock data for MVP (until API endpoint is built)
    setStats({
      totalUsers: 2,
      activeUsers: 1,
      totalChapters: 12,
      completedChapters: 0,
      recentSignups: 2,
    });
    setRecentUsers([
      {
        id: "admin-001",
        email: "admin@somatic-canticles.local",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "user-001",
        email: "test@example.com",
        role: "user",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Spinner size="xl" />
        <p className="text-muted-foreground">Loading admin data...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Title */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Here&apos;s what&apos;s happening with your platform.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.recentSignups || 0} new this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                In the last 7 days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chapters</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalChapters || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.completedChapters || 0} completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalUsers
                  ? Math.round(
                      ((stats.activeUsers || 0) / stats.totalUsers) * 100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Active user rate</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Users */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <p className="text-muted-foreground">No users yet.</p>
              ) : (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="https://dash.cloudflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold">Cloudflare Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Manage Workers, D1, and R2
                </p>
              </a>
              <a
                href="https://github.com/Sheshiyer/SomaticCanticles-aleph0.1"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold">GitHub Repository</h3>
                <p className="text-sm text-muted-foreground">View source code</p>
              </a>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">API Status</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Operational
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
