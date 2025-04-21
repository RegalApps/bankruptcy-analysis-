
import { DocumentDetails } from "../DocumentDetails";
import { RiskAssessment } from "../RiskAssessment";
import { DeadlineManager } from "../DeadlineManager";
import { DocumentDetails as DocumentDetailsType, Risk as DocumentRisk } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Calendar, FileSpreadsheet, Info } from "lucide-react";
import logger from "@/utils/logger";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { detectFormType } from "../DocumentPreview/hooks/analysisProcess/formIdentification";

interface SidebarProps {
  document: DocumentDetailsType;
  onDeadlineUpdated: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ document, onDeadlineUpdated }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract analysis content and prepare extracted info
  const analysisContent = document.analysis?.[0]?.content;
  const extractedInfo = analysisContent?.extracted_info || {};
  const risks = analysisContent?.risks || [];

  // Get document text safely from analysis content or document metadata
  // Note: We only access fullText and content from places we know they might exist
  const documentText = 
    // Check document metadata first
    (document.metadata?.fullText as string) || 
    // Try raw content directly (for older documents)
    (analysisContent as any)?.fullText as string || 
    // Check if raw extracted text is available
    (analysisContent as any)?.rawText as string || 
    // Default to empty string if none found
    "";
  
  // Determine form type and add debug logs
  const formType = detectFormType(document, documentText);
  const isForm47 = formType === 'form-47';
  const isForm31 = formType === 'form-31';
  
  // Debug logging
  useEffect(() => {
    logger.debug('Document analysis in Sidebar:', document.analysis);
    logger.debug('Extracted info in Sidebar:', extractedInfo);
    logger.debug('Risks in Sidebar:', risks);
    logger.debug('Form type detected:', formType);
    logger.debug('Full document data:', document);
  }, [document, extractedInfo, risks, formType]);

  // Convert Risk[] type to ensure severity is treated as a proper enum
  const adaptRisks = (risks: DocumentRisk[] = []): any[] => {
    return risks.map(risk => ({
      ...risk,
      severity: risk.severity || 'medium', // Ensure severity is never undefined
    }));
  };
  
  // Form type specific content sections
  const renderFormSpecificContent = () => {
    if (isForm31) {
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
                <span>{extractedInfo?.creditorName || extractedInfo?.claimantName || 'Not extracted'}</span>
                
                <span className="text-muted-foreground">Claim Amount:</span>
                <span>{extractedInfo?.claimAmount || 'Not extracted'}</span>
                
                <span className="text-muted-foreground">Claim Type:</span>
                <span>{extractedInfo?.claimType || extractedInfo?.claimClassification || 'Not extracted'}</span>
              </div>
            </div>
          </div>
        </>
      );
    }
    
    if (isForm47) {
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

  return (
    <div className={cn(
      "h-full rounded-md shadow-sm",
      isDarkMode ? "bg-card/50" : "bg-white"
    )}>
      <div className="p-3 border-b border-border/50 bg-muted/30">
        <h3 className="font-medium text-sm">Document Details</h3>
      </div>
      
      <ScrollArea className="h-[calc(100vh-14rem)] pr-2">
        <div className="px-3 py-3 space-y-4">
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3 className="sidebar-section-title">
                {isForm47 ? 'Consumer Proposal Summary' : 
                 isForm31 ? 'Proof of Claim Summary' : 
                 'Document Summary'}
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
          </div>
          
          <Separator className="my-3" />
          
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="sidebar-section-title">
                {isForm47 ? 'Consumer Proposal Compliance' : 
                 isForm31 ? 'Proof of Claim Analysis' :
                 'Risk Assessment'}
              </h3>
            </div>
            <RiskAssessment 
              risks={adaptRisks(risks)} 
              documentId={document.id}
              isLoading={isLoading}
            />
          </div>
          
          <Separator className="my-3" />
          
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <Calendar className="h-4 w-4 text-blue-500" />
              <h3 className="sidebar-section-title">
                {isForm47 ? 'Proposal Deadlines' : 
                 isForm31 ? 'Claim Deadlines' :
                 'Deadlines & Compliance'}
              </h3>
            </div>
            <DeadlineManager 
              document={document} 
              onDeadlineUpdated={onDeadlineUpdated}
            />
          </div>
          
          {renderFormSpecificContent()}
        </div>
      </ScrollArea>
    </div>
  );
};
