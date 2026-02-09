import type * as React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.ComponentProps<"label"> {
  /**
   * Whether the field is required
   */
  required?: boolean;
}

function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      data-slot="label"
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

export { Label };
