// Warcraft-inspired decorative frames and borders

import * as React from "react";
import { cn } from "@/lib/utils";

interface TechFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "tech" | "alert" | "success" | "gold";
  size?: "sm" | "default" | "lg";
  children: React.ReactNode;
}

function TechFrame({ 
  className, 
  variant = "default", 
  size = "default",
  children,
  ...props 
}: TechFrameProps) {
  const variantClasses = {
    default: "border-metal-700",
    tech: "border-cyan-500/50",
    alert: "border-rose-500/50",
    success: "border-emerald-500/50",
    gold: "border-amber-500/50",
  };
  
  const sizeClasses = {
    sm: "p-3",
    default: "p-4",
    lg: "p-6",
  };
  
  const cornerSize = size === "sm" ? "w-2 h-2" : size === "lg" ? "w-4 h-4" : "w-3 h-3";
  
  return (
    <div 
      className={cn(
        "relative border bg-metal-900/80 backdrop-blur-sm rounded-lg",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Corner accents */}
      <span className={cn("absolute -top-px -left-px border-t-2 border-l-2 rounded-tl-lg", cornerSize, variantClasses[variant])} />
      <span className={cn("absolute -top-px -right-px border-t-2 border-r-2 rounded-tr-lg", cornerSize, variantClasses[variant])} />
      <span className={cn("absolute -bottom-px -left-px border-b-2 border-l-2 rounded-bl-lg", cornerSize, variantClasses[variant])} />
      <span className={cn("absolute -bottom-px -right-px border-b-2 border-r-2 rounded-br-lg", cornerSize, variantClasses[variant])} />
      
      {children}
    </div>
  );
}

// HUD Panel with header
interface HudPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: "default" | "tech" | "alert";
}

function HudPanel({ 
  className, 
  title,
  icon,
  actions,
  variant = "default",
  children,
  ...props 
}: HudPanelProps) {
  const variantClasses = {
    default: {
      border: "border-metal-700",
      header: "bg-metal-800/50 border-metal-700",
      accent: "bg-amber-500",
    },
    tech: {
      border: "border-cyan-500/30",
      header: "bg-cyan-500/10 border-cyan-500/30",
      accent: "bg-cyan-500",
    },
    alert: {
      border: "border-rose-500/30",
      header: "bg-rose-500/10 border-rose-500/30",
      accent: "bg-rose-500",
    },
  };
  
  const styles = variantClasses[variant];
  
  return (
    <div 
      className={cn(
        "relative rounded-lg border overflow-hidden",
        "bg-metal-900/60 backdrop-blur-sm",
        styles.border,
        className
      )}
      {...props}
    >
      {title && (
        <div className={cn(
          "flex items-center gap-2 px-4 py-3 border-b",
          styles.header
        )}>
          <div className={cn("w-1 h-4 rounded-full", styles.accent)} />
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h3 className="font-semibold text-sm">{title}</h3>
          {actions && <div className="ml-auto">{actions}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

// Divider with label
function SectionDivider({ 
  label, 
  className 
}: { 
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-metal-700 to-transparent" />
      {label && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-metal-700 to-transparent" />
    </div>
  );
}

// Data display for stats/metrics
interface DataDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: "default" | "tech" | "success" | "warning";
}

function DataDisplay({ 
  label, 
  value, 
  unit,
  trend,
  trendValue,
  icon,
  variant = "default"
}: DataDisplayProps) {
  const variantClasses = {
    default: "border-metal-700",
    tech: "border-cyan-500/30 bg-cyan-500/5",
    success: "border-emerald-500/30 bg-emerald-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
  };
  
  const trendColors = {
    up: "text-emerald-400",
    down: "text-rose-400",
    neutral: "text-metal-400",
  };
  
  return (
    <div className={cn(
      "p-3 rounded-lg border",
      variantClasses[variant]
    )}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold font-mono text-metallic">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {trend && trendValue && (
        <div className={cn("text-xs mt-1", trendColors[trend])}>
          {trend === "up" && "↑"}
          {trend === "down" && "↓"}
          {trend === "neutral" && "→"} {trendValue}
        </div>
      )}
    </div>
  );
}

// Corner ornament decoration
function CornerOrnament({ 
  position = "top-left",
  className 
}: { 
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 scale-x-[-1]",
    "bottom-left": "bottom-0 left-0 scale-y-[-1]",
    "bottom-right": "bottom-0 right-0 scale-x-[-1] scale-y-[-1]",
  };
  
  return (
    <svg 
      className={cn(
        "absolute w-8 h-8 text-metal-600",
        positionClasses[position],
        className
      )}
      viewBox="0 0 32 32"
      fill="none"
    >
      <path 
        d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z" 
        fill="currentColor"
        opacity="0.5"
      />
      <path 
        d="M4 4 L8 4 L8 6 L6 6 L6 8 L4 8 Z" 
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}

export {
  TechFrame,
  HudPanel,
  SectionDivider,
  DataDisplay,
  CornerOrnament,
};
