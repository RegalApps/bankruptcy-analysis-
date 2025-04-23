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
import { SidebarSummary } from "./SidebarSummary";
import { SidebarDetails } from "./SidebarDetails";
import { SidebarRisks } from "./SidebarRisks";
import { SidebarDeadlines } from "./SidebarDeadlines";
import { SidebarFormSpecific } from "./SidebarFormSpecific";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  document: DocumentDetailsType;
  onDeadlineUpdated: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ document, onDeadlineUpdated }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  
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

  // Determine form type and add debug logs
  const formType = safeDocument.title?.toLowerCase().includes('form 47') ? 'form-47' : 
                  safeDocument.title?.toLowerCase().includes('form 31') ? 'form-31' : 'unknown';
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
          <SidebarSummary formType={formType} extractedInfo={extractedInfo} />
          <SidebarDetails document={safeDocument} formType={formType} extractedInfo={extractedInfo} />
          <SidebarRisks formType={formType} risks={adaptRisks(risks)} documentId={safeDocument.id} isLoading={isLoading} />
          <SidebarDeadlines formType={formType} document={safeDocument} onDeadlineUpdated={onDeadlineUpdated} />
          <SidebarFormSpecific formType={formType} extractedInfo={extractedInfo} />
          
          {/* Debug Section */}
          <Separator className="my-3" />
          <Collapsible 
            open={isDebugOpen} 
            onOpenChange={setIsDebugOpen}
            className="bg-muted/30 rounded-md p-2 mt-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-medium text-primary">Raw Analysis Data</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <span className="sr-only">Toggle</span>
                  {isDebugOpen ? '▲' : '▼'}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-2 space-y-2">
              <div className="text-xs">
                <h4 className="font-bold mb-1">Document ID: {safeDocument.id}</h4>
                <h4 className="font-bold mb-1">Form Type: {formType || 'Unknown'}</h4>
                
                <h4 className="font-bold mt-3 mb-1">Extracted Info:</h4>
                <div className="bg-background/60 p-2 rounded-md overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all text-[10px]">
                    {JSON.stringify(extractedInfo, null, 2)}
                  </pre>
                </div>
                
                <h4 className="font-bold mt-3 mb-1">Risks Assessment:</h4>
                <div className="bg-background/60 p-2 rounded-md overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all text-[10px]">
                    {JSON.stringify(risks, null, 2)}
                  </pre>
                </div>
                
                <h4 className="font-bold mt-3 mb-1">Full Analysis:</h4>
                <div className="bg-background/60 p-2 rounded-md overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all text-[10px]">
                    {JSON.stringify(safeDocument.analysis, null, 2)}
                  </pre>
                </div>
                
                <h4 className="font-bold mt-3 mb-1">Document Metadata:</h4>
                <div className="bg-background/60 p-2 rounded-md overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all text-[10px]">
                    {JSON.stringify(safeDocument.metadata || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
};
