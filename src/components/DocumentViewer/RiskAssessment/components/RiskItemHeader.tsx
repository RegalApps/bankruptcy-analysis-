
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from 'lucide-react';
import { getSeverityIcon, getSeverityText } from "../utils/severityUtils";
import { Risk } from "../types";

interface RiskItemHeaderProps {
  risk: Risk;
  isExpanded: boolean;
  toggleExpand: () => void;
}

export const RiskItemHeader = ({ risk, isExpanded, toggleExpand }: RiskItemHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-2">
        {getSeverityIcon(risk.severity)}
        <div>
          <CardTitle className={`text-sm ${getSeverityText(risk.severity)}`}>
            {risk.type}
          </CardTitle>
          <CardDescription className="text-xs mt-1 line-clamp-2">
            {risk.description}
          </CardDescription>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 h-auto"
        onClick={toggleExpand}
      >
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </div>
  );
};
