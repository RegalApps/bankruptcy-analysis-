
import { format } from "date-fns";
import { AuditEntry } from "./types";
import { getActionIcon, getActionColor } from "./utils";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface RecentActivitiesProps {
  entries: AuditEntry[];
}

export const RecentActivities = ({ entries }: RecentActivitiesProps) => {
  if (!entries.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No recent activities
      </div>
    );
  }

  return (
    <div className="divide-y">
      {entries.map(entry => {
        const ActionIcon = getActionIcon(entry.action);
        const actionColor = getActionColor(entry.action);
        const timestamp = new Date(entry.timestamp);
        const isToday = new Date().toDateString() === timestamp.toDateString();
        const formattedDate = isToday 
          ? format(timestamp, "h:mm a") 
          : format(timestamp, "MMM d, h:mm a");

        return (
          <div key={entry.id} className="p-3 hover:bg-muted/50">
            <div className="flex gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-${actionColor}-100 text-${actionColor}-700`}>
                <ActionIcon className="h-4 w-4" />
              </div>
              <div className="space-y-1 w-full">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium">{entry.user.name}</div>
                  <div className="text-xs text-muted-foreground">{formattedDate}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {entry.action.replace(/_/g, " ")} - {entry.document.name}
                </div>
                {entry.clientName && (
                  <div className="text-xs text-muted-foreground">
                    Client: {entry.clientName}
                  </div>
                )}
                <div className="flex items-center gap-1 mt-1">
                  {entry.critical && (
                    <div className="flex items-center text-xs text-destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Critical
                    </div>
                  )}
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    v{entry.document.version}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
