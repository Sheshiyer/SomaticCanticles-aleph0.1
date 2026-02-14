// Admin Dashboard - Overview page with analytics
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Activity, TrendingUp, UserCheck, Shield, Server, GitBranch } from "lucide-react";
import { TechFrame, HudPanel, DataDisplay } from "@/components/ui/frame";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

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

  // Calculate engagement rate
  const engagementRate = stats?.totalUsers
    ? Math.round(((stats.activeUsers || 0) / stats.totalUsers) * 100)
    : 0;

  return (
    <TechFrame variant="alert" className="scan-lines min-h-[calc(100vh-8rem)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Page Title */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-rose-500" />
          <div>
            <h1 className="text-3xl font-bold text-metallic">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              System monitoring and user management console
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400 font-mono">SYSTEM ONLINE</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <DataDisplay
              label="Total Users"
              value={stats?.totalUsers || 0}
              trend="up"
              trendValue={`${stats?.recentSignups || 0} new this week`}
              icon={<Users className="h-3 w-3" />}
              variant="tech"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DataDisplay
              label="Active Users"
              value={stats?.activeUsers || 0}
              trendValue="In the last 7 days"
              icon={<UserCheck className="h-3 w-3" />}
              variant="success"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DataDisplay
              label="Chapters"
              value={stats?.totalChapters || 0}
              trendValue={`${stats?.completedChapters || 0} completed`}
              icon={<BookOpen className="h-3 w-3" />}
              variant="default"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DataDisplay
              label="Engagement"
              value={engagementRate}
              unit="%"
              trendValue="Active user rate"
              icon={<TrendingUp className="h-3 w-3" />}
              variant="warning"
            />
          </motion.div>
        </motion.div>

        {/* User Management Section */}
        <motion.div variants={itemVariants}>
          <HudPanel 
            title="User Management" 
            icon={<Users className="h-4 w-4" />} 
            variant="alert"
            className="scan-lines"
          >
            <TechFrame variant="tech" size="sm">
              <div className="space-y-4">
                {recentUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No users found in system.</p>
                ) : (
                  <div className="divide-y divide-metal-800">
                    {recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-metal-800 border border-metal-700">
                            <Activity className="h-5 w-5 text-cyan-500" />
                          </div>
                          <div>
                            <p className="font-medium text-metallic">{user.email}</p>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full font-mono",
                                user.role === "admin" 
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                              )}>
                                {user.role.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground font-mono">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-metal-500">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TechFrame>
          </HudPanel>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <HudPanel 
            title="System Controls" 
            icon={<Server className="h-4 w-4" />} 
            variant="tech"
            className="scan-lines"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="https://dash.cloudflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-lg border border-metal-700 bg-metal-900/40 p-4 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <h3 className="font-semibold text-metallic group-hover:text-cyan-400 transition-colors">Cloudflare Dashboard</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage Workers, D1, and R2
                </p>
              </a>
              <a
                href="https://github.com/Sheshiyer/SomaticCanticles-aleph0.1"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-lg border border-metal-700 bg-metal-900/40 p-4 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="h-4 w-4 text-metal-400 group-hover:text-cyan-400 transition-colors" />
                  <h3 className="font-semibold text-metallic group-hover:text-cyan-400 transition-colors">GitHub Repository</h3>
                </div>
                <p className="text-sm text-muted-foreground">View source code</p>
              </a>
              <div className="rounded-lg border border-metal-700 bg-metal-900/40 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-metallic">API Status</h3>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="text-emerald-400 font-mono">OPERATIONAL</span>
                </p>
              </div>
            </div>
          </HudPanel>
        </motion.div>
      </motion.div>
    </TechFrame>
  );
}
