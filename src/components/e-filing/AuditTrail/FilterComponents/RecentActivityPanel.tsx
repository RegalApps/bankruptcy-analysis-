
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditEntry } from "../TimelineEntry";

interface RecentActivityPanelProps {
  recentActivity: AuditEntry[];
}

export const RecentActivityPanel = ({ recentActivity }: RecentActivityPanelProps) => {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-3 pb-3">
        <div className="space-y-2">
          {recentActivity.map(entry => (
            <div key={entry.id} className="text-xs border-b pb-2 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <span className="font-medium">{entry.user.name}</span>
                <Badge variant="outline" className="text-[10px] px-1">
                  {entry.actionType.replace('_', ' ')}
                </Badge>
              </div>
              <div className="truncate text-muted-foreground mt-1">
                {entry.documentName}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
