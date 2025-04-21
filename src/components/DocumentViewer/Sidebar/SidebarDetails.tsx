
import { DocumentDetails } from "../DocumentDetails";
import { Separator } from "@/components/ui/separator";

export interface SidebarDetailsProps {
  document: any;
  formType: string | undefined;
  extractedInfo: any;
}

export const SidebarDetails: React.FC<SidebarDetailsProps> = ({ document, formType, extractedInfo }) => (
  <div className="sidebar-section">
    <DocumentDetails
      documentId={document.id}
      formType={formType || extractedInfo?.formType || document.type}
      clientName={extractedInfo?.clientName}
      trusteeName={extractedInfo?.trusteeName}
      administratorName={extractedInfo?.administratorName}
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
      filingDate={extractedInfo?.filingDate}
      submissionDeadline={extractedInfo?.submissionDeadline}
      documentStatus={extractedInfo?.documentStatus}
      summary={extractedInfo?.summary}
    />
    <Separator className="my-3" />
  </div>
);
