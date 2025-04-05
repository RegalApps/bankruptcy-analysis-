
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
  containerRef?: React.RefObject<HTMLDivElement>;
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
  activeRiskId,
  containerRef
}) => {
  const [hoveredRisk, setHoveredRisk] = useState<string | null>(null);
  const [filteredSeverity, setFilteredSeverity] = useState<string | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [animatedRiskId, setAnimatedRiskId] = useState<string | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef?.current) {
        setScrollOffset(containerRef.current.scrollTop);
      }
    };
    
    const container = containerRef?.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [containerRef]);

  // Add animation effect when a new risk is selected
  useEffect(() => {
    if (activeRiskId) {
      setAnimatedRiskId(activeRiskId);
      const timer = setTimeout(() => {
        setAnimatedRiskId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeRiskId]);
  
  const getPrecisePositionForRisk = (risk: Risk, index: number): RiskPosition | null => {
    // Calculate page heights - adjust this based on your specific document
    const pageHeight = documentHeight / 3;
    
    // Precise Y coordinates for different sections based on Form 47
    // These coordinates are specifically tuned for the Form 47 document
    const adminCertY = 120; // Top of document
    const creditorInfoY = 520; // Section 4, around "Jane and Fince Group" line
    const preferredClaimsY = 320; // Section 2/3, for proposal terms
    const dividendsY = pageHeight + 150; // Page 2, dividend distribution
    const additionalTermsY = pageHeight + 280; // Page 2, additional terms
    const signatureY = pageHeight * 2 + 340; // Page 3, signature area
    const witnessY = pageHeight * 2 + 380; // Page 3, witness signature area
    
    // Each risk type has specific position on the document
    if (risk.type?.includes("Administrator Certificate") || risk.description?.includes("Administrator Certificate")) {
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.03,
        y: adminCertY,
        width: documentWidth * 0.94,
        height: 60,
        severity: risk.severity || 'high',
        label: risk.type || "Missing Certificate",
        description: "Administrator Certificate missing — required by BIA at the top of the form.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 1
      };
    } 
    else if (risk.type?.includes("Creditor Information") || risk.description?.includes("creditor")) {
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.05,
        y: creditorInfoY,
        width: documentWidth * 0.9,
        height: 25,
        severity: risk.severity || 'high',
        label: risk.type || "Missing Creditor Info",
        description: "No creditor details in Section 4 'payments be made to Jane and Fince Group' line.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 1
      };
    }
    else if (risk.type?.includes("Proposal Terms") || risk.description?.includes("Preferred Claims")) {
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.05,
        y: preferredClaimsY,
        width: documentWidth * 0.9,
        height: 40,
        severity: risk.severity || 'high',
        label: risk.type || "Missing Proposal Terms",
        description: "Section 2/3 missing required proposal terms for handling preferred claims.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 1
      };
    }
    else if (risk.type?.includes("Dividend") || risk.description?.includes("dividend")) {
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.1,
        y: dividendsY,
        width: documentWidth * 0.8,
        height: 35,
        severity: risk.severity || 'medium',
        label: risk.type || "Dividend Distribution",
        description: "No dividend distribution method outlined in the 'Describe the manner for distributing dividends' section.",
        regulation: risk.regulation,
        solution: risk.solution,
        pageNumber: 2
      };
    }
    else if (risk.type?.includes("Terms") || risk.description?.includes("terms")) {
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.1, 
        y: additionalTermsY,
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
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.6,
        y: signatureY,
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
      return {
        id: `risk-${index}`,
        x: documentWidth * 0.2,
        y: witnessY,
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
    
    // Fallback position calculation for other risks
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    };

    const riskHash = hashCode(risk.type + (risk.description || ''));
    
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
  
  const riskPositions: RiskPosition[] = risks
    .map((risk, index) => getPrecisePositionForRisk(risk, index))
    .filter((position): position is RiskPosition => position !== null);
  
  const applyAutoSpacing = (positions: RiskPosition[]): RiskPosition[] => {
    const sorted = [...positions].sort((a, b) => {
      if ((a.pageNumber || 1) !== (b.pageNumber || 1)) {
        return (a.pageNumber || 1) - (b.pageNumber || 1);
      }
      return a.y - b.y;
    });
    
    const minVerticalSpace = 35; // Increased to prevent label overlap
    
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const prev = sorted[i - 1];
      
      if ((current.pageNumber || 1) === (prev.pageNumber || 1)) {
        // Check if current risk's position (including its label space) overlaps with previous risk
        // We need to account for the label that appears above the highlight box
        const prevBottom = prev.y + prev.height;
        const prevLabelBottom = prev.y - 25; // Labels are typically positioned above the box
        
        if (current.y < prevBottom + minVerticalSpace || 
            (current.y - 25 < prevBottom && current.y > prevLabelBottom)) {
          current.y = prevBottom + minVerticalSpace;
        }
      }
    }
    
    return sorted;
  };
  
  const adjustedRiskPositions = applyAutoSpacing(riskPositions);
  
  const getSeverityColor = (severity: string, isActive: boolean, isHovered: boolean, isAnimated: boolean): string => {
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
  
  const handleFilterSeverity = (severity: string | null) => {
    setFilteredSeverity(filteredSeverity === severity ? null : severity);
  };
  
  const filteredPositions = filteredSeverity 
    ? adjustedRiskPositions.filter(pos => pos.severity === filteredSeverity)
    : adjustedRiskPositions;

  // Add a vertical minimap on the right for page navigation
  const renderPageMinimap = () => {
    // Get the number of unique pages
    const uniquePages = new Set(filteredPositions.map(pos => pos.pageNumber || 1));
    const numberOfPages = Math.max(...Array.from(uniquePages));
    
    return (
      <div className="absolute right-0.5 top-1/4 bottom-1/4 w-4 flex flex-col justify-between py-4 bg-background/20 rounded-l-md">
        {Array.from({ length: numberOfPages }, (_, i) => i + 1).map((pageNum) => {
          const hasRisks = filteredPositions.some(pos => (pos.pageNumber || 1) === pageNum);
          
          return (
            <button 
              key={`page-${pageNum}`}
              className={`w-4 h-4 flex items-center justify-center text-[8px] mb-1 hover:bg-primary/20 rounded-full ${hasRisks ? 'bg-primary/40' : 'bg-muted/40'}`}
              onClick={() => {
                if (containerRef?.current) {
                  // Scroll to the approximate position of the page
                  const pagePosition = (pageNum - 1) * (documentHeight / 3);
                  containerRef.current.scrollTo({
                    top: pagePosition,
                    behavior: 'smooth'
                  });
                }
              }}
              title={`Page ${pageNum}`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {filteredPositions.map((position) => {
        const isActive = activeRiskId === position.id;
        const isHovered = hoveredRisk === position.id;
        const isAnimated = animatedRiskId === position.id;
        
        // Calculate the absolute position for the highlight based on scroll offset
        // This ensures the highlight stays with the document content when scrolling
        const absoluteY = position.y - scrollOffset;
        
        // Only render if the highlight is within the viewport (with some buffer)
        const isVisible = absoluteY > -100 && absoluteY < documentHeight + 100;
        
        if (!isVisible) return null;
        
        return (
          <TooltipProvider key={position.id}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div
                  className={`absolute rounded border pointer-events-auto transition-all duration-300 ${
                    isAnimated ? 'animate-pulse' : ''
                  } ${isActive ? 'ring-2 ring-white shadow-lg z-20 scale-105' : 'z-10'}`}
                  style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${position.width}px`,
                    height: `${position.height}px`,
                    backgroundColor: getSeverityColor(position.severity, isActive, isHovered, isAnimated),
                    borderColor: getSeverityBorder(position.severity),
                    borderWidth: isActive || isHovered ? '2px' : '1px',
                  }}
                  onMouseEnter={() => setHoveredRisk(position.id)}
                  onMouseLeave={() => setHoveredRisk(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRiskClick(position.id);
                  }}
                >
                  <div 
                    className={`absolute -top-6 left-0 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1 shadow-sm transition-opacity duration-200 ${
                      (isHovered || isActive) ? 'opacity-100' : 'opacity-90'
                    }`}
                    style={{ backgroundColor: getSeverityBorder(position.severity), color: 'white' }}
                  >
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
      
      {renderPageMinimap()}

      <div className="absolute bottom-4 right-12 bg-white/90 border rounded-lg shadow-md p-2 flex items-center gap-2 pointer-events-auto">
        <span className="text-xs font-medium">Risk Filter:</span>
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

      <div className="absolute bottom-4 left-4 bg-white/90 border rounded-lg shadow-md py-1.5 px-3 text-xs font-medium pointer-events-auto">
        Page Legend: Risk Icons on Pages 
        {Array.from(new Set(adjustedRiskPositions.map(p => p.pageNumber || 1))).sort().join(', ')}
      </div>
    </div>
  );
};
