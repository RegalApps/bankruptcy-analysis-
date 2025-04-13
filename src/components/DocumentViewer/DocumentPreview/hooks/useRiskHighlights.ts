
import { useRef, useState, useCallback, useEffect } from 'react';
import { Risk } from '../../RiskAssessment/types';

interface DocumentDimensions {
  width: number;
  height: number;
  top: number;
  left: number;
}

interface RiskHighlight extends Risk {
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const useRiskHighlights = (documentId: string, risks: Risk[] = [], onRiskSelect?: (riskId: string) => void) => {
  const documentContainerRef = useRef<HTMLDivElement | null>(null);
  const [documentDimensions, setDocumentDimensions] = useState<DocumentDimensions>({ width: 0, height: 0, top: 0, left: 0 });
  const [highlightRisks, setHighlightRisks] = useState<RiskHighlight[]>([]);

  const updateDocumentDimensions = useCallback(() => {
    if (documentContainerRef.current) {
      const rect = documentContainerRef.current.getBoundingClientRect();
      setDocumentDimensions({
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      });
    }
  }, []);

  useEffect(() => {
    // Filter risks that have position data
    const risksWithPosition = risks
      .filter(risk => 'position' in risk && risk.position)
      .map(risk => ({
        ...risk,
        position: risk.position
      }));

    setHighlightRisks(risksWithPosition as RiskHighlight[]);
  }, [risks]);

  useEffect(() => {
    updateDocumentDimensions();
    
    const handleResize = () => {
      updateDocumentDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateDocumentDimensions]);

  const handleRiskClick = useCallback((risk: RiskHighlight) => {
    if (onRiskSelect && risk.type) {
      onRiskSelect(risk.type);
    }
  }, [onRiskSelect]);

  return {
    documentContainerRef,
    documentDimensions,
    highlightRisks,
    handleRiskClick,
    updateDocumentDimensions
  };
};
