
import { BookOpen } from 'lucide-react';
import { Risk } from "../types";

interface RiskItemContentProps {
  risk: Risk;
}

export const RiskItemContent = ({ risk }: RiskItemContentProps) => {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-xs font-medium mb-1">Description:</h4>
        <p className="text-xs text-muted-foreground">{risk.description}</p>
      </div>
      
      {risk.impact && (
        <div>
          <h4 className="text-xs font-medium mb-1">Impact:</h4>
          <p className="text-xs text-muted-foreground">{risk.impact}</p>
        </div>
      )}
      
      {risk.regulation && (
        <div className="flex items-start gap-2">
          <BookOpen className="h-4 w-4 text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-xs font-medium mb-1">Regulatory Reference:</h4>
            <p className="text-xs text-blue-600">{risk.regulation}</p>
          </div>
        </div>
      )}
      
      {risk.solution && (
        <div>
          <h4 className="text-xs font-medium mb-1">Recommended Solution:</h4>
          <p className="text-xs text-muted-foreground">{risk.solution}</p>
        </div>
      )}
    </div>
  );
};
