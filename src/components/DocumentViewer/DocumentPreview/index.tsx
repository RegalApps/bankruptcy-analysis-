
import React from "react";
import { DocumentPreviewContent } from "./components/DocumentPreviewContent";
import usePreviewState from "./hooks/usePreviewState";
import { Risk } from "../RiskAssessment/types";

interface DocumentPreviewProps {
  documentId: string;
  storagePath: string;
  title: string;
  bypassAnalysis?: boolean;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string) => void;
  onAnalysisComplete?: () => void;
  onLoadFailure?: () => void;
  isForm31GreenTech?: boolean;
  // Add the previewState prop
  previewState?: {
    fileExists: boolean;
    fileUrl: string | null;
    isPdfFile: (path: string) => boolean;
    isExcelFile: (path: string) => boolean;
    isDocFile: (path: string) => boolean;
    isLoading: boolean;
    previewError: string | null;
    setPreviewError: (error: string | null) => void;
    checkFile: () => Promise<void>;
    documentRisks: Risk[];
  };
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  storagePath,
  documentId,
  title,
  bypassAnalysis = false,
  activeRiskId = null,
  onRiskSelect = () => {},
  onAnalysisComplete,
  onLoadFailure,
  isForm31GreenTech,
  previewState: providedPreviewState
}) => {
  // Generate preview state if not provided
  const generatedPreviewState = usePreviewState(storagePath, documentId, title, onAnalysisComplete, bypassAnalysis);
  // Use provided state or generated state
  const previewState = providedPreviewState || generatedPreviewState;

  return (
    <DocumentPreviewContent 
      storagePath={storagePath}
      documentId={documentId}
      title={title}
      previewState={previewState}
      activeRiskId={activeRiskId}
      onRiskSelect={onRiskSelect}
      onLoadFailure={onLoadFailure}
      isForm31GreenTech={isForm31GreenTech}
    />
  );
};
