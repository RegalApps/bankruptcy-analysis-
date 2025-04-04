
import React, { useState } from "react";
import { Risk } from "../../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface RiskHighlightProps {
  risks: Risk[];
  documentWidth: number;
  documentHeight: number;
  onRiskClick: (riskId: string) => void;
}

interface RiskPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  severity: 'high' | 'medium' | 'low';
  label: string;
  description: string;
  regulation?: string;
  solution?: string;
  deadline?: string;
  priority?: string;
}

export const RiskHighlightOverlay: React.FC<RiskHighlightProps> = ({
  risks,
  documentWidth,
  documentHeight,
  onRiskClick
}) => {
  const [hoveredRisk, setHoveredRisk] = useState<string | null>(null);
  const [filteredSeverity, setFilteredSeverity] = useState<string | null>(null);
  
  // Generate deterministic positions based on risk properties
  const riskPositions: RiskPosition[] = risks.map((risk, index) => {
    // Deterministic but "random-looking" positions based on risk properties
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    };

    const riskHash = hashCode(risk.type + (risk.description || ''));
    
    // Generate a position based on the hash
    const x = Math.abs(riskHash % (documentWidth - 200)) + 50;
    const y = Math.abs((riskHash >> 8) % (documentHeight - 100)) + 50;
    const width = 100 + (Math.abs(riskHash) % 150);
    const height = 20 + (Math.abs(riskHash >> 4) % 30);

    return {
      id: `risk-${index}-${risk.type}`,
      x,
      y,
      width,
      height,
      severity: risk.severity || 'medium',
      label: risk.type || "Issue",
      description: risk.description || "Potential issue detected",
      regulation: risk.regulation,
      solution: risk.solution,
      deadline: risk.deadline || "7 days",
      priority: risk.severity === 'high' ? 'High' : risk.severity === 'medium' ? 'Medium' : 'Low'
    };
  });
  
  const getSeverityColor = (severity: string, isHovered: boolean): string => {
    const opacity = isHovered ? '0.5' : '0.25';
    switch (severity) {
      case 'high':
        return `rgba(239, 68, 68, ${opacity})`;
      case 'medium':
        return `rgba(245, 158, 11, ${opacity})`;
      case 'low':
        return `rgba(34, 197, 94, ${opacity})`;
      default:
        return `rgba(156, 163, 175, ${opacity})`;
    }
  };
  
  const getSeverityBorder = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'rgb(239, 68, 68)';
      case 'medium':
        return 'rgb(245, 158, 11)';
      case 'low':
        return 'rgb(34, 197, 94)';
      default:
        return 'rgb(156, 163, 175)';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-3 w-3 text-white" />;
      case 'medium':
        return <Info className="h-3 w-3 text-white" />;
      case 'low':
        return <CheckCircle2 className="h-3 w-3 text-white" />;
      default:
        return <Info className="h-3 w-3 text-white" />;
    }
  };
  
  const handleFilterSeverity = (severity: string | null) => {
    setFilteredSeverity(filteredSeverity === severity ? null : severity);
  };
  
  const filteredPositions = filteredSeverity 
    ? riskPositions.filter(pos => pos.severity === filteredSeverity)
    : riskPositions;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Risk Highlights */}
      {filteredPositions.map((position) => (
        <TooltipProvider key={position.id}>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div
                className="absolute rounded border-2 cursor-pointer pointer-events-auto transition-colors duration-200"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  width: `${position.width}px`,
                  height: `${position.height}px`,
                  backgroundColor: getSeverityColor(position.severity, hoveredRisk === position.id),
                  borderColor: getSeverityBorder(position.severity),
                }}
                onMouseEnter={() => setHoveredRisk(position.id)}
                onMouseLeave={() => setHoveredRisk(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onRiskClick(position.id);
                }}
              >
                <div className="absolute -top-6 left-0 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1"
                  style={{ backgroundColor: getSeverityBorder(position.severity), color: 'white' }}>
                  {getSeverityIcon(position.severity)}
                  {position.label}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs p-3 space-y-2 bg-white shadow-lg border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-semibold flex items-center gap-1">
                  {getSeverityIcon(position.severity)} 
                  {position.label}
                </h4>
                <p className="text-xs text-muted-foreground">{position.description}</p>
                {position.regulation && (
                  <p className="text-xs"><span className="font-medium">Regulation:</span> {position.regulation}</p>
                )}
                {position.solution && (
                  <p className="text-xs"><span className="font-medium">Recommended fix:</span> {position.solution}</p>
                )}
                <div className="flex justify-between text-xs pt-1">
                  <span><span className="font-medium">Priority:</span> {position.priority}</span>
                  <span><span className="font-medium">Due:</span> {position.deadline}</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onRiskClick(position.id);
                }}
              >
                Assign Task
              </Button>
              <p className="text-xs text-center mt-1">Click to see full details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      
      {/* Risk Legend */}
      <div className="absolute bottom-4 right-4 bg-background/90 border rounded-lg shadow-md p-2 flex items-center gap-2 pointer-events-auto">
        <span className="text-xs font-medium">Filter:</span>
        <button
          className={`w-6 h-6 rounded-full flex items-center justify-center bg-red-500 ${filteredSeverity === 'high' ? 'ring-2 ring-red-200' : ''}`}
          onClick={() => handleFilterSeverity('high')}
          title="High Risk"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-white" />
        </button>
        <button
          className={`w-6 h-6 rounded-full flex items-center justify-center bg-amber-500 ${filteredSeverity === 'medium' ? 'ring-2 ring-amber-200' : ''}`}
          onClick={() => handleFilterSeverity('medium')}
          title="Medium Risk"
        >
          <Info className="h-3.5 w-3.5 text-white" />
        </button>
        <button
          className={`w-6 h-6 rounded-full flex items-center justify-center bg-green-500 ${filteredSeverity === 'low' ? 'ring-2 ring-green-200' : ''}`}
          onClick={() => handleFilterSeverity('low')}
          title="Low Risk"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
        </button>
        {filteredSeverity && (
          <button
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setFilteredSeverity(null)}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
