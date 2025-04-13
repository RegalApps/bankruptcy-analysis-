
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Risk } from '../../RiskAssessment/types';

interface RiskHighlightWithPosition extends Risk {
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface RiskHighlightOverlayProps {
  risks: RiskHighlightWithPosition[];
  documentWidth: number;
  documentHeight: number;
  activeRiskId: string | null;
  onRiskClick: (risk: RiskHighlightWithPosition) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const RiskHighlightOverlay: React.FC<RiskHighlightOverlayProps> = ({
  risks,
  documentWidth,
  documentHeight,
  activeRiskId,
  onRiskClick,
  containerRef
}) => {
  const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition({
          top: containerRef.current.scrollTop,
          left: containerRef.current.scrollLeft
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [containerRef]);

  const getSeverityColor = (severity: 'high' | 'medium' | 'low' = 'medium') => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 border-red-500';
      case 'medium':
        return 'bg-amber-500/20 border-amber-500';
      case 'low':
        return 'bg-blue-500/20 border-blue-500';
      default:
        return 'bg-amber-500/20 border-amber-500';
    }
  };

  return (
    <div 
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        width: documentWidth,
        height: documentHeight
      }}
    >
      {risks.filter(risk => risk.position).map((risk, index) => {
        if (!risk.position) return null;
        
        const { x, y, width, height } = risk.position;
        const isActive = activeRiskId === risk.type;
        
        // Calculate positions relative to the document and adjust for scroll
        const left = (x * documentWidth) - scrollPosition.left;
        const top = (y * documentHeight) - scrollPosition.top;
        const highlightWidth = width * documentWidth;
        const highlightHeight = height * documentHeight;
        
        return (
          <div
            key={`risk-${index}-${risk.type}`}
            className={cn(
              'absolute border-2 rounded pointer-events-auto transition-all duration-200',
              getSeverityColor(risk.severity as 'high' | 'medium' | 'low'),
              isActive ? 'z-20 ring-2 ring-offset-2 ring-primary' : 'z-10 opacity-50 hover:opacity-100'
            )}
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${highlightWidth}px`,
              height: `${highlightHeight}px`,
            }}
            onClick={() => onRiskClick(risk)}
            title={risk.description || risk.type}
          />
        );
      })}
    </div>
  );
};
