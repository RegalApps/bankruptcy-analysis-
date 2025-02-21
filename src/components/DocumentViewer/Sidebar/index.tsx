
import { DocumentHeader } from "../DocumentHeader";
import { DocumentDetails } from "../DocumentDetails";
import { RiskAssessment } from "../RiskAssessment";
import { DeadlineManager } from "../DeadlineManager";
import { DocumentDetails as DocumentDetailsType } from "../types";

interface SidebarProps {
  document: DocumentDetailsType;
  onDeadlineUpdated: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ document, onDeadlineUpdated }) => {
  // Safely access the extracted_info, handling potential undefined values
  const extractedInfo = document.analysis?.[0]?.content?.extracted_info;
  console.log('Extracted info in Sidebar:', extractedInfo); // Debug log

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
          risks={extractedInfo?.risks} 
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
