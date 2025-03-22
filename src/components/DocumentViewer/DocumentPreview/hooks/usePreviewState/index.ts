
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { useDocumentAnalysis } from "../../hooks/useDocumentAnalysis";
import { useFilePreview } from "./useFilePreview";
import { useAnalysisInitialization } from "./useAnalysisInitialization";

const usePreviewState = (
  storagePath: string,
  documentId: string,
  title: string,
  onAnalysisComplete?: () => void,
  bypassAnalysis: boolean = false
) => {
  const [session, setSession] = useState<Session | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [fileExists, setFileExists] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isExcelFile, setIsExcelFile] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    handleAnalyzeDocument
  } = useDocumentAnalysis(storagePath, onAnalysisComplete);

  // Use the FilePreview hook with the correct props shape
  useFilePreview({
    storagePath,
    setFileExists,
    setFileUrl,
    setIsExcelFile, 
    setPreviewError
  });

  // When file information changes, update loading state
  useEffect(() => {
    if (fileUrl) {
      // If we have a file URL, we can consider loading complete
      setIsLoading(false);
    }
  }, [fileUrl]);

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

  // Enhanced document status tracking
  useEffect(() => {
    if (!documentId) return;
    
    // Check if analysis is stuck
    const checkStuckAnalysis = async () => {
      try {
        const { data } = await supabase
          .from('documents')
          .select('ai_processing_status, updated_at, metadata')
          .eq('id', documentId)
          .maybeSingle();
          
        if (data && data.ai_processing_status === 'processing') {
          const lastUpdateTime = new Date(data.updated_at);
          const minutesSinceUpdate = Math.floor((Date.now() - lastUpdateTime.getTime()) / (1000 * 60));
          
          // If analysis has been stuck for more than 10 minutes
          if (minutesSinceUpdate > 10) {
            setPreviewError(`Analysis appears to be stuck (running for ${minutesSinceUpdate} minutes)`);
            
            // Update local state to show retry button
            setIsAnalysisStuck({
              stuck: true,
              minutesStuck: minutesSinceUpdate
            });
          }
        }
      } catch (error) {
        console.error("Error checking document status:", error);
      }
    };
    
    // Check once on load and then every 5 minutes
    checkStuckAnalysis();
    const intervalId = setInterval(checkStuckAnalysis, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [documentId]);

  const checkFile = async () => {
    // Skip if already loading or retried too many times
    if (loadRetries > 3) {
      setPreviewError("Maximum load attempts reached. Please try again later.");
      return;
    }

    setIsLoading(true);
    setLoadRetries(prev => prev + 1);
    
    try {
      const { data } = await supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);

      if (data?.publicUrl) {
        setFileExists(true);
        setFileUrl(data.publicUrl);
        setIsLoading(false);
      } else {
        setFileExists(false);
        setFileUrl(null);
        setPreviewError("File not found in storage");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error checking file existence:", error);
      setFileExists(false);
      setFileUrl(null);
      setPreviewError(error.message || "Failed to check file existence");
      setIsLoading(false);
    }
  };

  // Add state for tracking stuck analysis
  const [isAnalysisStuck, setIsAnalysisStuck] = useState<{
    stuck: boolean;
    minutesStuck: number;
  }>({
    stuck: false,
    minutesStuck: 0
  });

  return {
    fileUrl,
    fileExists,
    isExcelFile,
    previewError,
    setPreviewError,
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    session,
    setSession,
    handleAnalyzeDocument,
    isAnalysisStuck,
    checkFile,
    isLoading,
    handleAnalysisRetry: () => {
      // Reset stuck state
      setIsAnalysisStuck({
        stuck: false,
        minutesStuck: 0
      });
      
      // Refresh document data
      setPreviewError(null);
      setFileExists(false);
      setLoadRetries(0);
      checkFile();
    }
  };
};

export default usePreviewState;
