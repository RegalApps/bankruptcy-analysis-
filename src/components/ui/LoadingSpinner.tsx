
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export const LoadingSpinner = ({ 
  size = "medium", 
  className 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-6 w-6 border-2",
    large: "h-8 w-8 border-3"
  };

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent", 
        sizeClasses[size],
        className
      )}
    />
  );
};
