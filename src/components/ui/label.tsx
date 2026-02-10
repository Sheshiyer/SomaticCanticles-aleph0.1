import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  // Base styles
  "text-sm font-medium leading-none cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        tech: "text-cyan-400",
        required: "text-foreground after:content-['_*'] after:text-rose-500 after:ml-0.5",
      },
      size: {
        default: "text-sm",
        xs: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, size, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label, labelVariants }
