
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "animate-spin rounded-full border-b-2 border-primary",
  {
    variants: {
      size: {
        small: "h-4 w-4",
        default: "h-8 w-8",
        large: "h-12 w-12",
      },
      fullScreen: {
        true: "min-h-screen h-screen w-full bg-background flex items-center justify-center",
        false: "flex",
      }
    },
    defaultVariants: {
      size: "default",
      fullScreen: false,
    },
  }
);

export interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export const LoadingSpinner = ({ 
  size, 
  fullScreen = false,
  className 
}: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen h-screen w-full bg-background flex items-center justify-center">
        <div className={cn(spinnerVariants({ size, fullScreen: false, className }))}></div>
      </div>
    );
  }
  
  return <div className={cn(spinnerVariants({ size, fullScreen, className }))}></div>;
};
