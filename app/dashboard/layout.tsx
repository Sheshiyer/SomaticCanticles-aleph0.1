// Dashboard Layout - Protected layout for authenticated users
// Includes sidebar navigation and header with user menu

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    href: "/",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Biorhythm",
    href: "/biorhythm",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    label: "Chapters",
    href: "/chapters",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: <Calendar className="h-4 w-4" />,
    disabled: true,
  },
];

const settingsNavItems: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-4 w-4" />,
    disabled: true,
  },
];

// Admin nav item (shown only for admins)
const adminNavItem: NavItem = {
  label: "Admin",
  href: "/admin",
  icon: <Shield className="h-4 w-4" />,
};

// Sidebar Nav Item Component
function SidebarNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
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
                    isActive={pathname === item.href}
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
                    isActive={pathname === item.href}
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
                    isActive={pathname.startsWith("/admin")}
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get user from localStorage
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setUserEmail(parsed.email || null);
          setIsAdmin(parsed.role === "admin");
        } catch {
          // Invalid user data, redirect to login
          router.push("/login");
        }
      } else {
        // No user, redirect to login
        router.push("/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_tokens");
    localStorage.removeItem("user");
    router.push("/login");
  };

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
                    isActive={pathname === item.href}
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
                    isActive={pathname === item.href}
                  />
                ))}
              </nav>
            </div>
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
