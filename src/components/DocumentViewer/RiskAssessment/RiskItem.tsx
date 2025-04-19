
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  Clock,
  BookOpen,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Risk } from "./types";
import { CreateTaskButton } from "./CreateTaskButton";

interface RiskItemProps {
  risk: Risk;
  documentId: string;
}

export const RiskItem = ({ risk, documentId }: RiskItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // Format risk severity with corresponding icon
  const getSeverityIcon = () => {
    switch (risk.severity) {
      case 'high':
        return <AlertOctagon className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getDeadlineString = () => {
    if (!risk.deadline) return null;
    
    // Handle different deadline formats
    if (risk.deadline.toLowerCase() === 'immediately') {
      return (
        <Badge variant="outline" className="text-red-500 border-red-200 flex items-center gap-1 ml-auto">
          <Clock className="h-3 w-3" />
          Immediate
        </Badge>
      );
    } else if (risk.deadline.toLowerCase().includes('day')) {
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-200 flex items-center gap-1 ml-auto">
          <Clock className="h-3 w-3" />
          {risk.deadline}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-muted-foreground border-muted flex items-center gap-1 ml-auto">
          <Clock className="h-3 w-3" />
          {risk.deadline}
        </Badge>
      );
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 bg-background shadow-sm hover:shadow-md transition-shadow"
          style={{
            borderLeftColor: risk.severity === 'high' 
              ? 'rgb(239 68 68)' 
              : risk.severity === 'medium' 
                ? 'rgb(245 158 11)' 
                : 'rgb(234 179 8)'
          }}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {getSeverityIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">{risk.type || "Unknown Risk"}</div>
              {getDeadlineString()}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{risk.description}</p>
            
            {expanded && (
              <div className="mt-3 space-y-2 text-sm">
                {risk.impact && (
                  <div className="flex gap-2">
                    <span className="font-medium">Impact:</span>
                    <span className="text-muted-foreground">{risk.impact}</span>
                  </div>
                )}
                
                {risk.requiredAction && (
                  <div className="flex gap-2">
                    <span className="font-medium">Required Action:</span>
                    <span className="text-muted-foreground">{risk.requiredAction}</span>
                  </div>
                )}
                
                {risk.solution && (
                  <div className="flex gap-2">
                    <span className="font-medium">Solution:</span>
                    <span className="text-muted-foreground">{risk.solution}</span>
                  </div>
                )}
                
                {risk.regulation && (
                  <div className="flex items-center gap-2 mt-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground rounded-full bg-muted px-2 py-1">
                          <BookOpen className="h-3 w-3" />
                          {risk.regulation}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Regulatory reference: {risk.regulation}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-2 flex justify-between items-center bg-muted/30">
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="text-xs">
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
        
        <CreateTaskButton documentId={documentId} risk={risk} />
      </CardFooter>
    </Card>
  );
};
