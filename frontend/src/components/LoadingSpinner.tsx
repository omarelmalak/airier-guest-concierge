import { cn } from "@/lib/utils/common";

type LoadingSpinnerSize = "sm" | "md" | "lg";
type LoadingSpinnerVariant = "default" | "primary" | "muted" | "on-primary";

const sizeClasses: Record<LoadingSpinnerSize, string> = {
  sm: "h-4 w-4 border-[2px]",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

const variantClasses: Record<LoadingSpinnerVariant, string> = {
  default: "border-primary/20 border-t-primary",
  primary: "border-primary/20 border-t-primary",
  muted: "border-muted-foreground/25 border-t-muted-foreground",
  "on-primary": "border-primary-foreground/30 border-t-primary-foreground",
};

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  className?: string;
}

/**
 * Reusable loading spinner. Uses design-rules semantic colors only.
 * - default / primary: app brand color (primary)
 * - muted: subtle grey (e.g. inline in cards)
 * - on-primary: light on dark (e.g. inside primary Button)
 */
const LoadingSpinner = ({
  size = "md",
  variant = "default",
  className,
}: LoadingSpinnerProps) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "shrink-0 rounded-full animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
};

export default LoadingSpinner;
