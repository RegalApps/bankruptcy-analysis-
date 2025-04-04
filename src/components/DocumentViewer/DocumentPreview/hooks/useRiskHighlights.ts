
import { useState, useRef, useEffect } from "react";
import { Risk } from "../../types";

export const useRiskHighlights = (documentId: string, risks: Risk[] = []) => {
  const [documentDimensions, setDocumentDimensions] = useState({ width: 0, height: 0 });
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const documentContainerRef = useRef<HTMLDivElement>(null);
  
  // Update document dimensions when the container size changes
  useEffect(() => {
    if (!documentContainerRef.current) return;
    
    const updateDimensions = () => {
      if (documentContainerRef.current) {
        setDocumentDimensions({
          width: documentContainerRef.current.clientWidth,
          height: documentContainerRef.current.clientHeight
        });
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Set up resize observer to update dimensions when container resizes
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(documentContainerRef.current);
    
    return () => {
      if (documentContainerRef.current) {
        resizeObserver.unobserve(documentContainerRef.current);
      }
    };
  }, []);
  
  // Handle clicking on a risk highlight
  const handleRiskClick = (riskId: string) => {
    setSelectedRiskId(riskId);
    // Extract the risk index from the ID format "risk-{index}-{type}"
    const riskIndex = riskId.split('-')[1];
    if (riskIndex && risks[parseInt(riskIndex)]) {
      // This event can be listened to by the parent to scroll to the risk details
      const event = new CustomEvent('riskSelected', { 
        detail: { risk: risks[parseInt(riskIndex)] }
      });
      window.dispatchEvent(event);
    }
  };
  
  return {
    documentContainerRef,
    documentDimensions,
    selectedRiskId,
    handleRiskClick
  };
};
