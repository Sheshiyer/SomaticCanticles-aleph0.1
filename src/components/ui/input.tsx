import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = {
  default: [
    "bg-metal-900/50",
    "border border-metal-700",
    "text-foreground placeholder:text-muted-foreground",
    "focus:border-primary focus:ring-1 focus:ring-primary/30",
    "hover:border-metal-600",
  ],
  tech: [
    "bg-metal-900/80",
    "border border-cyan-500/30",
    "text-foreground placeholder:text-metal-500",
    "focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30",
    "focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    "hover:border-cyan-500/50",
  ],
  ghost: [
    "bg-transparent",
    "border-b border-metal-700 rounded-none px-0",
    "text-foreground placeholder:text-muted-foreground",
    "focus:border-primary focus:ring-0",
    "hover:border-metal-600",
  ],
  filled: [
    "bg-metal-800",
    "border border-transparent",
    "text-foreground placeholder:text-muted-foreground",
    "focus:bg-metal-800 focus:border-primary",
    "hover:bg-metal-800/80",
  ],
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: keyof typeof inputVariants;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant = "default",
    leftIcon,
    rightIcon,
    error,
    ...props 
  }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-10 w-full rounded-md px-3 py-2 text-sm",
            "transition-all duration-200",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "outline-none",
            // Variant styles
            inputVariants[variant],
            // Icon padding
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            // Error state
            error && [
              "border-rose-500/50",
              "focus:border-rose-500 focus:ring-rose-500/30",
              "bg-rose-950/10",
            ],
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
