import { DocumentDetails } from "../DocumentDetails";
import { RiskAssessment } from "../RiskAssessment";
import { DeadlineManager } from "../DeadlineManager";
import { DocumentDetails as DocumentDetailsType, Risk as DocumentRisk } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Calendar, FileSpreadsheet, Info, Code } from "lucide-react";
import logger from "@/utils/logger";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { detectFormType } from "../DocumentPreview/hooks/analysisProcess/formIdentification";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarDetails } from "./SidebarDetails";
import { SidebarRisks } from "./SidebarRisks";
import { SidebarDeadlines } from "./SidebarDeadlines";
import { SidebarFormSpecific } from "./SidebarFormSpecific";

interface SidebarProps {
  document: DocumentDetailsType;
  onDeadlineUpdated: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ document, onDeadlineUpdated }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  
  // Ensure document has all required properties with safe fallbacks
  const safeDocument = {
    id: document?.id || 'unknown',
    title: document?.title || 'Untitled Document',
    type: document?.type || 'unknown',
    created_at: document?.created_at || new Date().toISOString(),
    updated_at: document?.updated_at || new Date().toISOString(),
    storage_path: document?.storage_path || '',
    analysis: document?.analysis || [],
    comments: document?.comments || [],
    tasks: document?.tasks || [],
    versions: document?.versions || [],
    metadata: document?.metadata || {},
  };
  
  // Extract analysis content supporting both wrapped (content) and direct structures
  const firstAnalysisItem: any = safeDocument.analysis?.[0] || {};
  const analysisContent = firstAnalysisItem.content ? firstAnalysisItem.content : firstAnalysisItem;
  const extractedInfo = analysisContent?.extracted_info || {};
  const risks = analysisContent?.risks || [];

  // Get document text safely with fallbacks
  const documentText = "";  // Simplified for local-only mode

  // Determine form type with improved detection
  let formType = 'unknown';
  
  // Check for form type in title
  if (safeDocument.title?.toLowerCase().includes('form 47') || safeDocument.title?.toLowerCase().includes('consumer proposal')) {
    formType = 'form-47';
  } else if (safeDocument.title?.toLowerCase().includes('form 31') || safeDocument.title?.toLowerCase().includes('proof of claim')) {
    formType = 'form-31';
  } 
  // Check for form type in document ID
  else if (safeDocument.id?.toLowerCase().includes('form47') || safeDocument.id?.toLowerCase().includes('form-47')) {
    formType = 'form-47';
  } else if (safeDocument.id?.toLowerCase().includes('form31') || safeDocument.id?.toLowerCase().includes('form-31')) {
    formType = 'form-31';
  }
  // Check for form type in metadata or analysis
  else if (extractedInfo?.formType === 'form-47' || extractedInfo?.formType === 'consumer-proposal') {
    formType = 'form-47';
  } else if (extractedInfo?.formType === 'form-31' || extractedInfo?.formType === 'proof-of-claim') {
    formType = 'form-31';
  }
  // For testing purposes - force form type based on URL
  else if (window.location.href.includes('form47') || window.location.href.includes('form-47')) {
    formType = 'form-47';
  } else if (window.location.href.includes('form31') || window.location.href.includes('form-31')) {
    formType = 'form-31';
  }
  
  const isForm47 = formType === 'form-47';
  const isForm31 = formType === 'form-31';
  
  // Debug logging
  useEffect(() => {
    logger.debug('Document analysis in Sidebar:', safeDocument.analysis);
    logger.debug('Extracted info in Sidebar:', extractedInfo);
    logger.debug('Risks in Sidebar:', risks);
    logger.debug('Form type detected:', formType);
    logger.debug('Full document data:', safeDocument);
  }, [safeDocument, extractedInfo, risks, formType]);

  // Convert Risk[] type to ensure severity is treated as a proper enum
  const adaptRisks = (risks: DocumentRisk[] = []): any[] => {
    return risks.map(risk => ({
      ...risk,
      severity: risk.severity || 'medium',
    }));
  };
  
  return (
    <div className={cn(
      "h-full rounded-md shadow-sm",
      isDarkMode ? "bg-card/50" : "bg-white"
    )}>
      <SidebarHeader isDarkMode={isDarkMode} />
      <ScrollArea className="h-[calc(100vh-14rem)] pr-2">
        <div className="px-3 py-3 space-y-4">
          <SidebarDetails document={safeDocument} formType={formType} extractedInfo={extractedInfo} />
          <SidebarRisks formType={formType} risks={adaptRisks(risks)} documentId={safeDocument.id} isLoading={isLoading} />
          <SidebarDeadlines formType={formType} document={safeDocument} onDeadlineUpdated={onDeadlineUpdated} />
          <SidebarFormSpecific formType={formType} extractedInfo={extractedInfo} />
        </div>
      </ScrollArea>
    </div>
  );
};
