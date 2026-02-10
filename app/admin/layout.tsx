// Admin Layout - Protected layout for admin users only
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <Users className="h-4 w-4" />,
  },
  {
    label: "Chapters",
    href: "/admin/chapters",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

function SidebarNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/60 hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is admin
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed.role !== "admin") {
            // Not an admin, redirect to dashboard
            router.push("/dashboard");
            return;
          }
          setUser(parsed);
        } catch {
          router.push("/auth/login");
        }
      } else {
        router.push("/auth/login");
      }
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_tokens");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </nav>
          </div>
          
          <div className="border-t p-4">
            <div className="mb-4 px-3">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-6">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <Link href="/">
              <Button variant="ghost" size="sm">
                Back to Site
              </Button>
            </Link>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="container mx-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
