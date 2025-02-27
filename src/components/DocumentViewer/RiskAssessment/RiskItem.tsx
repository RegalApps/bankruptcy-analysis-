
import React, { useState } from "react";
import { 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Shield 
} from "lucide-react";
import { getSeverityColor, getSeverityBg } from "./utils";
import { Risk } from "./types";
import { Button } from "@/components/ui/button";
import { CreateTaskButton } from "./CreateTaskButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskItemProps {
  risk: Risk;
  documentId: string;
}

export const RiskItem: React.FC<RiskItemProps> = ({ risk, documentId }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getIcon = () => {
    switch (risk.severity) {
      case 'high':
        return <AlertOctagon className={`h-5 w-5 text-red-500`} />;
      case 'medium':
        return <AlertTriangle className={`h-5 w-5 text-yellow-500`} />;
      case 'low':
        return <CheckCircle className={`h-5 w-5 text-green-500`} />;
      default:
        return <Shield className={`h-5 w-5 text-gray-500`} />;
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${getSeverityBg(risk.severity)}`}>
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <h4 className="font-medium text-sm">{risk.type}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {risk.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSeverityColor(risk.severity)} bg-background/80`}>
            {risk.severity.toUpperCase()}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-3 pt-0 border-t border-background/20 space-y-3">
          <p className="text-sm">{risk.description}</p>
          
          {risk.regulation && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-muted-foreground">Regulation:</h5>
              <p className="text-xs bg-background/50 p-2 rounded">{risk.regulation}</p>
            </div>
          )}
          
          {risk.impact && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-muted-foreground">Impact:</h5>
              <p className="text-xs">{risk.impact}</p>
            </div>
          )}
          
          {risk.requiredAction && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-muted-foreground">Required Action:</h5>
              <p className="text-xs">{risk.requiredAction}</p>
            </div>
          )}
          
          {risk.solution && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-muted-foreground">Recommended Solution:</h5>
              <div className="text-xs bg-background/50 p-2 rounded">
                {risk.solution}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <CreateTaskButton 
                  documentId={documentId} 
                  title={`Address risk: ${risk.type}`}
                  description={`${risk.description}\n\nRequired action: ${risk.requiredAction || 'Review and address the identified risk.'}`}
                  priority={risk.severity === 'high' ? 'high' : 
                           risk.severity === 'medium' ? 'medium' : 'low'}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a task for this risk</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};
