
import { useState, useRef, useEffect } from 'react';
import { Risk } from '../../types';
import { toast } from 'sonner';

interface UseRiskHighlightsReturn {
  documentContainerRef: React.RefObject<HTMLDivElement>;
  documentDimensions: { width: number; height: number };
  handleRiskClick: (riskId: string) => void;
}

export const useRiskHighlights = (documentId: string, risks: Risk[]): UseRiskHighlightsReturn => {
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const [documentDimensions, setDocumentDimensions] = useState({ width: 800, height: 1200 });
  
  // Measure the document container size for proper positioning
  useEffect(() => {
    const updateDimensions = () => {
      if (documentContainerRef.current) {
        const { width, height } = documentContainerRef.current.getBoundingClientRect();
        setDocumentDimensions({ width, height });
      }
    };

    // Initial measure
    updateDimensions();
    
    // Re-measure on window resize
    window.addEventListener('resize', updateDimensions);
    
    // Set up a periodic check for when the PDF might load and change the container size
    const intervalId = setInterval(updateDimensions, 1000);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearInterval(intervalId);
    };
  }, [documentId]);
  
  const handleRiskClick = (riskId: string) => {
    // Extract risk details from the risk ID
    const parts = riskId.split('-');
    const riskIndex = parseInt(parts[1], 10);
    
    if (isNaN(riskIndex) || riskIndex >= risks.length) {
      toast.error("Could not find risk details");
      return;
    }
    
    const risk = risks[riskIndex];
    toast.info(`Selected risk: ${risk.type}`, {
      description: risk.description
    });
    
    // In a real app, this would scroll to the risk details in the right panel
    // or open a task creation modal
  };

  return {
    documentContainerRef,
    documentDimensions,
    handleRiskClick
  };
};
