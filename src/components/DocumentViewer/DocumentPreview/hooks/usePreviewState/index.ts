
import { useDocumentAnalysis } from "../useDocumentAnalysis";
import { useFileOperations } from "./useFileOperations";
import { useAnalysisInitialization } from "./useAnalysisInitialization";
import { useRealtimeSubscriptions } from "./useRealtimeSubscriptions";
import { PreviewStateProps, PreviewState } from "./types";

export const usePreviewState = (
  storagePath: string, 
  title?: string, 
  onAnalysisComplete?: () => void
): PreviewState => {
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
    onAnalysisComplete
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
    loading,
    handleRefreshPreview,
    handleIframeError,
    handleAnalyzeDocument
  };
};
