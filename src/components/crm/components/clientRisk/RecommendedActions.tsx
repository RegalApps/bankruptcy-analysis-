
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface RecommendedActionsProps {
  complianceStatus: 'compliant' | 'issues' | 'critical';
}

export const RecommendedActions = ({ complianceStatus }: RecommendedActionsProps) => {
  return (
    <div className="pt-2 border-t">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Recommended Actions</h4>
        <Badge variant="outline" className="text-xs">
          {complianceStatus === 'compliant' ? 'Routine' : 
           complianceStatus === 'issues' ? 'Medium Priority' : 'Urgent'}
        </Badge>
      </div>
      <ul className="mt-2 space-y-1">
        {complianceStatus === 'compliant' ? (
          <>
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-green-500" />
              <span>Schedule quarterly compliance review</span>
            </li>
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-green-500" />
              <span>Update client on positive compliance standing</span>
            </li>
          </>
        ) : complianceStatus === 'issues' ? (
          <>
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-amber-500" />
              <span>Schedule documentation review within 14 days</span>
            </li>
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-amber-500" />
              <span>Prepare compliance action plan for missing items</span>
            </li>
          </>
        ) : (
          <>
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-red-500" />
              <span>Immediate documentation review required (within 48 hours)</span>
            </li>
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-red-500" />
              <span>Schedule urgent client meeting to address violations</span>
            </li>
            <li className="text-xs flex items-start gap-1">
              <FileText className="h-3 w-3 mt-0.5 text-red-500" />
              <span>Prepare regulatory response plan with legal review</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
