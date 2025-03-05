
import { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  BookOpen
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RiskItemProps } from './types';
import { CreateTaskButton } from './CreateTaskButton';

export const RiskItem = ({ risk, documentId }: RiskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Determine severity-based styling
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-amber-50 border-amber-200';
      case 'low':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-muted border-muted-foreground';
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-700';
      case 'medium':
        return 'text-amber-700';
      case 'low':
        return 'text-yellow-700';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`${getSeverityColor(risk.severity)} border transition-all`}>
      <CardHeader className="py-3 px-4">
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
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="px-4 py-2 text-sm">
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
          </CardContent>
          
          <CardFooter className="px-4 py-2 flex justify-end">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CreateTaskButton 
                    risk={risk} 
                    documentId={documentId} 
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Create a task from this risk</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
