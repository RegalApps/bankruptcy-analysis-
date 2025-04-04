
import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Info, 
  CheckCircle2,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Risk } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';

interface RiskAssessmentProps {
  risks: Risk[];
  documentId: string;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ 
  risks, 
  documentId,
  activeRiskId,
  onRiskSelect = () => {}
}) => {
  if (!risks || risks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
        <h3 className="text-lg font-medium mb-2">No Risks Detected</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          This document appears to be compliant with the relevant regulations.
        </p>
      </div>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
            Info
          </span>
        );
    }
  };

  const isRiskActive = (index: number, risk: Risk) => {
    const riskId = `risk-${index}-${risk.type}`;
    return activeRiskId === riskId;
  }

  const handleRiskClick = (index: number, risk: Risk) => {
    const riskId = `risk-${index}-${risk.type}`;
    onRiskSelect(riskId);
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Risk Assessment</h3>
          <span className="text-xs text-muted-foreground">
            {risks.length} {risks.length === 1 ? 'issue' : 'issues'} detected
          </span>
        </div>
        
        <div className="space-y-4">
          {risks.map((risk, index) => {
            const isActive = isRiskActive(index, risk);
            
            return (
              <div key={`${risk.type}-${index}`} 
                className={`p-3 rounded-lg border ${isActive 
                  ? 'bg-primary/5 border-primary/40 shadow-sm ring-1 ring-primary/20' 
                  : 'bg-muted/10 hover:bg-muted/20 cursor-pointer'}`}
                onClick={() => handleRiskClick(index, risk)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(risk.severity)}
                    <h4 className="font-medium text-sm">{risk.type}</h4>
                  </div>
                  {getSeverityBadge(risk.severity)}
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">{risk.description}</p>
                
                {risk.regulation && (
                  <div className="mb-2">
                    <span className="text-xs font-medium">Regulation:</span>
                    <span className="text-xs ml-2 text-muted-foreground">{risk.regulation}</span>
                  </div>
                )}
                
                {(risk.impact || risk.requiredAction) && (
                  <div className="mb-2 p-2 bg-muted rounded-md">
                    {risk.impact && (
                      <div className="mb-1">
                        <span className="text-xs font-medium">Impact:</span>
                        <span className="text-xs ml-2 text-muted-foreground">{risk.impact}</span>
                      </div>
                    )}
                    
                    {risk.requiredAction && (
                      <div>
                        <span className="text-xs font-medium">Required Action:</span>
                        <span className="text-xs ml-2 text-muted-foreground">{risk.requiredAction}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {risk.solution && (
                  <div className="mb-3">
                    <span className="text-xs font-medium">Recommended Solution:</span>
                    <p className="text-xs mt-1 p-2 rounded bg-green-50 text-green-700">{risk.solution}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t">
                  {risk.deadline && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Due: {risk.deadline}
                    </div>
                  )}
                  
                  <Button size="sm" className="text-xs" variant="secondary">
                    <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
                    Assign Task
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};
