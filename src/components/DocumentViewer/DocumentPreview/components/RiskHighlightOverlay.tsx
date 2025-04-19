
import React from "react";
import { Risk } from "../../RiskAssessment/types";

interface RiskHighlightOverlayProps {
  risks: Risk[];
  documentWidth: number;
  documentHeight: number;
  onRiskClick: (riskId: string) => void;
  activeRiskId?: string | null;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const RiskHighlightOverlay: React.FC<RiskHighlightOverlayProps> = ({
  risks,
  documentWidth,
  documentHeight,
  onRiskClick,
  activeRiskId,
  containerRef,
}) => {
  // Special case for GreenTech Supplies Form 31
  const isGreenTechForm31 = risks.some(risk => 
    risk.description?.toLowerCase().includes('greentech') || 
    ((risk.metadata && risk.metadata.clientName) || '').toLowerCase().includes('greentech'));

  const getHighlightPositions = () => {
    if (isGreenTechForm31) {
      // Pre-defined positions for GreenTech Form 31
      return [
        // Section 4 - Claim Category (High Risk)
        {
          id: "risk-0",
          top: documentHeight * 0.35, 
          left: documentWidth * 0.15,
          width: documentWidth * 0.7,
          height: documentHeight * 0.08,
          border: '2px dashed #ff4444',
          risk: risks.find(r => r.description?.includes('Missing Checkbox Selections')) || risks[0],
        },
        // Section 5 - Relatedness (High Risk)
        {
          id: "risk-1",
          top: documentHeight * 0.45,
          left: documentWidth * 0.15,
          width: documentWidth * 0.7,
          height: documentHeight * 0.08,
          border: '2px dashed #ff4444',
          risk: risks.find(r => r.description?.includes('Relatedness')) || risks[1],
        },
        // Section 6 - Transfers (High Risk)
        {
          id: "risk-2",
          top: documentHeight * 0.55,
          left: documentWidth * 0.15,
          width: documentWidth * 0.7,
          height: documentHeight * 0.08, 
          border: '2px dashed #ff4444',
          risk: risks.find(r => r.description?.includes('Disclosure of Transfers')) || risks[2],
        },
        // Date Format (Medium Risk)
        {
          id: "risk-3",
          top: documentHeight * 0.7,
          left: documentWidth * 0.2,
          width: documentWidth * 0.5,
          height: documentHeight * 0.05,
          border: '2px dashed #ff9900',
          risk: risks.find(r => r.description?.includes('Date Format')) || risks[3],
        },
        // Trustee Declaration (Medium Risk)
        {
          id: "risk-4",
          top: documentHeight * 0.78,
          left: documentWidth * 0.1,
          width: documentWidth * 0.8,
          height: documentHeight * 0.07,
          border: '2px dashed #ff9900',
          risk: risks.find(r => r.description?.includes('Trustee Declaration')) || risks[4],
        }
      ];
    }

    // For other documents or if not GreenTech Form 31
    return risks.map((risk, index) => {
      // Default spacing for general risk highlights
      const verticalSpacing = documentHeight / (risks.length + 1);
      return {
        id: `risk-${index}`,
        top: verticalSpacing * (index + 1) - 30,
        left: documentWidth * 0.1,
        width: documentWidth * 0.8,
        height: 60,
        border: `2px dashed ${
          risk.severity === 'high'
            ? '#ff4444'
            : risk.severity === 'medium'
            ? '#ff9900'
            : '#44aa44'
        }`,
        risk
      };
    });
  };

  const highlights = getHighlightPositions();

  return (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 50 }}
    >
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          id={highlight.id}
          className="absolute cursor-pointer pointer-events-auto transition-opacity duration-300"
          style={{
            top: highlight.top,
            left: highlight.left,
            width: highlight.width,
            height: highlight.height,
            border: highlight.border,
            backgroundColor: `${
              highlight.risk.severity === 'high'
                ? 'rgba(255, 68, 68, 0.1)'
                : highlight.risk.severity === 'medium'
                ? 'rgba(255, 153, 0, 0.1)'
                : 'rgba(68, 170, 68, 0.1)'
            }`,
            boxShadow: activeRiskId === highlight.id
              ? `0 0 0 2px ${
                  highlight.risk.severity === 'high'
                    ? '#ff4444'
                    : highlight.risk.severity === 'medium'
                    ? '#ff9900'
                    : '#44aa44'
                }`
              : 'none',
            opacity: activeRiskId && activeRiskId !== highlight.id ? 0.3 : 0.8,
            transition: 'opacity 0.3s, box-shadow 0.3s',
            zIndex: activeRiskId === highlight.id ? 52 : 51,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onRiskClick(highlight.id);
          }}
        >
          <div 
            className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-xs font-medium text-white"
            style={{
              backgroundColor: highlight.risk.severity === 'high'
                ? '#ff4444'
                : highlight.risk.severity === 'medium'
                ? '#ff9900'
                : '#44aa44',
              zIndex: 53
            }}
          >
            {highlight.risk.severity.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
};
