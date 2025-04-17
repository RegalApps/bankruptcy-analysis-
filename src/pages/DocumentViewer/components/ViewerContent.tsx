
import React, { useState, useEffect } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { toast } from "sonner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { isDocumentForm31 } from "@/components/DocumentViewer/utils/documentTypeUtils";

interface ViewerContentProps {
  documentId: string;
  isForm47: boolean;
  isGreenTechForm31: boolean;
  documentTitle?: string;
}

export const ViewerContent: React.FC<ViewerContentProps> = ({
  documentId,
  isForm47,
  isGreenTechForm31,
  documentTitle
}) => {
  const [loading, setLoading] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Use our centralized Form 31 detection logic
  const detectedForm31 = isDocumentForm31(
    null, 
    documentId,
    null,
    documentTitle
  );
  
  const finalIsForm31GreenTech = isGreenTechForm31 || detectedForm31;
  
  useEffect(() => {
    console.log("ViewerContent in DocumentViewerPage rendered with:", {
      documentId,
      isForm47,
      isGreenTechForm31: finalIsForm31GreenTech,
      documentTitle
    });
  }, [documentId, isForm47, finalIsForm31GreenTech, documentTitle]);
  
  const handleLoadFailure = () => {
    console.error("Failed to load document");
    setLoadAttempts(prev => {
      const newCount = prev + 1;
      
      if (newCount > 2) {
        toast.error("There was a problem loading this document. Please try again.");
        setLoading(false);
      } else if (finalIsForm31GreenTech) {
        toast.info("Trying alternative document source...");
      }
      
      return newCount;
    });
  };

  const handleAnalysisComplete = (id: string) => {
    console.log("Analysis complete for document:", id);
    setLoading(false);
  };

  return (
    <div className="h-full border rounded-lg overflow-hidden">
      <DocumentViewer 
        documentId={documentId} 
        documentTitle={documentTitle}
        isForm47={isForm47}
        isForm31GreenTech={finalIsForm31GreenTech}
        onLoadFailure={handleLoadFailure}
        onAnalysisComplete={handleAnalysisComplete}
        key={`document-viewer-${documentId}-${loadAttempts}`}
      />
    </div>
  );
};
