"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  /**
   * Navigation items for the header
   */
  navItems?: NavItem[];
  /**
   * Logo element or text
   */
  logo?: React.ReactNode;
  /**
   * Additional actions to show in the header
   */
  actions?: React.ReactNode;
  /**
   * Whether to show the mobile menu
   * @default true
   */
  showMobileNav?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
];

export function Header({
  navItems = defaultNavItems,
  logo = "Somatic Canticles",
  actions,
  showMobileNav = true,
  className,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-metal-900/80 backdrop-blur-xl",
        "border-b transition-all duration-300",
        isScrolled 
          ? "border-metal-700 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" 
          : "border-metal-800/50",
        className
      )}
    >
      {/* Top tech line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary/50 transition-colors">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
            {logo}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center gap-1 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md transition-all duration-200",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-metal-800/50",
                "relative group"
              )}
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
          {actions || (
            <>
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register" className="hidden md:block">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
          <div className="h-6 w-px bg-metal-700 hidden md:block" />
          <ThemeToggle />
          {showMobileNav && (
            <div className="md:hidden">
              <MobileNav navItems={navItems} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
