import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Info, PlusCircle } from "lucide-react";
import { Risk } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RiskAssessmentProps {
  documentId: string;
  risks: Risk[];
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ documentId, risks }) => {
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [expandedRisks, setExpandedRisks] = useState<Record<string, boolean>>({});
  const [filteredSeverity, setFilteredSeverity] = useState<string | null>(null);
  
  useEffect(() => {
    const handleRiskSelected = (event: CustomEvent) => {
      const { risk, riskId } = event.detail;
      if (risk && riskId) {
        setSelectedRiskId(riskId);
        setExpandedRisks(prev => ({ ...prev, [riskId]: true }));
      }
    };
    
    window.addEventListener('riskSelected', handleRiskSelected as EventListener);
    
    return () => {
      window.removeEventListener('riskSelected', handleRiskSelected as EventListener);
    };
  }, []);
  
  const handleAssignTask = (risk: Risk) => {
    toast.success(`Task created for ${risk.type}`, {
      description: "Task has been added to your task list",
      duration: 3000,
    });
  };
  
  const toggleRiskExpand = (riskId: string) => {
    setExpandedRisks(prev => ({
      ...prev,
      [riskId]: !prev[riskId]
    }));
  };
  
  const handleFilterSeverity = (severity: string | null) => {
    setFilteredSeverity(severity === filteredSeverity ? null : severity);
  };
  
  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-100';
      case 'medium':
        return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'low':
        return 'text-green-500 bg-green-50 border-green-100';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };
  
  const filteredRisks = filteredSeverity 
    ? risks.filter(risk => risk.severity === filteredSeverity)
    : risks;

  return (
    <div className="h-full flex flex-col">
      <div className="border-b pb-3">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-medium">Risk Assessment</h3>
          <div className="flex items-center gap-1">
            <button
              className={cn("p-1 rounded-full", filteredSeverity === 'high' ? 'bg-red-100' : 'hover:bg-muted')}
              onClick={() => handleFilterSeverity('high')}
              title="High Risk"
            >
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </button>
            <button
              className={cn("p-1 rounded-full", filteredSeverity === 'medium' ? 'bg-amber-100' : 'hover:bg-muted')}
              onClick={() => handleFilterSeverity('medium')}
              title="Medium Risk"
            >
              <Info className="h-4 w-4 text-amber-500" />
            </button>
            <button
              className={cn("p-1 rounded-full", filteredSeverity === 'low' ? 'bg-green-100' : 'hover:bg-muted')}
              onClick={() => handleFilterSeverity('low')}
              title="Low Risk"
            >
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </button>
            {filteredSeverity && (
              <button
                className="p-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handleFilterSeverity(null)}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className="flex justify-between px-4">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
              High: {risks.filter(r => r.severity === 'high').length}
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
              Medium: {risks.filter(r => r.severity === 'medium').length}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
              Low: {risks.filter(r => r.severity === 'low').length}
            </Badge>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {filteredRisks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filteredSeverity 
                ? `No ${filteredSeverity} risk issues found` 
                : "No risk issues detected"}
            </div>
          ) : (
            filteredRisks.map((risk, index) => (
              <Card 
                key={`risk-${index}-${risk.type}`}
                id={`risk-detail-risk-${index}-${risk.type}`}
                className={cn(
                  "overflow-hidden transition-all duration-200 border",
                  selectedRiskId === `risk-${index}-${risk.type}` 
                    ? "ring-2 ring-primary ring-offset-2" 
                    : ""
                )}
              >
                <Collapsible
                  open={expandedRisks[`risk-${index}-${risk.type}`] || selectedRiskId === `risk-${index}-${risk.type}`}
                  onOpenChange={() => toggleRiskExpand(`risk-${index}-${risk.type}`)}
                >
                  <div className="flex items-start p-3 gap-3">
                    <div className="mt-0.5">
                      {getRiskIcon(risk.severity || 'medium')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{risk.type}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(risk.severity || 'medium')}>
                            {risk.severity?.charAt(0).toUpperCase() + risk.severity?.slice(1) || 'Medium'}
                          </Badge>
                          <CollapsibleTrigger className="p-1 hover:bg-muted rounded">
                            {expandedRisks[`risk-${index}-${risk.type}`] ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />}
                          </CollapsibleTrigger>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                    </div>
                  </div>
                  
                  <CollapsibleContent>
                    <Separator />
                    <div className="p-3 space-y-3 bg-muted/30">
                      {risk.regulation && (
                        <div>
                          <h5 className="text-xs font-medium mb-1">Regulation</h5>
                          <p className="text-sm">{risk.regulation}</p>
                        </div>
                      )}
                      
                      {risk.impact && (
                        <div>
                          <h5 className="text-xs font-medium mb-1">Impact</h5>
                          <p className="text-sm">{risk.impact}</p>
                        </div>
                      )}
                      
                      {risk.solution && (
                        <div>
                          <h5 className="text-xs font-medium mb-1">Recommended Fix</h5>
                          <p className="text-sm">{risk.solution}</p>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <Button 
                          size="sm"
                          className="w-full flex items-center"
                          onClick={() => handleAssignTask(risk)}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Assign Task
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      
      <style jsx global>{`
        .highlight-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1);
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.03);
            background-color: rgba(var(--primary-rgb), 0.1);
          }
        }
      `}</style>
    </div>
  );
};
