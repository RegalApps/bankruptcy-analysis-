
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { AuditEntry } from "./types";
import { AuditTimelineItem } from "./AuditTimelineItem";

interface AuditTimelineProps {
  entries: AuditEntry[];
  isLoading: boolean;
  error: Error | null;
  selectedEntryId: string | null;
  onSelectEntry: (id: string) => void;
}

export const AuditTimeline = ({
  entries,
  isLoading,
  error,
  selectedEntryId,
  onSelectEntry,
}: AuditTimelineProps) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-12 w-1 mt-1" />
            </div>
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-2" />
        <h3 className="font-medium text-lg">Error Loading Audit Trail</h3>
        <p className="text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No audit entries found</p>
      </div>
    );
  }

  return (
    <div className="relative p-4">
      {/* Timeline line */}
      <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-border" />

      {entries.map((entry, index) => (
        <AuditTimelineItem
          key={entry.id}
          entry={entry}
          isSelected={entry.id === selectedEntryId}
          onSelect={() => onSelectEntry(entry.id)}
          isLast={index === entries.length - 1}
        />
      ))}
    </div>
  );
};
