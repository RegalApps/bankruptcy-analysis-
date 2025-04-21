
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RiskAssessment } from "../RiskAssessment";

interface SidebarRisksProps {
  formType: string | undefined;
  risks: any[];
  documentId: string;
  isLoading: boolean;
}

export const SidebarRisks: React.FC<SidebarRisksProps> = ({ formType, risks, documentId, isLoading }) => {
  const isForm47 = formType === "form-47";
  const isForm31 = formType === "form-31";
  return (
    <div className="sidebar-section">
      <div className="sidebar-section-header">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <h3 className="sidebar-section-title">
          {isForm47 ? "Consumer Proposal Compliance" :
            isForm31 ? "Proof of Claim Analysis" : "Risk Assessment"}
        </h3>
      </div>
      <RiskAssessment risks={risks} documentId={documentId} isLoading={isLoading} />
      <Separator className="my-3" />
    </div>
  );
};
