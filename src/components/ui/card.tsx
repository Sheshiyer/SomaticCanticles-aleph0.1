import * as React from "react";

import { cn } from "@/lib/utils";

// Card variants for different tech aesthetics
const cardVariants = {
  default: [
    "bg-card/80 backdrop-blur-sm",
    "border border-metal-800",
    "shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
    "hover:border-metal-700 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
  ],
  glass: [
    "bg-metal-900/60 backdrop-blur-xl",
    "border border-white/10",
    "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    "hover:bg-metal-900/70 hover:border-white/15",
  ],
  solid: [
    "bg-metal-900",
    "border border-metal-800",
    "shadow-lg",
  ],
  elevated: [
    "bg-gradient-to-b from-metal-800 to-metal-900",
    "border border-metal-700",
    "shadow-[0_4px_20px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.05)_inset]",
  ],
  interactive: [
    "bg-card/80 backdrop-blur-sm",
    "border border-metal-800",
    "shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
    "transition-all duration-200",
    "hover:border-metal-600 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
    "hover:-translate-y-0.5",
    "active:translate-y-0",
  ],
  tech: [
    "relative",
    "bg-metal-900/90 backdrop-blur-sm",
    "border border-cyan-500/30",
    "shadow-[0_0_20px_rgba(6,182,212,0.1),0_4px_20px_rgba(0,0,0,0.3)]",
    "before:absolute before:inset-0 before:rounded-xl",
    "before:bg-gradient-to-b before:from-cyan-500/5 before:to-transparent before:pointer-events-none",
  ],
  alert: [
    "bg-rose-950/30 backdrop-blur-sm",
    "border border-rose-500/30",
    "shadow-[0_0_20px_rgba(244,63,94,0.1)]",
  ],
  success: [
    "bg-emerald-950/30 backdrop-blur-sm",
    "border border-emerald-500/30",
    "shadow-[0_0_20px_rgba(16,185,129,0.1)]",
  ],
};

interface CardProps extends React.ComponentProps<"div"> {
  variant?: keyof typeof cardVariants;
  size?: "default" | "sm" | "lg";
  noPadding?: boolean;
}

function Card({
  className,
  variant = "default",
  size = "default",
  noPadding = false,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cn(
        "relative overflow-hidden rounded-xl text-sm",
        "transition-all duration-200",
        cardVariants[variant],
        !noPadding && size === "default" && "p-5",
        !noPadding && size === "sm" && "p-4",
        !noPadding && size === "lg" && "p-6",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 rounded-t-xl",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-lg font-semibold leading-snug tracking-tight",
        "text-metallic",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "ml-auto flex items-center gap-2",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2 rounded-b-xl",
        "border-t border-metal-800/50 mt-4 pt-4",
        className
      )}
      {...props}
    />
  );
}

// Tech divider for cards
function CardDivider({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "h-px w-full my-4",
        "bg-gradient-to-r from-transparent via-metal-700 to-transparent",
        className
      )}
    />
  );
}

// Corner accents for tech aesthetic
function CardCorners({ color = "primary" }: { color?: "primary" | "cyan" | "rose" | "emerald" | "violet" }) {
  const colorClasses = {
    primary: "border-amber-500/50",
    cyan: "border-cyan-500/50",
    rose: "border-rose-500/50",
    emerald: "border-emerald-500/50",
    violet: "border-violet-500/50",
  };
  
  return (
    <>
      {/* Top-left */}
      <span className={cn("absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-lg", colorClasses[color])} />
      {/* Top-right */}
      <span className={cn("absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-lg", colorClasses[color])} />
      {/* Bottom-left */}
      <span className={cn("absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-lg", colorClasses[color])} />
      {/* Bottom-right */}
      <span className={cn("absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-lg", colorClasses[color])} />
    </>
  );
}

// Status badge for cards
function CardStatus({ 
  status,
  className 
}: { 
  status: "locked" | "unlocked" | "in-progress" | "completed" | "active" | "inactive";
  className?: string;
}) {
  const statusConfig = {
    locked: { color: "bg-metal-700 text-metal-400", dot: "bg-metal-500" },
    unlocked: { color: "bg-amber-500/20 text-amber-400", dot: "bg-amber-500" },
    "in-progress": { color: "bg-cyan-500/20 text-cyan-400", dot: "bg-cyan-500 animate-pulse" },
    completed: { color: "bg-emerald-500/20 text-emerald-400", dot: "bg-emerald-500" },
    active: { color: "bg-emerald-500/20 text-emerald-400", dot: "bg-emerald-500 animate-pulse" },
    inactive: { color: "bg-rose-500/20 text-rose-400", dot: "bg-rose-500" },
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
      config.color,
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardDivider,
  CardCorners,
  CardStatus,
  cardVariants,
};
