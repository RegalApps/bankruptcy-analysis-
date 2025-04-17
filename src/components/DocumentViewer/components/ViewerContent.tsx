
import React, { useEffect, useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { DocumentPreview } from "../DocumentPreview";
import { AnalysisPanel } from "../components/AnalysisPanel";
import { isDocumentForm31, getEffectiveStoragePath, getForm31DemoAnalysisData } from "../utils/documentTypeUtils";

interface ViewerContentProps {
  documentId: string;
  storagePath: string;
  title: string | undefined;
  selectedRiskId: string | null;
  bypassProcessing?: boolean;
  onLoadFailure?: () => void;
  onRiskSelect: (riskId: string) => void;
  isForm47?: boolean;
  isForm31GreenTech?: boolean;
  analysis?: any;
  onAnalysisComplete?: (id: string) => void;
}

export const ViewerContent: React.FC<ViewerContentProps> = ({
  documentId,
  storagePath,
  title,
  selectedRiskId,
  bypassProcessing,
  onLoadFailure,
  onRiskSelect,
  isForm47,
  isForm31GreenTech,
  analysis,
  onAnalysisComplete
}) => {
  const [documentLoadAttempt, setDocumentLoadAttempt] = useState(0);
  const [riskAnalysisData, setRiskAnalysisData] = useState<any>(null);
  
  // Add debug logs to help trace the component rendering
  useEffect(() => {
    console.log("ViewerContent rendered with:", {
      documentId,
      storagePath,
      title,
      bypassProcessing,
      isForm47,
      isForm31GreenTech,
      hasAnalysisCompleteCallback: !!onAnalysisComplete
    });
  }, [documentId, storagePath, title, bypassProcessing, isForm47, isForm31GreenTech, onAnalysisComplete]);

  // Use the centralized utility function to detect Form 31 documents
  const isForm31Document = isDocumentForm31(
    null,
    documentId,
    storagePath,
    title
  );
  
  const finalIsForm31GreenTech = isForm31GreenTech || isForm31Document;

  // Enhanced document path handling for Form 31
  const effectiveStoragePath = getEffectiveStoragePath(
    storagePath,
    finalIsForm31GreenTech,
    documentId
  );

  // Load Form 31 specific analysis data when needed
  useEffect(() => {
    if (finalIsForm31GreenTech && !analysis) {
      console.log("Loading Form 31 demo analysis data");
      setRiskAnalysisData(getForm31DemoAnalysisData());
      
      // Notify that analysis is complete for Form 31
      if (onAnalysisComplete) {
        console.log("Calling onAnalysisComplete for Form 31");
        onAnalysisComplete(documentId);
      }
    } else {
      setRiskAnalysisData(analysis);
    }
  }, [finalIsForm31GreenTech, analysis, documentId, onAnalysisComplete]);

  const handleAnalysisComplete = (id: string) => {
    console.log("Analysis completed in ViewerContent for document:", id);
    if (onAnalysisComplete) {
      console.log("Calling onAnalysisComplete callback with ID:", id);
      onAnalysisComplete(id);
    } else {
      console.log("No onAnalysisComplete callback provided");
    }
  };

  // Handle document load failure with retry logic
  const handleDocumentLoadFailure = () => {
    console.error("Document load failure in ViewerContent, attempt:", documentLoadAttempt);
    
    // Retry logic - if we've tried less than 2 times and it's a Form 31, try again with the fallback
    if (documentLoadAttempt < 2 && finalIsForm31GreenTech) {
      console.log("Attempting Form 31 fallback reload");
      setDocumentLoadAttempt(prev => prev + 1);
    } else if (onLoadFailure) {
      onLoadFailure();
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full h-full rounded-lg border"
    >
      <ResizablePanel defaultSize={70} minSize={40} className="h-full">
        <DocumentPreview
          documentId={documentId}
          storagePath={effectiveStoragePath}
          title={title || "Document"}
          activeRiskId={selectedRiskId}
          onRiskSelect={onRiskSelect}
          bypassAnalysis={bypassProcessing}
          onLoadFailure={handleDocumentLoadFailure}
          isForm31GreenTech={finalIsForm31GreenTech}
          isForm47={isForm47}
          onAnalysisComplete={handleAnalysisComplete}
          key={`preview-${documentId}-${documentLoadAttempt}`}
        />
      </ResizablePanel>
      
      <ResizableHandle className="bg-muted/50 w-1" />
      
      <ResizablePanel defaultSize={30} minSize={25} className="h-full p-0 overflow-y-hidden">
        <AnalysisPanel
          documentId={documentId}
          isLoading={false}
          analysis={riskAnalysisData}
          isForm31GreenTech={finalIsForm31GreenTech}
          title={title}
          storagePath={storagePath}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
