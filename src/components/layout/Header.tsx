"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "./MobileNav";

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
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 10);
    });
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      } ${className || ""}`}
    >
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg">{logo}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:flex-none">
          {actions || (
            <>
              <Link href="/login" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register" className="hidden md:block">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
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
