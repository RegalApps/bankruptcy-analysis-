
import { Skeleton } from "@/components/ui/skeleton";
import { ClientHeader } from "./ClientHeader";

interface ClientSkeletonProps {
  onBack: () => void;
}

export const ClientSkeleton = ({ onBack }: ClientSkeletonProps) => {
  return (
    <div className="h-full border rounded-md">
      <div className="border-b">
        <ClientHeader onBack={onBack} />
      </div>
      <div className="flex h-[calc(100%-4rem)]">
        <div className="w-64 border-r p-4">
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-4 w-4/5 mb-2" />
          <Skeleton className="h-4 w-3/5 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
