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
        "fixed inset-y-0 left-0 z-40 w-64 border-r bg-background hidden lg:block",
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-4 px-3">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {section.title && (
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
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
                        "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/60 hover:bg-accent hover:text-accent-foreground",
                        item.disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0">{item.icon}</span>
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
        {footer && (
          <div className="border-t p-4">
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
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-4 px-3">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {section.title && (
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
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
                        "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/60 hover:bg-accent hover:text-accent-foreground",
                        item.disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0">{item.icon}</span>
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
        {footer && <div className="border-t p-4">{footer}</div>}
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
