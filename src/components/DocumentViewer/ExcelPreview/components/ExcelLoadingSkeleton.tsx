
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva(
  "space-y-4",
  {
    variants: {
      size: {
        small: "max-w-md",
        medium: "",
        large: "space-y-6",
      }
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

export interface ExcelLoadingSkeletonProps extends VariantProps<typeof skeletonVariants> {
  className?: string;
}

export const ExcelLoadingSkeleton = ({ size, className }: ExcelLoadingSkeletonProps) => {
  return (
    <div className={skeletonVariants({ size, className })}>
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
};
