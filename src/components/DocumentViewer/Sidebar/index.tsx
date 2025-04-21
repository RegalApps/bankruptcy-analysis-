
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
import { SidebarHeader } from "./SidebarHeader";
import { SidebarSummary } from "./SidebarSummary";
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
  
  // Extract analysis content and prepare extracted info
  const analysisContent = document.analysis?.[0]?.content;
  const extractedInfo = analysisContent?.extracted_info || {};
  const risks = analysisContent?.risks || [];

  // Get document text safely from metadata or extracted info, prioritizing certain fields
  // and falling back to empty string if none are available
  const documentText = (
    // From metadata
    (document.metadata?.text as string) ||
    (document.metadata?.fullText as string) ||
    (document.metadata?.content as string) ||
    // From extracted_info
    (extractedInfo.fullText as string) ||
    // From analysis content directly (although unlikely to exist)
    (analysisContent?.fullText as string) ||
    // Final fallback
    ""
  );

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
          <SidebarSummary formType={formType} extractedInfo={extractedInfo} />
          <SidebarDetails document={document} formType={formType} extractedInfo={extractedInfo} />
          <SidebarRisks formType={formType} risks={adaptRisks(risks)} documentId={document.id} isLoading={isLoading} />
          <SidebarDeadlines formType={formType} document={document} onDeadlineUpdated={onDeadlineUpdated} />
          <SidebarFormSpecific formType={formType} extractedInfo={extractedInfo} />
        </div>
      </ScrollArea>
    </div>
  );
};
