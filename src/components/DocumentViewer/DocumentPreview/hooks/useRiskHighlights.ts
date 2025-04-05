
import { useState, useRef, useEffect, useCallback } from 'react';
import { Risk } from '../../types';
import { toast } from 'sonner';

interface UseRiskHighlightsReturn {
  documentContainerRef: React.RefObject<HTMLDivElement>;
  documentDimensions: { width: number; height: number };
  handleRiskClick: (riskId: string) => void;
  highlightRisks: Risk[];
  updateDocumentDimensions: () => void;
}

export const useRiskHighlights = (
  documentId: string, 
  risks: Risk[], 
  onRiskSelect?: (riskId: string) => void
): UseRiskHighlightsReturn => {
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const [documentDimensions, setDocumentDimensions] = useState({ width: 800, height: 1200 });
  const [highlightRisks, setHighlightRisks] = useState<Risk[]>(risks);
  const lastScrollPosition = useRef(0);
  
  // Measure the document container size for proper positioning
  const updateDocumentDimensions = useCallback(() => {
    if (documentContainerRef.current) {
      const { width, height } = documentContainerRef.current.getBoundingClientRect();
      
      // Only update if the dimensions have actually changed significantly
      setDocumentDimensions(prev => {
        if (Math.abs(prev.width - width) > 2 || Math.abs(prev.height - height) > 2) {
          return { width, height };
        }
        return prev;
      });
    }
  }, []);
  
  useEffect(() => {
    // Initial measure
    updateDocumentDimensions();
    
    // Re-measure on window resize
    window.addEventListener('resize', updateDocumentDimensions);
    
    // Handle scroll events to maintain highlight positions
    const handleScroll = () => {
      if (documentContainerRef.current) {
        // Track scroll position to help stabilize highlights
        lastScrollPosition.current = documentContainerRef.current.scrollTop;
      }
    };
    
    // Add scroll event listener
    if (documentContainerRef.current) {
      documentContainerRef.current.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Set up a periodic check for when the PDF might load and change the container size
    const checkDimensions = () => {
      updateDocumentDimensions();
    };
    
    // Check dimensions more frequently initially, then less often
    const initialIntervals = [100, 200, 500, 1000, 2000];
    const checkTimeouts = initialIntervals.map((delay, index) => 
      setTimeout(checkDimensions, delay)
    );
    
    // More consistent checking to ensure stability
    const intervalId = setInterval(checkDimensions, 2000);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateDocumentDimensions);
      checkTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
      clearInterval(intervalId);
      
      if (documentContainerRef.current) {
        documentContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [documentId, updateDocumentDimensions]);
  
  // Set up predefined risks for Form 47 if we're looking at that document
  useEffect(() => {
    if (documentId === 'form47') {
      // Create specific risks for Form 47 according to the user's specifications
      const form47Risks: Risk[] = [
        {
          type: "Missing Administrator Certificate",
          description: "Administrator Certificate missing — required by BIA at the top of the form.",
          severity: "high",
          regulation: "Bankruptcy and Insolvency Act",
          solution: "Add administrator certificate at the top of the form",
          deadline: "Immediately"
        },
        {
          type: "Missing Creditor Information",
          description: "No creditor details in Section 4 'payments be made to Jane and Fince Group' line.",
          severity: "high",
          regulation: "Bankruptcy and Insolvency Act s.66",
          solution: "Fill in the creditor name in the payment section",
          deadline: "24 hours"
        },
        {
          type: "Unspecified Dividend Distribution",
          description: "No dividend distribution method outlined in the 'Describe the manner for distributing dividends' section.",
          severity: "medium",
          regulation: "BIA Directive s.13",
          solution: "Specify the dividend distribution methodology",
          deadline: "3 days"
        },
        {
          type: "Unfilled Witness Signature",
          description: "Witness signature line is empty - required for legal validation.",
          severity: "medium",
          regulation: "BIA Directive s.22",
          solution: "Obtain witness signature",
          deadline: "48 hours"
        },
        {
          type: "Missing Proposal Terms in Preferred Claims Section",
          description: "Section 2/3 missing required proposal terms for handling preferred claims.",
          severity: "high",
          regulation: "BIA s.66.13(2)(b)",
          solution: "Add required terms regarding treatment of preferred claims",
          deadline: "24 hours"
        }
      ];
      
      setHighlightRisks(form47Risks);
    } else {
      setHighlightRisks(risks);
    }
  }, [documentId, risks]);
  
  const handleRiskClick = (riskId: string) => {
    // Extract risk ID information to find the corresponding risk
    console.log("Risk clicked:", riskId);
    
    // Show a quick toast with the risk info
    let riskInfo: Risk | undefined;
    
    // Check if it's one of our predefined risks (risk-0, risk-1, etc.)
    const match = riskId.match(/risk-(\d+)/);
    if (match) {
      const index = parseInt(match[1], 10);
      if (!isNaN(index) && index < highlightRisks.length) {
        riskInfo = highlightRisks[index];
      }
    }
    
    if (riskInfo) {
      toast.info(`Selected risk: ${riskInfo.type}`, {
        description: riskInfo.description
      });
    } else {
      toast.info("Risk selected");
    }
    
    // Forward the selection to the parent component if provided
    if (onRiskSelect) {
      onRiskSelect(riskId);
    }
  };

  return {
    documentContainerRef,
    documentDimensions,
    handleRiskClick,
    highlightRisks,
    updateDocumentDimensions
  };
};
