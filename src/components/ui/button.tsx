import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles with tech aesthetic
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:grayscale aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        // Primary - Solar gold with metallic effect
        default: [
          "bg-gradient-to-b from-amber-400 to-amber-500",
          "text-amber-950 font-semibold",
          "border border-amber-400/50",
          "shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_2px_4px_rgba(0,0,0,0.3)]",
          "hover:from-amber-300 hover:to-amber-400",
          "hover:shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_4px_12px_rgba(251,191,36,0.3)]",
          "active:translate-y-[1px] active:shadow-[0_1px_2px_rgba(0,0,0,0.3)_inset]",
        ],
        
        // Secondary - Transform purple
        secondary: [
          "bg-gradient-to-b from-violet-500 to-violet-600",
          "text-white font-semibold",
          "border border-violet-400/50",
          "shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_2px_4px_rgba(0,0,0,0.3)]",
          "hover:from-violet-400 hover:to-violet-500",
          "hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_4px_12px_rgba(139,92,246,0.3)]",
          "active:translate-y-[1px] active:shadow-[0_1px_2px_rgba(0,0,0,0.3)_inset]",
        ],
        
        // Tech Cyan accent
        tech: [
          "bg-gradient-to-b from-cyan-500 to-cyan-600",
          "text-white font-semibold",
          "border border-cyan-400/50",
          "shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_2px_4px_rgba(0,0,0,0.3)]",
          "hover:from-cyan-400 hover:to-cyan-500",
          "hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_4px_12px_rgba(6,182,212,0.3)]",
          "active:translate-y-[1px] active:shadow-[0_1px_2px_rgba(0,0,0,0.3)_inset]",
        ],
        
        // Destructive - Rose/Red
        destructive: [
          "bg-gradient-to-b from-rose-500 to-rose-600",
          "text-white font-semibold",
          "border border-rose-400/50",
          "shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_2px_4px_rgba(0,0,0,0.3)]",
          "hover:from-rose-400 hover:to-rose-500",
          "hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_4px_12px_rgba(244,63,94,0.3)]",
          "active:translate-y-[1px] active:shadow-[0_1px_2px_rgba(0,0,0,0.3)_inset]",
        ],
        
        // Outline - Metallic border
        outline: [
          "bg-transparent",
          "text-foreground",
          "border border-metal-700",
          "shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]",
          "hover:bg-metal-800/50 hover:border-metal-600",
          "hover:shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_0_15px_rgba(255,255,255,0.05)]",
          "active:bg-metal-800 active:translate-y-[1px]",
        ],
        
        // Ghost - Subtle
        ghost: [
          "bg-transparent",
          "text-muted-foreground",
          "hover:bg-metal-800/50 hover:text-foreground",
          "active:bg-metal-800",
        ],
        
        // Link - Text only
        link: [
          "bg-transparent",
          "text-primary underline-offset-4 hover:underline",
          "hover:text-primary/80",
        ],
        
        // Metal - Steel button
        metal: [
          "bg-gradient-to-b from-metal-700 to-metal-800",
          "text-metal-100 font-medium",
          "border border-metal-600",
          "shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_2px_4px_rgba(0,0,0,0.3)]",
          "hover:from-metal-600 hover:to-metal-700",
          "hover:shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_4px_12px_rgba(0,0,0,0.3)]",
          "active:translate-y-[1px] active:shadow-[0_1px_2px_rgba(0,0,0,0.4)_inset]",
        ],
        
        // Glow - For important CTAs
        glow: [
          "bg-primary text-primary-foreground font-semibold",
          "border border-primary/50",
          "shadow-[0_0_15px_rgba(251,191,36,0.3),0_1px_0_rgba(255,255,255,0.3)_inset]",
          "hover:shadow-[0_0_25px_rgba(251,191,36,0.5),0_1px_0_rgba(255,255,255,0.4)_inset]",
          "hover:brightness-110",
          "active:translate-y-[1px]",
        ],
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        xs: "h-7 gap-1 rounded px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4 text-base",
        xl: "h-14 rounded-lg px-8 has-[>svg]:px-6 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
        "icon-xl": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Shine effect overlay
function ButtonShine() {
  return (
    <span 
      className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
      aria-hidden="true"
    />
  );
}

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  shine?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  shine = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
    >
      {shine && variant !== "ghost" && variant !== "link" && <ButtonShine />}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </Comp>
  );
}

export { Button, buttonVariants };

// Add shimmer animation to globals.css
const shimmerKeyframes = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`;
