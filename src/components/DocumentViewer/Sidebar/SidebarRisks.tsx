import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RiskAssessment } from "../RiskAssessment";
import { useEffect, useState } from "react";
import { Risk } from "../types";
import { getRiskAssessments } from "@/utils/riskAssessments";
import { normalizeFormType } from "@/utils/formTypeUtils";

interface SidebarRisksProps {
  formType: string | undefined;
  risks: any[];
  documentId: string;
  isLoading: boolean;
}

export const SidebarRisks: React.FC<SidebarRisksProps> = ({ formType, risks, documentId, isLoading }) => {
  const [displayRisks, setDisplayRisks] = useState<Risk[]>(risks || []);

  const normalizedFormType = normalizeFormType(formType);
  const isForm47 = normalizedFormType === "form47";
  const isForm31 = normalizedFormType === "form31";

  useEffect(() => {
    // If the form is 47, load hard‑coded risk assessments, else use provided
    if (isForm47) {
      setDisplayRisks(getRiskAssessments("form-47"));
    } else if (isForm31) {
      setDisplayRisks(getRiskAssessments("form-31"));
    } else {
      setDisplayRisks(risks || []);
    }
  }, [normalizedFormType, risks]);

  return (
    <div className="sidebar-section">
      <div className="sidebar-section-header">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <h3 className="sidebar-section-title">
          {isForm47 ? "Consumer Proposal Compliance" :
            isForm31 ? "Proof of Claim Analysis" : "Risk Assessment"}
        </h3>
      </div>
      <RiskAssessment risks={displayRisks} documentId={documentId} isLoading={isLoading} />
      <Separator className="my-3" />
    </div>
  );
};
