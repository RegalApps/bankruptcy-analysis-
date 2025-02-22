
import { DocumentHeader } from "../DocumentHeader";
import { DocumentDetails } from "../DocumentDetails";
import { RiskAssessment } from "../RiskAssessment";
import { DeadlineManager } from "../DeadlineManager";
import { DocumentDetails as DocumentDetailsType } from "../types";
import logger from "@/utils/logger";

interface SidebarProps {
  document: DocumentDetailsType;
  onDeadlineUpdated: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ document, onDeadlineUpdated }) => {
  // Safely access the extracted_info, handling potential undefined values
  const extractedInfo = document.analysis?.[0]?.content?.extracted_info;
  const risks = document.analysis?.[0]?.content?.risks;

  // Add logging to help debug data flow
  logger.debug('Extracted info in Sidebar:', extractedInfo);
  logger.debug('Risks in Sidebar:', risks);

  if (!extractedInfo && !risks) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <DocumentHeader title={document.title} type={document.type} />
        <div className="text-center py-4 text-muted-foreground">
          <p>No analysis data available.</p>
          <p className="text-sm mt-2">Try clicking "Analyze Document" in the preview panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <DocumentHeader title={document.title} type={document.type} />
      <div className="space-y-4">
        <DocumentDetails
          documentId={document.id}
          formType={extractedInfo?.type ?? document.type}
          clientName={extractedInfo?.clientName}
          trusteeName={extractedInfo?.trusteeName}
          dateSigned={extractedInfo?.dateSigned}
          formNumber={extractedInfo?.formNumber}
          estateNumber={extractedInfo?.estateNumber}
          district={extractedInfo?.district}
          divisionNumber={extractedInfo?.divisionNumber}
          courtNumber={extractedInfo?.courtNumber}
          meetingOfCreditors={extractedInfo?.meetingOfCreditors}
          chairInfo={extractedInfo?.chairInfo}
          securityInfo={extractedInfo?.securityInfo}
          dateBankruptcy={extractedInfo?.dateBankruptcy}
          officialReceiver={extractedInfo?.officialReceiver}
          summary={extractedInfo?.summary}
        />
        <RiskAssessment 
          risks={risks} 
          documentId={document.id}
        />
        <DeadlineManager 
          document={document}
          onDeadlineUpdated={onDeadlineUpdated}
        />
      </div>
    </div>
  );
};
