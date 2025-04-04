
import React, { useState, useEffect } from "react";
import { Risk } from "../../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface RiskHighlightProps {
  risks: Risk[];
  documentWidth: number;
  documentHeight: number;
  onRiskClick: (riskId: string) => void;
  activeRiskId: string | null;
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
  pageNumber?: number;
}

export const RiskHighlightOverlay: React.FC<RiskHighlightProps> = ({
  risks,
  documentWidth,
  documentHeight,
  onRiskClick,
  activeRiskId
}) => {
  const [hoveredRisk, setHoveredRisk] = useState<string | null>(null);
  const [filteredSeverity, setFilteredSeverity] = useState<string | null>(null);
  
  // Define precise positions for Form 47 highlights based on user specifications
  const getPrecisePositionForRisk = (risk: Risk, index: number): RiskPosition | null => {
    // Calculate vertical positions based on document height
    // Each page is approximately 1/3 of the total document height for a 3-page form
    const pageHeight = documentHeight / 3;
    const page1Y = pageHeight * 0.15; // Top area of page 1
    const page1MidY = pageHeight * 0.4; // Middle area of page 1
    const page1LowerY = pageHeight * 0.6; // Lower area of page 1
    const page2Y = pageHeight + pageHeight * 0.3; // Middle of page 2
    const page2LowerY = pageHeight + pageHeight * 0.7; // Lower part of page 2
    const page3Y = pageHeight * 2 + pageHeight * 0.85; // Bottom area of page 3
    
    // We're using a combination of risk type and form field identification
    if (risk.type?.includes("Administrator Certificate") || risk.description?.includes("Administrator Certificate")) {
      // Place above "Consumer Proposal" section and near signature block
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.15,
        y: page1Y,
        width: documentWidth * 0.7,
        height: 35,
        severity: risk.severity || 'high',
        label: risk.type || "Missing Certificate",
        description: "Administrator Certificate missing — required by BIA.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 1
      };
    } 
    else if (risk.type?.includes("Creditor Information") || risk.description?.includes("creditor")) {
      // Highlight the section "That the following payments be made to ______, the administrator..."
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.1,
        y: page1MidY,
        width: documentWidth * 0.8,
        height: 30,
        severity: risk.severity || 'high',
        label: risk.type || "Missing Creditor Info",
        description: "No creditor details or beneficiary name present.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 1
      };
    }
    else if (risk.type?.includes("Payment Schedule") || risk.description?.includes("payment schedule")) {
      // Highlight the line: "Set out the schedule of payments and the total amount..."
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.1,
        y: page1LowerY,
        width: documentWidth * 0.8,
        height: 25,
        severity: risk.severity || 'medium',
        label: risk.type || "Payment Schedule",
        description: "Payment schedule not filled — required under 66.13(2)(c) of BIA.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 1
      };
    }
    else if (risk.type?.includes("Dividend") || risk.description?.includes("dividend")) {
      // Highlight: "Describe the manner for distributing dividends."
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.1,
        y: page2Y,
        width: documentWidth * 0.8,
        height: 35,
        severity: risk.severity || 'medium',
        label: risk.type || "Dividend Distribution",
        description: "No dividend distribution method outlined.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 2
      };
    }
    else if (risk.type?.includes("Terms") || risk.description?.includes("terms")) {
      // Highlight: "Set out the additional terms as proposed."
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.1, 
        y: page2LowerY,
        width: documentWidth * 0.8,
        height: 35,
        severity: risk.severity || 'medium',
        label: risk.type || "Additional Terms",
        description: "Optional field left blank — flag for administrator to confirm intent.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 2
      };
    }
    else if (risk.type?.includes("Unsigned") || risk.description?.includes("Consumer Debtor")) {
      // Highlight bottom right signature field labeled "Consumer Debtor"
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.6,
        y: page3Y,
        width: documentWidth * 0.3,
        height: 40,
        severity: risk.severity || 'high',
        label: risk.type || "Missing Signature",
        description: "Consumer Debtor signature missing — non-compliant submission.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 3
      };
    }
    else if (risk.type?.includes("Witness") || risk.description?.includes("witness")) {
      // Highlight the line left of "Consumer Debtor" for witness signature
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.2,
        y: page3Y,
        width: documentWidth * 0.3,
        height: 40,
        severity: risk.severity || 'medium',
        label: risk.type || "Witness Signature",
        description: "Witness signature required for legal validation.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 3
      };
    }
    
    // Fallback for any other risk types
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
      id: `risk-${index}`,
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
  };
  
  // Generate positions for all risks
  const riskPositions: RiskPosition[] = risks
    .map((risk, index) => getPrecisePositionForRisk(risk, index))
    .filter((position): position is RiskPosition => position !== null);
  
  const getSeverityColor = (severity: string, isActive: boolean, isHovered: boolean): string => {
    // Higher opacity for active/hovered items for better visibility
    const opacity = isActive ? '0.7' : (isHovered ? '0.5' : '0.3');
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
  
  // Filter highlights by severity when selected
  const handleFilterSeverity = (severity: string | null) => {
    setFilteredSeverity(filteredSeverity === severity ? null : severity);
  };
  
  const filteredPositions = filteredSeverity 
    ? riskPositions.filter(pos => pos.severity === filteredSeverity)
    : riskPositions;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Risk Highlights */}
      {filteredPositions.map((position) => {
        const isActive = activeRiskId === position.id;
        
        return (
          <TooltipProvider key={position.id}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div
                  className={`absolute rounded border-2 cursor-pointer pointer-events-auto transition-colors duration-200 ${isActive ? 'ring-2 ring-white' : ''}`}
                  style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${position.width}px`,
                    height: `${position.height}px`,
                    backgroundColor: getSeverityColor(position.severity, isActive, hoveredRisk === position.id),
                    borderColor: getSeverityBorder(position.severity),
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    zIndex: isActive ? 20 : 10,
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
        );
      })}
      
      {/* Risk Legend with toggleable filters */}
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
