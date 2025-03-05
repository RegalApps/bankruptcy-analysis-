
import { Skeleton } from "@/components/ui/skeleton";

export const ExcelLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
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
