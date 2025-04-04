
import { useEffect, useState, useRef } from "react";
import { 
  CheckCircle, 
  ShieldAlert, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  FileText,
  FileCheck
} from "lucide-react";
import { TooltipProvider } from "../../ui/tooltip";
import { RiskItem } from "./RiskItem";
import { Form47RiskView } from "./Form47RiskView";
import { RiskAssessmentProps } from "./types";
import { Badge } from "@/components/ui/badge";

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ risks = [], documentId, isLoading }) => {
  const [isForm47, setIsForm47] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const riskRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Detect if this is a Form 47 (Consumer Proposal) document based on risks
  useEffect(() => {
    if (!risks?.length) return;
    
    const isConsumerProposal = risks.some(risk => 
      (risk.regulation && (
        risk.regulation.includes('66.13') || 
        risk.regulation.includes('66.14') ||
        risk.regulation.includes('66.15')
      )) || 
      (risk.description && (
        risk.description.toLowerCase().includes('consumer proposal') ||
        risk.description.toLowerCase().includes('secured creditors payment') ||
        risk.description.toLowerCase().includes('unsecured creditors payment')
      )) ||
      (risk.type && (
        risk.type.toLowerCase().includes('consumer proposal') ||
        risk.type.toLowerCase().includes('proposal')
      ))
    );

    console.log('Is Form 47 detected from risks:', isConsumerProposal);
    setIsForm47(isConsumerProposal);
  }, [risks]);
  
  // Listen for risk selection events from the document viewer
  useEffect(() => {
    const handleRiskSelected = (event: CustomEvent) => {
      if (event.detail?.risk) {
        const risk = event.detail.risk;
        console.log('Risk selected from document viewer:', risk);
        
        // Find the matching risk and scroll to it
        const riskIndex = risks.findIndex(r => 
          r.type === risk.type && r.severity === risk.severity
        );
        
        if (riskIndex >= 0) {
          const riskKey = `${risk.severity}-${riskIndex}`;
          setSelectedRisk(riskKey);
          
          // Scroll to the risk item
          if (riskRefs.current[riskKey]) {
            riskRefs.current[riskKey]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            
            // Highlight it temporarily
            riskRefs.current[riskKey]?.classList.add('bg-primary/10');
            setTimeout(() => {
              riskRefs.current[riskKey]?.classList.remove('bg-primary/10');
            }, 2000);
          }
        }
      }
    };
    
    window.addEventListener('riskSelected', handleRiskSelected as EventListener);
    
    return () => {
      window.removeEventListener('riskSelected', handleRiskSelected as EventListener);
    };
  }, [risks]);
  
  // Count risks by severity
  const criticalCount = risks?.filter(r => r.severity === 'high').length || 0;
  const moderateCount = risks?.filter(r => r.severity === 'medium').length || 0;
  const minorCount = risks?.filter(r => r.severity === 'low').length || 0;
  
  // Group risks by severity for better organization
  const criticalRisks = risks?.filter(r => r.severity === 'high') || [];
  const moderateRisks = risks?.filter(r => r.severity === 'medium') || [];
  const minorRisks = risks?.filter(r => r.severity === 'low') || [];

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="h-20 bg-muted rounded"></div>
        <div className="h-24 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Use specialized view for Form 47 */}
        {isForm47 ? (
          <Form47RiskView risks={risks} documentId={documentId} />
        ) : (
          <>
            {/* Risk summary badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {criticalCount > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {criticalCount} Critical
                </Badge>
              )}
              {moderateCount > 0 && (
                <Badge variant="default" className="bg-amber-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {moderateCount} Moderate
                </Badge>
              )}
              {minorCount > 0 && (
                <Badge variant="outline" className="text-yellow-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {minorCount} Minor
                </Badge>
              )}
              {risks?.length === 0 && (
                <Badge variant="outline" className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  No Risks
                </Badge>
              )}
            </div>

            {/* Critical risks section */}
            {criticalRisks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Critical Issues
                </h4>
                <div className="space-y-2">
                  {criticalRisks.map((risk, index) => (
                    <div 
                      key={`critical-${index}`}
                      ref={el => riskRefs.current[`high-${index}`] = el}
                      className={`transition-colors ${selectedRisk === `high-${index}` ? 'ring-2 ring-primary' : ''}`}
                    >
                      <RiskItem risk={risk} documentId={documentId} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Moderate risks section */}
            {moderateRisks.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  Moderate Concerns
                </h4>
                <div className="space-y-2">
                  {moderateRisks.map((risk, index) => (
                    <div 
                      key={`moderate-${index}`}
                      ref={el => riskRefs.current[`medium-${index}`] = el}
                      className={`transition-colors ${selectedRisk === `medium-${index}` ? 'ring-2 ring-primary' : ''}`}
                    >
                      <RiskItem risk={risk} documentId={documentId} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Minor risks section */}
            {minorRisks.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium flex items-center gap-2 text-yellow-600">
                  <Info className="h-4 w-4" />
                  Minor Issues
                </h4>
                <div className="space-y-2">
                  {minorRisks.map((risk, index) => (
                    <div 
                      key={`minor-${index}`}
                      ref={el => riskRefs.current[`low-${index}`] = el}
                      className={`transition-colors ${selectedRisk === `low-${index}` ? 'ring-2 ring-primary' : ''}`}
                    >
                      <RiskItem risk={risk} documentId={documentId} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {risks && risks.length === 0 && (
              <div className="text-center p-6 border rounded-lg bg-muted/10">
                <FileCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No risks identified in this document</p>
              </div>
            )}
          </>
        )}
      </div>
    </TooltipProvider>
  );
};
