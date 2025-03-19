
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NextStepsSectionProps {
  pendingTasks: number;
  missingDocuments: number;
}

export const NextStepsSection = ({ pendingTasks, missingDocuments }: NextStepsSectionProps) => {
  return (
    <div className="pt-2 border-t">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Next Steps</h4>
        <Badge variant="outline" className="text-xs">
          {pendingTasks + missingDocuments === 0 ? 'None Required' : 'Action Needed'}
        </Badge>
      </div>
      {(pendingTasks > 0 || missingDocuments > 0) && (
        <ul className="mt-2 space-y-1">
          {missingDocuments > 0 && (
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-red-500" />
              <span>Request missing documentation from client</span>
            </li>
          )}
          {pendingTasks > 0 && (
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-amber-500" />
              <span>Schedule task review meeting</span>
            </li>
          )}
          {(pendingTasks > 2 || missingDocuments > 2) && (
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-blue-500" />
              <span>Update case timeline with client</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
