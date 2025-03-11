
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getActionIcon, getActionColor } from "./utils";
import { AuditEntry } from "./types";
import { Badge } from "@/components/ui/badge";

interface AuditTimelineItemProps {
  entry: AuditEntry;
  isSelected: boolean;
  onSelect: () => void;
  isLast: boolean;
}

export const AuditTimelineItem = ({
  entry,
  isSelected,
  onSelect,
  isLast,
}: AuditTimelineItemProps) => {
  const ActionIcon = getActionIcon(entry.action);
  const actionColor = getActionColor(entry.action);

  return (
    <div className={cn(
      "flex gap-4 mb-6",
      isLast && "mb-0"
    )}>
      <div className="relative">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center z-10 relative",
          `bg-${actionColor}-100 text-${actionColor}-700`,
          isSelected && `ring-2 ring-${actionColor}-500 ring-offset-2`
        )}>
          <ActionIcon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex-1">
        <Button
          variant={isSelected ? "default" : "ghost"}
          className={cn(
            "w-full justify-start p-3 text-left h-auto",
            isSelected && "bg-muted"
          )}
          onClick={onSelect}
        >
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <span className="font-medium">{entry.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(entry.timestamp), "MMM d, h:mm a")}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-1">
              {entry.action} - {entry.document.name}
            </p>
            
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="outline" className="text-xs px-1 py-0">
                v{entry.document.version}
              </Badge>
              {entry.critical && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Critical
                </Badge>
              )}
              {entry.action === "risk_assessment" && (
                <Badge variant="default" className="bg-amber-500 text-xs px-1 py-0">
                  Risk
                </Badge>
              )}
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};
