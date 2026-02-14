"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, User, UserPlus, Users } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { DataDisplay, HudPanel, TechFrame } from "@/components/ui/frame";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersPayload {
  stats: {
    totalUsers: number;
    adminUsers: number;
    memberUsers: number;
    recentSignups: number;
  };
  users: AdminUser[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<UsersPayload>({
    stats: {
      totalUsers: 0,
      adminUsers: 0,
      memberUsers: 0,
      recentSignups: 0,
    },
    users: [],
  });

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/users");
        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.error || "Failed to load users");
        }

        if (mounted) {
          setPayload(data.data);
          setError(null);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load users";
        if (mounted) {
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4">
        <Spinner size="xl" />
        <p className="text-muted-foreground">Loading user directory...</p>
      </div>
    );
  }

  return (
    <TechFrame variant="tech" className="scan-lines min-h-[calc(100vh-8rem)]">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Users className="h-7 w-7 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold text-metallic">User Directory</h1>
            <p className="text-sm text-muted-foreground">
              Supabase-authenticated users and access roles
            </p>
          </div>
        </motion.div>

        {error && (
          <motion.p variants={itemVariants} className="text-sm text-rose-400">
            {error}
          </motion.p>
        )}

        <motion.div variants={containerVariants} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <motion.div variants={itemVariants}>
            <DataDisplay
              label="Total Users"
              value={payload.stats.totalUsers}
              icon={<Users className="h-3 w-3" />}
              variant="tech"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DataDisplay
              label="Admin Users"
              value={payload.stats.adminUsers}
              icon={<Shield className="h-3 w-3" />}
              variant="warning"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DataDisplay
              label="Member Users"
              value={payload.stats.memberUsers}
              icon={<User className="h-3 w-3" />}
              variant="default"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DataDisplay
              label="New (7d)"
              value={payload.stats.recentSignups}
              icon={<UserPlus className="h-3 w-3" />}
              variant="success"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HudPanel title="Users" icon={<Users className="h-4 w-4" />} variant="tech">
            {payload.users.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No users found.
              </p>
            ) : (
              <div className="space-y-3">
                {payload.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 rounded-lg border border-metal-700 bg-metal-900/40 p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium text-metallic">{user.email}</p>
                      <p className="text-xs text-metal-500">ID: {user.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-mono",
                          user.role === "admin"
                            ? "border-rose-500/40 bg-rose-500/20 text-rose-300"
                            : "border-cyan-500/40 bg-cyan-500/20 text-cyan-300"
                        )}
                      >
                        {user.role.toUpperCase()}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </HudPanel>
        </motion.div>
      </motion.div>
    </TechFrame>
  );
}
