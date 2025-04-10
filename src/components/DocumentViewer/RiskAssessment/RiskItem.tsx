
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, CalendarClock } from "lucide-react";
import { Risk } from './types';

interface RiskItemProps {
  risk: Risk;
  documentId: string;
  isActive?: boolean;
  onSelect?: () => void;
}

export const RiskItem: React.FC<RiskItemProps> = ({ 
  risk, 
  documentId,
  isActive = false, 
  onSelect
}) => {
  const getSeverityIcon = () => {
    switch (risk.severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = () => {
    switch (risk.severity) {
      case 'high':
        return <Badge variant="destructive">Critical</Badge>;
      case 'medium':
        return <Badge variant="default">Moderate</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <Card 
      className={`
        cursor-pointer transition-all hover:bg-muted/30
        ${isActive ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'}
      `}
      onClick={handleClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getSeverityIcon()}
            <h5 className="text-sm font-medium">{risk.type}</h5>
          </div>
          {getSeverityBadge()}
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>

        {risk.regulation && (
          <p className="text-xs text-muted-foreground mb-2">
            <span className="font-medium">Regulation:</span> {risk.regulation}
          </p>
        )}
        
        {(risk.impact || risk.requiredAction) && (
          <div className="mb-2 p-2 bg-muted/50 rounded-md text-xs">
            {risk.impact && (
              <p className="mb-1">
                <span className="font-medium">Impact:</span> {risk.impact}
              </p>
            )}
            
            {risk.requiredAction && (
              <p>
                <span className="font-medium">Required Action:</span> {risk.requiredAction}
              </p>
            )}
          </div>
        )}
        
        {risk.deadline && (
          <div className="flex items-center text-xs text-muted-foreground mt-3">
            <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
            Due: {risk.deadline}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
