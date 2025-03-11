
import { format } from "date-fns";
import { AuditEntry } from "./types";
import { getActionIcon, getActionColor } from "./utils";

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

        return (
          <div key={entry.id} className="p-3 hover:bg-muted/50">
            <div className="flex gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-${actionColor}-100 text-${actionColor}-700`}>
                <ActionIcon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">{entry.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {entry.action.replace(/_/g, " ")} - {entry.document.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
