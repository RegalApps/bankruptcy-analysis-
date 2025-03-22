
import React from "react";
import { DocumentPreviewContent } from "./components/DocumentPreviewContent";
import usePreviewState from "./hooks/usePreviewState";

interface DocumentPreviewProps {
  storagePath: string;
  documentId: string;
  title: string;
  bypassAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  storagePath,
  documentId,
  title,
  bypassAnalysis = false,
  onAnalysisComplete
}) => {
  const previewState = usePreviewState(storagePath, documentId, title, onAnalysisComplete, bypassAnalysis);

  return (
    <DocumentPreviewContent 
      storagePath={storagePath}
      documentId={documentId}
      title={title}
      previewState={previewState}
    />
  );
};
