
import { cva, type VariantProps } from "class-variance-authority";

const loadingVariants = cva(
  "flex flex-col items-center justify-center p-4 gap-2",
  {
    variants: {
      size: {
        small: "min-h-[100px]",
        medium: "min-h-[200px] p-6 gap-3",
        large: "min-h-[300px] p-8 gap-3",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

const spinnerVariants = cva(
  "animate-spin rounded-full border-b-2 border-primary",
  {
    variants: {
      size: {
        small: "h-6 w-6",
        medium: "h-10 w-10",
        large: "h-12 w-12",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

const textVariants = cva(
  "text-muted-foreground",
  {
    variants: {
      size: {
        small: "text-xs",
        medium: "text-sm mt-2",
        large: "text-base mt-3",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

export interface LoadingStateProps extends VariantProps<typeof loadingVariants> {
  message?: string;
  className?: string;
}

export const LoadingState = ({ 
  size, 
  message = "Loading document...", 
  className 
}: LoadingStateProps) => {
  return (
    <div className={loadingVariants({ size, className })}>
      <div className={spinnerVariants({ size })}></div>
      <p className={textVariants({ size })}>{message}</p>
    </div>
  );
};
