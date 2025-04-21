// Handles form-specific extra information in the Sidebar (for Form 31 & 47)
import { Separator } from "@/components/ui/separator";
import { FileSpreadsheet, Info } from "lucide-react";

interface SidebarFormSpecificProps {
  formType: string | undefined;
  extractedInfo: any;
}

export const SidebarFormSpecific: React.FC<SidebarFormSpecificProps> = ({ formType, extractedInfo }) => {
  if (formType === "form-31") {
    return (
      <>
        <Separator className="my-3" />
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <Info className="h-4 w-4 text-blue-500" />
            <h3 className="sidebar-section-title">Claim Details</h3>
          </div>
          <div className="bg-background/50 rounded-md p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Creditor Name:</span>
              <span>{extractedInfo?.creditorName || extractedInfo?.claimantName || "Not extracted"}</span>
              <span className="text-muted-foreground">Claim Amount:</span>
              <span>{extractedInfo?.claimAmount || "Not extracted"}</span>
              <span className="text-muted-foreground">Claim Type:</span>
              <span>{extractedInfo?.claimType || extractedInfo?.claimClassification || "Not extracted"}</span>
            </div>
          </div>
        </div>
      </>
    );
  }
  if (formType === "form-47") {
    return (
      <>
        <Separator className="my-3" />
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <FileSpreadsheet className="h-4 w-4 text-green-500" />
            <h3 className="sidebar-section-title">Payment Schedule</h3>
          </div>
          <div className="bg-background/50 rounded-md p-3">
            {extractedInfo?.paymentSchedule ? (
              <p className="text-sm text-foreground leading-relaxed">{extractedInfo.paymentSchedule}</p>
            ) : (
              <p className="text-muted-foreground italic text-xs text-center">
                No payment schedule information available
              </p>
            )}
            {extractedInfo?.monthlyPayment && (
              <div className="mt-2 p-2 bg-muted rounded">
                <span className="font-medium text-sm">Monthly Payment: </span>
                <span className="text-sm">{extractedInfo.monthlyPayment}</span>
              </div>
            )}
            {extractedInfo?.proposalDuration && (
              <div className="mt-2 p-2 bg-muted rounded">
                <span className="font-medium text-sm">Duration: </span>
                <span className="text-sm">{extractedInfo.proposalDuration}</span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
  return null;
};
