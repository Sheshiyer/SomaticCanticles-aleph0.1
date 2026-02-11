"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple Select component without radix for now (can be upgraded later)

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.ComponentProps<"select">, "onChange"> {
  /**
   * Options for the select
   */
  options?: SelectOption[];
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Callback when value changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Children for Radix-style API
   */
  children?: React.ReactNode;
}

function Select({
  className,
  options,
  placeholder,
  error,
  onValueChange,
  ...props
}: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <select
          className={cn(
            "h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-base shadow-xs outline-none transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            error && "border-destructive ring-destructive/20 dark:ring-destructive/40",
            className
          )}
          data-slot="select"
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none opacity-50" />
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

/**
 * Multi-select component using checkboxes
 */
interface MultiSelectProps {
  /**
   * Options for the multi-select
   */
  options: SelectOption[];
  /**
   * Selected values
   */
  value: string[];
  /**
   * Callback when selection changes
   */
  onChange: (value: string[]) => void;
  /**
   * Label for the multi-select
   */
  label?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

function MultiSelect({
  options,
  value,
  onChange,
  label,
  error,
  className,
}: MultiSelectProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="text-sm font-medium mb-2 block">{label}</label>
      )}
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              disabled={option.disabled}
              className={cn(
                "flex items-center gap-2 w-full p-2 rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isSelected && "bg-accent/50",
                option.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border",
                  isSelected
                    ? "bg-primary border-primary"
                    : "border-input bg-transparent"
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <span className="text-sm">{option.label}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

// Placeholder components for Radix-style API compatibility
// These are stubs that allow the existing code to compile
// A proper implementation would use @radix-ui/react-select

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md px-3 py-2 text-sm",
      "bg-metal-900/50 border border-metal-700 text-foreground",
      "hover:border-metal-600 transition-all duration-200",
      "focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
  </button>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, children, ...props }, ref) => (
  <span ref={ref} className={cn("text-sm truncate", className)} {...props}>
    {children || <span className="text-muted-foreground">{placeholder}</span>}
  </span>
));
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-50 min-w-[8rem] overflow-hidden rounded-md",
      "bg-metal-900/95 backdrop-blur-sm border border-metal-700",
      "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
      "text-foreground",
      className
    )}
    {...props}
  >
    <div className="p-1">{children}</div>
  </div>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; children: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-2 text-sm",
      "outline-none transition-colors",
      "hover:bg-metal-800 hover:text-primary",
      "focus:bg-metal-800 focus:text-primary",
      "data-[selected]:bg-metal-800 data-[selected]:text-primary",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SelectItem.displayName = "SelectItem";

export { Select, MultiSelect, SelectTrigger, SelectValue, SelectContent, SelectItem };
export type { SelectOption, SelectProps, MultiSelectProps };
