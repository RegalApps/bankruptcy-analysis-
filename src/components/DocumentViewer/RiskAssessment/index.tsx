
import { CheckCircle, ShieldAlert, Timer } from "lucide-react";
import { TooltipProvider } from "../../ui/tooltip";
import { RiskItem } from "./RiskItem";
import { RiskAssessmentProps } from "./types";

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ risks, documentId }) => {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Risk Assessment</h3>
          </div>
          {risks && risks.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Updated {new Date().toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {risks && risks.length > 0 ? (
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <RiskItem key={index} risk={risk} documentId={documentId} />
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-lg bg-muted/10">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No risks identified in this document</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
