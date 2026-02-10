"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base sizing and shape
      "peer h-4 w-4 shrink-0 rounded-[4px]",
      // Tech-style border
      "border border-metal-600",
      // Background
      "bg-metal-900/50",
      // Transition
      "transition-all duration-150 ease-out",
      // Focus states
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      // Disabled state
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:border-metal-700",
      // Hover state
      "hover:border-metal-500",
      // Checked state - Solar gold theme
      "data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-amber-400 data-[state=checked]:to-amber-500",
      "data-[state=checked]:border-amber-400",
      "data-[state=checked]:shadow-[0_0_8px_rgba(251,191,36,0.3)]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3 w-3 text-amber-950 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Checkbox with label wrapper
interface CheckboxFieldProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label: string;
  description?: string;
  error?: string;
}

const CheckboxField = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxFieldProps
>(({ label, description, error, className, ...props }, ref) => {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Checkbox
        ref={ref}
        className={cn(error && "border-rose-500 data-[state=checked]:border-rose-500")}
        {...props}
      />
      <div className="flex flex-col gap-0.5">
        <label 
          htmlFor={props.id}
          className="text-sm font-medium leading-none cursor-pointer select-none text-foreground"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        {error && (
          <p className="text-xs text-rose-500 flex items-center gap-1">
            <span className="inline-block">•</span>
            {error}
          </p>
        )}
      </div>
    </div>
  );
})
CheckboxField.displayName = "CheckboxField"

export { Checkbox, CheckboxField }
