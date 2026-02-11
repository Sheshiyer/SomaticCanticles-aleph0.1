"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarNavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SidebarSection {
  title?: string;
  items: SidebarNavItem[];
}

interface SidebarProps {
  /**
   * Navigation sections
   */
  sections: SidebarSection[];
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Footer content at the bottom of sidebar
   */
  footer?: React.ReactNode;
}

export function Sidebar({ sections, className, footer }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64",
        "bg-metal-900/60 backdrop-blur-xl border-r border-metal-800",
        "hidden lg:block",
        "shadow-[4px_0_20px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* Top tech line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-6 px-3">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {section.title && (
                <h4 className="mb-3 px-2 text-xs font-bold uppercase tracking-widest text-primary/70 flex items-center gap-2">
                  <span className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                  {section.title}
                  <span className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
                </h4>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary border-l-2 border-primary shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                          : "text-muted-foreground hover:bg-metal-800/50 hover:text-foreground border-l-2 border-transparent hover:border-metal-700",
                        item.disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      {item.icon && (
                        <span className={cn(
                          "flex-shrink-0 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
        {footer && (
          <div className="border-t border-metal-800 p-4 bg-metal-900/40">
            {/* Bottom tech line */}
            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            {footer}
          </div>
        )}
      </div>
    </aside>
  );
}

/**
 * Mobile sidebar that uses a Sheet for smaller screens
 */
interface MobileSidebarProps extends SidebarProps {
  /**
   * Whether the sidebar is open
   */
  open: boolean;
  /**
   * Callback when the sidebar closes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Title shown in the mobile sidebar header
   */
  title?: string;
}

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function MobileSidebar({
  sections,
  open,
  onOpenChange,
  title = "Menu",
  footer,
}: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] p-0 bg-metal-900/95 backdrop-blur-xl border-metal-700">
        <SheetHeader className="p-4 border-b border-metal-800">
          <SheetTitle className="text-metallic">{title}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-4 px-3">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {section.title && (
                <h4 className="mb-3 px-2 text-xs font-bold uppercase tracking-widest text-primary/70 flex items-center gap-2">
                  <span className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                  {section.title}
                  <span className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
                </h4>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-metal-800/50 hover:text-foreground border-l-2 border-transparent hover:border-metal-700",
                        item.disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      {item.icon && (
                        <span className={cn(
                          "flex-shrink-0 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
        {footer && (
          <div className="border-t border-metal-800 p-4 bg-metal-900/40">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
