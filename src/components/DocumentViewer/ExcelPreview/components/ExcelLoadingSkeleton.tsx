
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import { Progress } from "@/components/ui/progress";

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
  progress?: number;
}

export const ExcelLoadingSkeleton = ({ size, className, progress }: ExcelLoadingSkeletonProps) => {
  return (
    <div className={skeletonVariants({ size, className })}>
      <Skeleton className="h-8 w-64 mb-2" />
      
      {progress !== undefined && progress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Loading spreadsheet data</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}
      
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
};
