
import { 
  CheckCircle, 
  ShieldAlert, 
  AlertTriangle, 
  AlertCircle, 
  Info 
} from "lucide-react";
import { TooltipProvider } from "../../ui/tooltip";
import { RiskItem } from "./RiskItem";
import { RiskAssessmentProps } from "./types";
import { Badge } from "@/components/ui/badge";

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ risks, documentId }) => {
  // Count risks by severity
  const criticalCount = risks?.filter(r => r.severity === 'high').length || 0;
  const moderateCount = risks?.filter(r => r.severity === 'medium').length || 0;
  const minorCount = risks?.filter(r => r.severity === 'low').length || 0;
  
  // Group risks by severity for better organization
  const criticalRisks = risks?.filter(r => r.severity === 'high') || [];
  const moderateRisks = risks?.filter(r => r.severity === 'medium') || [];
  const minorRisks = risks?.filter(r => r.severity === 'low') || [];

  return (
    <TooltipProvider>
      <div className="space-y-4">
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
                <RiskItem key={`critical-${index}`} risk={risk} documentId={documentId} />
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
                <RiskItem key={`moderate-${index}`} risk={risk} documentId={documentId} />
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
                <RiskItem key={`minor-${index}`} risk={risk} documentId={documentId} />
              ))}
            </div>
          </div>
        )}

        {risks && risks.length === 0 && (
          <div className="text-center p-6 border rounded-lg bg-muted/10">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No risks identified in this document</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
