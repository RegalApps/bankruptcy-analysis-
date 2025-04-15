import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAnalysisProcess } from "../../hooks/analysisProcess/useAnalysisProcess";
import { AnalysisProcessProps } from "./analysisProcess/types";

export const useDocumentAnalysis = (storagePath: string, onAnalysisComplete?: (id: string) => void) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const { toast } = useToast();

  const handleAnalysisCompleteWrapper = useCallback((id: string) => {
    if (onAnalysisComplete && id) {
      console.log("Analysis complete wrapper called with ID:", id);
      onAnalysisComplete(id);
    }
  }, [onAnalysisComplete]);

  const analysisProcessProps: AnalysisProcessProps = {
    setAnalysisStep,
    setProgress,
    setError,
    setProcessingStage,
    toast,
    onAnalysisComplete: handleAnalysisCompleteWrapper
  };

  const { executeAnalysisProcess } = useAnalysisProcess(analysisProcessProps);

  const handleAnalyzeDocument = async (currentSession = session) => {
    setError(null);
    
    try {
      if (!currentSession) {
        console.error("No session available for document analysis");
        throw new Error('You must be logged in to analyze documents');
      }

      setAnalyzing(true);
      
      await executeAnalysisProcess(storagePath, currentSession);
      
    } catch (error: any) {
      console.error('Document analysis failed:', error);
      setError(error.message || 'An unknown error occurred');
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze document"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (session && storagePath && !analyzing) {
      const checkDocumentStatus = async () => {
        try {
          const { data: document } = await supabase
            .from('documents')
            .select('ai_processing_status, metadata, id')
            .eq('storage_path', storagePath)
            .maybeSingle();
            
          if (document && 
             (document.ai_processing_status === 'pending' || 
              document.ai_processing_status === 'failed' ||
              document.metadata?.processing_steps_completed?.length < 8)) {
            console.log('Document needs analysis, current status:', document.ai_processing_status);
            handleAnalyzeDocument(session);
          } else if (document && document.ai_processing_status === 'complete' && onAnalysisComplete) {
            console.log('Document already analyzed, calling completion callback with ID:', document.id);
            onAnalysisComplete(document.id);
          }
        } catch (err) {
          console.error('Error checking document status:', err);
        }
      };
      
      checkDocumentStatus();
    }
  }, [session, storagePath, analyzing, onAnalysisComplete]);

  return {
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    setSession,
    handleAnalyzeDocument
  };
};
