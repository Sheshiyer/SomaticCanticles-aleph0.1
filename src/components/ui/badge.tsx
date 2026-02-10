import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        // Default - subtle background
        default: [
          "bg-primary/10 border-primary/20 text-primary",
          "hover:bg-primary/20",
        ],
        
        // Secondary - purple accent
        secondary: [
          "bg-secondary/10 border-secondary/20 text-secondary",
          "hover:bg-secondary/20",
        ],
        
        // Tech cyan
        tech: [
          "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
          "hover:bg-cyan-500/20",
          "shadow-[0_0_10px_rgba(6,182,212,0.1)]",
        ],
        
        // Success - emerald
        success: [
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
          "hover:bg-emerald-500/20",
        ],
        
        // Warning - amber
        warning: [
          "bg-amber-500/10 border-amber-500/20 text-amber-400",
          "hover:bg-amber-500/20",
        ],
        
        // Destructive - rose
        destructive: [
          "bg-rose-500/10 border-rose-500/20 text-rose-400",
          "hover:bg-rose-500/20",
        ],
        
        // Outline - transparent with border
        outline: [
          "bg-transparent border-metal-600 text-muted-foreground",
          "hover:bg-metal-800/50 hover:text-foreground",
        ],
        
        // Metal - steel look
        metal: [
          "bg-metal-800 border-metal-700 text-metal-300",
          "hover:bg-metal-700",
        ],
        
        // Glow - for important badges
        glow: [
          "bg-primary/20 border-primary/30 text-primary",
          "shadow-[0_0_15px_rgba(251,191,36,0.2)]",
          "hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]",
        ],
        
        // Status variants with dots
        "status-active": [
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        ],
        "status-inactive": [
          "bg-metal-800 border-metal-700 text-metal-400",
        ],
        "status-pending": [
          "bg-amber-500/10 border-amber-500/20 text-amber-400",
        ],
        "status-error": [
          "bg-rose-500/10 border-rose-500/20 text-rose-400",
        ],
      },
      size: {
        default: "h-6 px-2.5",
        sm: "h-5 px-2 text-[10px]",
        lg: "h-7 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: "default" | "primary" | "success" | "warning" | "error";
}

function Badge({ 
  className, 
  variant, 
  size,
  dot = false,
  dotColor = "default",
  children,
  ...props 
}: BadgeProps) {
  const dotColorClasses = {
    default: "bg-current",
    primary: "bg-amber-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
  };
  
  return (
    <span 
      className={cn(badgeVariants({ variant, size }), className)} 
      {...props}
    >
      {dot && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          dotColorClasses[dotColor],
          (dotColor === "success" || variant?.includes("active")) && "animate-pulse"
        )} />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
