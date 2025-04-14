
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { useDocumentAnalysis } from "../../hooks/useDocumentAnalysis";
import { useFilePreview } from "./useFilePreview";
import { useAnalysisInitialization } from "../useAnalysisInitialization";

const usePreviewState = (
  storagePath: string,
  documentId: string,
  title: string,
  onAnalysisComplete?: (id: string) => void,
  bypassAnalysis: boolean = false
) => {
  const [session, setSession] = useState<Session | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [fileExists, setFileExists] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isExcelFile, setIsExcelFile] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFallbackToDirectUrl, setHasFallbackToDirectUrl] = useState(false);

  const handleAnalysisCompleteWrapper = useCallback((id: string) => {
    if (onAnalysisComplete) {
      onAnalysisComplete(id);
    }
  }, [onAnalysisComplete]);

  const {
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    handleAnalyzeDocument
  } = useDocumentAnalysis(storagePath, handleAnalysisCompleteWrapper);

  const { 
    checkFile, 
    networkStatus, 
    attemptCount,
    hasFileLoadStarted,
    resetRetries
  } = useFilePreview({
    storagePath,
    setFileExists,
    setFileUrl,
    setIsExcelFile, 
    setPreviewError
  });

  useEffect(() => {
    if (fileUrl) {
      setIsLoading(false);
    }
  }, [fileUrl]);

  useEffect(() => {
    console.log(`Network status: ${networkStatus}, attempt count: ${attemptCount}`);
  }, [networkStatus, attemptCount]);

  useEffect(() => {
    if (previewError && loadRetries < 2 && !hasFallbackToDirectUrl) {
      console.log("Preview error detected, retrying with fallback strategies");
      
      setLoadRetries(prev => prev + 1);
      
      if (loadRetries === 1) {
        setHasFallbackToDirectUrl(true);
        console.log("Falling back to direct URL mode");
        setTimeout(checkFile, 1000);
      }
    }
  }, [previewError, loadRetries, hasFallbackToDirectUrl, checkFile]);

  useAnalysisInitialization({
    storagePath,
    fileExists,
    isExcelFile,
    analyzing,
    error,
    setSession,
    handleAnalyzeDocument,
    setPreviewError,
    onAnalysisComplete: handleAnalysisCompleteWrapper,
    bypassAnalysis
  });

  const [isAnalysisStuck, setIsAnalysisStuck] = useState<{
    stuck: boolean;
    minutesStuck: number;
  }>({
    stuck: false,
    minutesStuck: 0
  });

  useEffect(() => {
    if (!documentId) return;
    
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
          
          if (minutesSinceUpdate > 10) {
            setPreviewError(`Analysis appears to be stuck (running for ${minutesSinceUpdate} minutes)`);
            
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
    
    checkStuckAnalysis();
    const intervalId = setInterval(checkStuckAnalysis, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [documentId]);

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
    hasFallbackToDirectUrl,
    networkStatus,
    attemptCount,
    handleAnalysisRetry: () => {
      setIsAnalysisStuck({
        stuck: false,
        minutesStuck: 0
      });
      
      setHasFallbackToDirectUrl(false);
      
      setPreviewError(null);
      setFileExists(false);
      setLoadRetries(0);
      resetRetries();
      checkFile();
    }
  };
};

export default usePreviewState;
