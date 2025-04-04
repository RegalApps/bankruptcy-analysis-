
import { useState, useRef, useEffect } from "react";
import { Risk } from "../../types";
import { toast } from "sonner";

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
      const risk = risks[parseInt(riskIndex)];
      
      // Show toast notification about the risk
      toast.info(`Risk Selected: ${risk.type}`, {
        description: `Severity: ${risk.severity}. ${risk.description?.substring(0, 100)}...`,
        duration: 3000,
      });
      
      // Dispatch custom event for other components to respond to
      const event = new CustomEvent('riskSelected', { 
        detail: { risk, riskId }
      });
      window.dispatchEvent(event);
      
      // If there's a "rightPanel" element, scroll to the risk section
      setTimeout(() => {
        const riskSection = document.getElementById(`risk-detail-${riskId}`);
        if (riskSection) {
          riskSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          riskSection.classList.add('highlight-pulse');
          setTimeout(() => {
            riskSection.classList.remove('highlight-pulse');
          }, 2000);
        } else {
          // Try to find the right panel and scroll to top
          const rightPanel = document.querySelector('[data-panel="right-panel"]');
          if (rightPanel) {
            rightPanel.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }, 100);
    }
  };
  
  const getRiskById = (riskId: string) => {
    const riskIndex = riskId.split('-')[1];
    return riskIndex && risks[parseInt(riskIndex)] ? risks[parseInt(riskIndex)] : null;
  };
  
  return {
    documentContainerRef,
    documentDimensions,
    selectedRiskId,
    handleRiskClick,
    getRiskById
  };
};
