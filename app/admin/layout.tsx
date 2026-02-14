// Admin Layout - Protected layout for admin users only
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Shield,
  Loader2,
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

function SidebarNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive =
    item.href === "/admin"
      ? pathname === "/admin" || pathname === "/admin/"
      : pathname.startsWith(item.href);

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
  const supabase = createClient();
  const activeNavItem = adminNavItems.find((item) =>
    item.href === "/admin"
      ? pathname === "/admin" || pathname === "/admin/"
      : pathname.startsWith(item.href)
  );
  const pageTitle =
    activeNavItem?.label && activeNavItem.label !== "Overview"
      ? `Admin ${activeNavItem.label}`
      : "Admin Dashboard";

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          router.push("/auth/login");
          return;
        }

        // Fetch user role from public.users table
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const role = userData?.role || session.user.user_metadata?.role;

        if (role !== "admin") {
          // Not an admin, redirect to dashboard
          router.push("/dashboard");
          return;
        }

        setUser({
          email: session.user.email || "",
          role: role
        });

      } catch (error) {
        console.error("Admin check failed:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("auth_tokens");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Verifying admin access...</p>
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
                  pathname={pathname}
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
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
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
