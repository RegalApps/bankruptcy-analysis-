
import { DocumentHeader } from "../DocumentHeader";
import { DocumentDetails } from "../DocumentDetails";
import { RiskAssessment } from "../RiskAssessment";
import { DeadlineManager } from "../DeadlineManager";
import { DocumentDetails as DocumentDetailsType } from "../types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, AlertTriangle, Calendar, FileSpreadsheet } from "lucide-react";
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
    <Card className="h-full">
      <div className="p-3">
        <DocumentHeader 
          title={document.title} 
          type={isForm47 ? 'form-47' : document.type} 
        />
      </div>
      
      <ScrollArea className="h-[calc(100vh-12rem)] pr-1">
        <div className="px-3 pb-4 space-y-4">
          <div className="rounded-md bg-muted/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-sm">
                {isForm47 ? 'Consumer Proposal Summary' : 'Document Summary'}
              </h3>
            </div>
            {extractedInfo?.summary ? (
              <p className="text-sm text-muted-foreground">{extractedInfo.summary}</p>
            ) : (
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground">No summary available</p>
                <p className="text-xs mt-1">Try analyzing the document to generate a summary</p>
              </div>
            )}
          </div>
          
          <Separator />
          
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
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="font-medium text-sm">
                {isForm47 ? 'Consumer Proposal Compliance' : 'Risk Assessment'}
              </h3>
            </div>
            <RiskAssessment 
              risks={analysisContent?.risks || []} 
              documentId={document.id}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <h3 className="font-medium text-sm">
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
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-green-500" />
                  <h3 className="font-medium text-sm">Payment Schedule</h3>
                </div>
                <div className="text-sm p-3 bg-muted/30 rounded-md">
                  {extractedInfo?.paymentSchedule ? (
                    <p className="text-muted-foreground">{extractedInfo.paymentSchedule}</p>
                  ) : (
                    <p className="text-muted-foreground italic text-xs">
                      No payment schedule information available
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
