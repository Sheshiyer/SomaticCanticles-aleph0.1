import { cn } from "@/lib/utils";

interface SpinnerProps {
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Color variant
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "white" | "muted";
  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeMap = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-2",
  xl: "h-12 w-12 border-[3px]",
};

const colorMap = {
  primary: "border-primary border-t-transparent",
  secondary: "border-secondary border-t-transparent",
  white: "border-white border-t-transparent",
  muted: "border-muted border-t-transparent",
};

export function Spinner({
  size = "md",
  variant = "primary",
  className,
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeMap[size],
        colorMap[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Full page loading spinner with centered layout
 */
interface PageLoaderProps {
  /**
   * Size of the spinner
   * @default "xl"
   */
  size?: SpinnerProps["size"];
  /**
   * Message to display below spinner
   */
  message?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function PageLoader({
  size = "xl",
  message = "Loading...",
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center gap-4",
        className
      )}
    >
      <Spinner size={size} />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

/**
 * Inline loading state for buttons
 */
interface ButtonLoaderProps {
  /**
   * Text to display next to spinner
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function ButtonLoader({ children, className }: ButtonLoaderProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Spinner size="xs" />
      {children}
    </span>
  );
}

export default Spinner;
