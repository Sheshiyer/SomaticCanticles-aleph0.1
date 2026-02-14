"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Activity,
  Calendar,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  BookOpen,
  Shield,
  Loader2,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const dashboardNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Chapters",
    href: "/chapters",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    label: "Progress",
    href: "/dashboard/progress",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    label: "Achievements",
    href: "/dashboard/achievements",
    icon: <Calendar className="h-4 w-4" />,
  },
];

const settingsNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

// Admin nav item (shown only for admins)
const adminNavItem: NavItem = {
  label: "Admin",
  href: "/admin",
  icon: <Shield className="h-4 w-4" />,
};

// Sidebar Nav Item Component
function SidebarNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  // Check if this nav item is active (exact match or starts with for nested routes)
  const isActive = item.href === "/dashboard"
    ? pathname === "/dashboard" || pathname === "/dashboard/"
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/60 hover:bg-accent hover:text-accent-foreground",
        item.disabled && "pointer-events-none opacity-50"
      )}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

// Mobile Sidebar Sheet
function MobileSidebar({
  open,
  onClose,
  userEmail,
  onLogout,
  isAdmin,
}: {
  open: boolean;
  onClose: () => void;
  userEmail: string | null;
  onLogout: () => void;
  isAdmin: boolean;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-[280px] bg-background lg:hidden">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <span className="font-bold text-lg">Somatic Canticles</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="mb-6">
              <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Overview
              </h4>
              <nav className="space-y-1">
                {dashboardNavItems.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </nav>
            </div>

            <div className="mb-6">
              <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </h4>
              <nav className="space-y-1">
                {settingsNavItems.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </nav>
            </div>

            {isAdmin && (
              <div className="mb-6">
                <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin
                </h4>
                <nav className="space-y-1">
                  <SidebarNavItem
                    item={adminNavItem}
                    pathname={pathname}
                  />
                </nav>
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          router.push("/auth/login");
          return;
        }

        setUserEmail(session.user.email || null);

        // Fetch user role from public.users table for accuracy
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        // Check if role is admin either in metadata or public table
        const role = userData?.role || session.user.user_metadata?.role;
        setIsAdmin(role === 'admin');

      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/auth/login');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          setUserEmail(session.user.email || null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("auth_tokens");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r bg-background hidden lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <Link href="/" className="font-bold text-lg">
              Somatic Canticles
            </Link>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="mb-6">
              <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Overview
              </h4>
              <nav className="space-y-1">
                {dashboardNavItems.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </nav>
            </div>

            <div className="mb-6">
              <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </h4>
              <nav className="space-y-1">
                {settingsNavItems.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </nav>
            </div>

            {isAdmin && (
              <div className="mb-6">
                <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin
                </h4>
                <nav className="space-y-1">
                  <SidebarNavItem
                    item={adminNavItem}
                    pathname={pathname}
                  />
                </nav>
              </div>
            )}
          </div>

          <div className="border-t p-4">
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

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        userEmail={userEmail}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-muted-foreground md:inline">
                {userEmail}
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
