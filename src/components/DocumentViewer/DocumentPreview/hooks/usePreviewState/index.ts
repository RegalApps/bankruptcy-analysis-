
import { useState } from "react";
import { useDocumentAnalysis } from "../../../hooks/useDocumentAnalysis";
import { useFileOperations } from "./useFileOperations";
import { useAnalysisInitialization } from "./useAnalysisInitialization";
import { useRealtimeSubscriptions } from "./useRealtimeSubscriptions";
import { PreviewStateProps, PreviewState } from "./types";

export const usePreviewState = (
  storagePath: string, 
  title?: string, 
  onAnalysisComplete?: () => void
): PreviewState => {
  const [bypassAnalysis, setBypassAnalysis] = useState(false);
  
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

  // Initialize analysis when component mounts, unless we're bypassing
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
    bypassAnalysis
  });

  // Set up real-time subscriptions
  useRealtimeSubscriptions({
    storagePath,
    setSession,
    onAnalysisComplete
  });

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
    bypassAnalysis,
    setBypassAnalysis,
    handleRefreshPreview,
    handleIframeError,
    handleAnalyzeDocument
  };
};
