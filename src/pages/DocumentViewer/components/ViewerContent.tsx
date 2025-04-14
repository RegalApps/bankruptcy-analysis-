
import React, { useState } from "react";
import { DocumentViewer } from "@/components/DocumentViewer";
import { toast } from "sonner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
  
  const handleLoadFailure = () => {
    console.error("Failed to load document");
    toast.error("There was a problem loading this document. Please try again.");
  };

  return (
    <div className="h-full border rounded-lg overflow-hidden">
      <DocumentViewer 
        documentId={documentId} 
        documentTitle={documentTitle}
        isForm47={isForm47}
        isForm31GreenTech={isGreenTechForm31}
        onLoadFailure={handleLoadFailure}
      />
    </div>
  );
};
