
import { useState, useRef, useEffect } from 'react';
import { Risk } from '../../types';
import { toast } from 'sonner';

interface UseRiskHighlightsReturn {
  documentContainerRef: React.RefObject<HTMLDivElement>;
  documentDimensions: { width: number; height: number };
  handleRiskClick: (riskId: string) => void;
  highlightRisks: Risk[];
}

export const useRiskHighlights = (
  documentId: string, 
  risks: Risk[], 
  onRiskSelect?: (riskId: string) => void
): UseRiskHighlightsReturn => {
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const [documentDimensions, setDocumentDimensions] = useState({ width: 800, height: 1200 });
  const [highlightRisks, setHighlightRisks] = useState<Risk[]>(risks);
  
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
          description: "No creditor details or beneficiary name present in Section 4 where payments are specified.",
          severity: "high",
          regulation: "Bankruptcy and Insolvency Act s.66",
          solution: "Fill in the creditor name in the payment section",
          deadline: "24 hours"
        },
        {
          type: "Incomplete Payment Schedule",
          description: "Payment schedule not filled in Section 4 below creditor information — required under 66.13(2)(c) of BIA.",
          severity: "medium",
          regulation: "BIA s.66.13(2)(c)",
          solution: "Complete the payment schedule section with dates and amounts",
          deadline: "48 hours"
        },
        {
          type: "Blank Distribution of Dividends",
          description: "No dividend distribution method outlined.",
          severity: "medium",
          regulation: "BIA Directive s.13",
          solution: "Specify the dividend distribution methodology",
          deadline: "3 days"
        },
        {
          type: "No Additional Terms Provided",
          description: "Optional field left blank — flag for administrator to confirm intent.",
          severity: "medium",
          regulation: "Best practice",
          solution: "Add additional terms or mark as 'None'",
          deadline: "5 days"
        },
        {
          type: "Unsigned by Consumer Debtor",
          description: "Consumer Debtor signature missing — non-compliant submission.",
          severity: "high",
          regulation: "BIA s.66.13(2)(d)",
          solution: "Obtain consumer debtor signature",
          deadline: "Immediately"
        },
        {
          type: "Missing Witness Signature",
          description: "Witness signature required for legal validation.",
          severity: "medium",
          regulation: "BIA Directive s.22",
          solution: "Obtain witness signature",
          deadline: "48 hours"
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
    highlightRisks
  };
};
