
import { DocumentDetails } from "../DocumentDetails";
import { RiskAssessment } from "../RiskAssessment";
import { DeadlineManager } from "../DeadlineManager";
import { DocumentDetails as DocumentDetailsType } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Calendar, FileSpreadsheet } from "lucide-react";
import logger from "@/utils/logger";

interface SidebarProps {
  document: DocumentDetailsType;
  onDeadlineUpdated: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ document, onDeadlineUpdated }) => {
  const analysisContent = document.analysis?.[0]?.content;
  const extractedInfo = analysisContent?.extracted_info || {};

  // Check if this is a Form 47 document
  const extractedFormType = extractedInfo?.formType;
  const isForm47 = document.type === 'form-47' || 
                  extractedFormType === 'form-47' ||
                  document.title?.toLowerCase().includes('form 47') || 
                  document.title?.toLowerCase().includes('consumer proposal');

  logger.debug('Extracted info in Sidebar:', extractedInfo);
  logger.debug('Risks in Sidebar:', analysisContent?.risks || []);
  logger.debug('Is Form 47:', isForm47);
  logger.debug('Full document data:', document);

  return (
    <div className="h-full bg-white dark:bg-card/50 rounded-md shadow-sm">
      <div className="p-3 border-b border-border/50 bg-muted/30">
        <h3 className="font-medium text-sm">Document Details</h3>
      </div>
      
      <ScrollArea className="h-[calc(100vh-14rem)] pr-2">
        <div className="px-3 py-3 space-y-4">
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3 className="sidebar-section-title">
                {isForm47 ? 'Consumer Proposal Summary' : 'Document Summary'}
              </h3>
            </div>
            {extractedInfo?.summary ? (
              <p className="text-sm text-foreground leading-relaxed">{extractedInfo.summary}</p>
            ) : (
              <div className="text-center py-3 bg-background/50 rounded-md">
                <p className="text-xs text-muted-foreground">No summary available</p>
                <p className="text-xs mt-1">Try analyzing the document to generate a summary</p>
              </div>
            )}
          </div>
          
          <Separator className="my-3" />
          
          <div className="sidebar-section">
            <DocumentDetails
              documentId={document.id}
              formType={extractedInfo?.formType ?? document.type}
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
          </div>
          
          <Separator className="my-3" />
          
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="sidebar-section-title">
                {isForm47 ? 'Consumer Proposal Compliance' : 'Risk Assessment'}
              </h3>
            </div>
            <RiskAssessment 
              risks={analysisContent?.risks || []} 
              documentId={document.id}
            />
          </div>
          
          <Separator className="my-3" />
          
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <Calendar className="h-4 w-4 text-blue-500" />
              <h3 className="sidebar-section-title">
                {isForm47 ? 'Proposal Deadlines' : 'Deadlines & Compliance'}
              </h3>
            </div>
            <DeadlineManager 
              document={document} 
              onDeadlineUpdated={onDeadlineUpdated}
            />
          </div>
          
          {isForm47 && (
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
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
