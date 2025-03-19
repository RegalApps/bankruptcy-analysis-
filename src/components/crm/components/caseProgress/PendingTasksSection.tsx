
import { Clock, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PendingTasksSectionProps {
  pendingTasks: number;
}

export const PendingTasksSection = ({ pendingTasks }: PendingTasksSectionProps) => {
  const getPendingTasksDescription = (tasks: number) => {
    if (tasks === 0) return "All tasks have been completed for this case.";
    if (tasks < 3) return "Only a few final tasks remain to complete this case.";
    if (tasks < 6) return "Several important tasks still need to be addressed to move this case forward.";
    return "A significant number of tasks require attention to progress this case.";
  };

  return (
    <div className="rounded-md border p-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-full">
          <Clock className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium">{pendingTasks}</p>
          <p className="text-xs text-muted-foreground">Pending Tasks</p>
        </div>
      </div>
      
      <Collapsible className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full h-6 text-xs justify-start px-0 text-muted-foreground hover:text-foreground">
            View details
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <p className="text-xs text-muted-foreground">
            {getPendingTasksDescription(pendingTasks)}
          </p>
          {pendingTasks > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex items-start gap-1">
                <FileText className="h-3 w-3 mt-0.5 text-amber-500" />
                <span className="text-xs">Priority task{pendingTasks > 1 ? 's' : ''} requiring attention</span>
              </div>
              <Badge variant="outline" className="text-xs mt-1">
                {pendingTasks > 5 ? 'High Priority' : pendingTasks > 2 ? 'Medium Priority' : 'Low Priority'}
              </Badge>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
