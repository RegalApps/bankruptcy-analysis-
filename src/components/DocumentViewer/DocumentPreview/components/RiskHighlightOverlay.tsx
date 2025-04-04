
import React, { useState } from "react";
import { Risk } from "../../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
}

export const RiskHighlightOverlay: React.FC<RiskHighlightProps> = ({
  risks,
  documentWidth,
  documentHeight,
  onRiskClick
}) => {
  const [hoveredRisk, setHoveredRisk] = useState<string | null>(null);
  const [filteredSeverity, setFilteredSeverity] = useState<string | null>(null);
  
  // Mock positions - in a real implementation, these would come from document analysis
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
      severity: risk.severity,
      label: risk.type || "Issue",
      description: risk.description || "Potential issue detected"
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
                <div className="absolute -top-6 left-0 text-xs font-medium px-2 py-0.5 rounded"
                  style={{ backgroundColor: getSeverityBorder(position.severity), color: 'white' }}>
                  {position.label}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="font-medium">{position.label}</p>
              <p className="text-xs text-muted-foreground">{position.description}</p>
              <p className="text-xs mt-1">Click to see details and fix</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      
      {/* Risk Legend */}
      <div className="absolute bottom-4 right-4 bg-background/90 border rounded-lg shadow-md p-2 flex items-center gap-2 pointer-events-auto">
        <span className="text-xs font-medium">Filter:</span>
        <button
          className={`w-5 h-5 rounded-full flex items-center justify-center bg-red-500 ${filteredSeverity === 'high' ? 'ring-2 ring-red-200' : ''}`}
          onClick={() => handleFilterSeverity('high')}
          title="High Risk"
        />
        <button
          className={`w-5 h-5 rounded-full flex items-center justify-center bg-amber-500 ${filteredSeverity === 'medium' ? 'ring-2 ring-amber-200' : ''}`}
          onClick={() => handleFilterSeverity('medium')}
          title="Medium Risk"
        />
        <button
          className={`w-5 h-5 rounded-full flex items-center justify-center bg-green-500 ${filteredSeverity === 'low' ? 'ring-2 ring-green-200' : ''}`}
          onClick={() => handleFilterSeverity('low')}
          title="Low Risk"
        />
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
