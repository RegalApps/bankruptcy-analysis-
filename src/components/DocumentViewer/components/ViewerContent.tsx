
import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { DocumentPreview } from "../DocumentPreview";
import { AnalysisPanel } from "../components/AnalysisPanel";

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
  const handleAnalysisComplete = (id: string) => {
    console.log("Analysis completed in ViewerContent:", id);
    if (onAnalysisComplete) {
      onAnalysisComplete(id);
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
          storagePath={storagePath}
          title={title || "Document"}
          activeRiskId={selectedRiskId}
          onRiskSelect={onRiskSelect}
          bypassAnalysis={bypassProcessing}
          onLoadFailure={onLoadFailure}
          isForm31GreenTech={isForm31GreenTech}
          isForm47={isForm47}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </ResizablePanel>
      
      <ResizableHandle className="bg-muted/50 w-1" />
      
      <ResizablePanel defaultSize={30} minSize={25} className="h-full p-0 overflow-y-hidden">
        <AnalysisPanel
          documentId={documentId}
          isLoading={false}
          analysis={analysis}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
