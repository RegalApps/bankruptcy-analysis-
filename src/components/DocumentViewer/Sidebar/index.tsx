
import { DocumentHeader } from "../DocumentHeader";
import { DocumentDetails } from "../DocumentDetails";
import { RiskAssessment } from "../RiskAssessment";
import { DeadlineManager } from "../DeadlineManager";
import { DocumentDetails as DocumentDetailsType } from "../types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import logger from "@/utils/logger";

interface SidebarProps {
  document: DocumentDetailsType;
  onDeadlineUpdated: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ document, onDeadlineUpdated }) => {
  const analysisContent = document.analysis?.[0]?.content;
  const extractedInfo = analysisContent?.extracted_info;
  const risks = analysisContent?.risks || [];

  logger.debug('Extracted info in Sidebar:', extractedInfo);
  logger.debug('Risks in Sidebar:', risks);
  logger.debug('Full document data:', document);

  if (!extractedInfo && risks.length === 0) {
    return (
      <Card className="p-6 h-full">
        <DocumentHeader title={document.title} type={document.type} />
        <div className="text-center py-4 text-muted-foreground">
          <p>No analysis data available.</p>
          <p className="text-sm mt-2">Try clicking "Analyze Document" in the preview panel.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <ScrollArea className="h-[calc(100vh-2rem)] px-6">
        <DocumentHeader title={document.title} type={document.type} />
        <div className="space-y-6 py-4">
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
          
          <div className="my-6">
            <RiskAssessment 
              risks={risks} 
              documentId={document.id}
            />
          </div>

          <div className="my-6">
            <DeadlineManager 
              document={document} 
              onDeadlineUpdated={onDeadlineUpdated}
            />
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
