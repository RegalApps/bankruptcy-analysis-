
import { useState } from "react";
import { useDocumentAnalysis } from "../../../hooks/useDocumentAnalysis";
import { useFileOperations } from "./useFileOperations";
import { useAnalysisInitialization } from "./useAnalysisInitialization";
import { useRealtimeSubscriptions } from "./useRealtimeSubscriptions";
import { PreviewState } from "./types";

export const usePreviewState = (
  storagePath: string, 
  title?: string, 
  onAnalysisComplete?: () => void
): PreviewState => {
  const [diagnosticsMode, setDiagnosticsMode] = useState(false);
  
  const {
    publicUrl,
    fileExists,
    isExcelFile,
    previewError,
    loading,
    setLoading,
    setPreviewError,
    handleRefreshPreview,
    handleIframeError
  } = useFileOperations(storagePath, title);
  
  const {
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    setSession,
    handleAnalyzeDocument
  } = useDocumentAnalysis(storagePath, onAnalysisComplete);

  // Initialize analysis when component mounts
  useAnalysisInitialization({
    storagePath,
    fileExists,
    isExcelFile,
    analyzing,
    error,
    setSession,
    handleAnalyzeDocument,
    setPreviewError,
    onAnalysisComplete,
    bypassAnalysis: false
  });

  // Set up real-time subscriptions
  useRealtimeSubscriptions({
    storagePath,
    setSession,
    onAnalysisComplete
  });

  const toggleDiagnosticsMode = () => {
    setDiagnosticsMode(prev => !prev);
  };

  return {
    previewError,
    setPreviewError,
    publicUrl,
    isExcelFile,
    fileExists,
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    loading,
    handleRefreshPreview,
    handleIframeError,
    handleAnalyzeDocument,
    diagnosticsMode,
    toggleDiagnosticsMode
  };
};
