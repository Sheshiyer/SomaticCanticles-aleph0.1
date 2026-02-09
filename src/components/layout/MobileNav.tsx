"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  /**
   * Navigation items
   */
  navItems: NavItem[];
  /**
   * Title shown in the mobile nav header
   */
  title?: string;
}

export function MobileNav({ navItems, title = "Menu" }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t my-4" />
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-lg font-medium text-foreground/60 transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="text-lg font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign up
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
