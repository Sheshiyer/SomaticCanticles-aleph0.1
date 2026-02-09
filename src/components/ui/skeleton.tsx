import { cn } from "@/lib/utils";

interface SkeletonProps extends React.ComponentProps<"div"> {
  /**
   * Whether to show animation pulse
   * @default true
   */
  animate?: boolean;
}

function Skeleton({ className, animate = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-accent",
        animate && "animate-pulse",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

/**
 * Skeleton for text content with multiple lines
 */
interface SkeletonTextProps {
  /**
   * Number of lines to show
   * @default 3
   */
  lines?: number;
  /**
   * Width of each line (can be array for different widths)
   */
  widths?: (string | number)[];
  /**
   * Height of each line
   * @default "1em"
   */
  lineHeight?: string;
  /**
   * Gap between lines
   * @default "0.5em"
   */
  gap?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

function SkeletonText({
  lines = 3,
  widths,
  lineHeight = "1em",
  gap = "0.5em",
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn("flex flex-col", className)} style={{ gap }}>
      {Array.from({ length: lines }).map((_, index) => {
        const width = widths?.[index] ?? (index === lines - 1 ? "60%" : "100%");
        return (
          <Skeleton
            key={index}
            className="w-full"
            style={{
              width: typeof width === "number" ? `${width}px` : width,
              height: lineHeight,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Skeleton for card layout
 */
interface SkeletonCardProps {
  /**
   * Whether to show header
   * @default true
   */
  hasHeader?: boolean;
  /**
   * Number of content lines
   * @default 3
   */
  contentLines?: number;
  /**
   * Whether to show footer
   * @default false
   */
  hasFooter?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

function SkeletonCard({
  hasHeader = true,
  contentLines = 3,
  hasFooter = false,
  className,
}: SkeletonCardProps) {
  return (
    <div className={cn("rounded-xl border p-4 space-y-4", className)}>
      {hasHeader && (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <SkeletonText lines={contentLines} />
      </div>
      {hasFooter && (
        <div className="pt-2 border-t">
          <Skeleton className="h-8 w-full" />
        </div>
      )}
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard };
