
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAnalysisProcess } from "../DocumentPreview/hooks/analysisProcess/useAnalysisProcess";
import { AnalysisProcessProps } from "../DocumentPreview/hooks/analysisProcess/types";

export const useDocumentAnalysis = (storagePath: string, onAnalysisComplete?: () => void) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const { toast } = useToast();

  const analysisProcessProps: AnalysisProcessProps = {
    setAnalysisStep,
    setProgress,
    setError,
    setProcessingStage,
    toast,
    onAnalysisComplete
  };

  const { executeAnalysisProcess } = useAnalysisProcess(analysisProcessProps);

  // Enhancement: Cache document analysis results to avoid reprocessing
  const getDocumentAnalysisCache = async (documentPath: string) => {
    try {
      const { data: document } = await supabase
        .from('documents')
        .select('id, ai_processing_status, metadata')
        .eq('storage_path', documentPath)
        .maybeSingle();
        
      // Return cached analysis if complete and valid
      if (document?.ai_processing_status === 'complete' && 
          document?.metadata?.processing_steps_completed?.length >= 8) {
        console.log('Using cached document analysis');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error checking document analysis cache:', err);
      return false;
    }
  };

  const handleAnalyzeDocument = async (currentSession = session) => {
    setError(null);
    
    try {
      if (!currentSession) {
        console.error("No session available for document analysis");
        throw new Error('You must be logged in to analyze documents');
      }

      setAnalyzing(true);
      
      // Check if we already have cached analysis
      const hasCachedAnalysis = await getDocumentAnalysisCache(storagePath);
      if (hasCachedAnalysis) {
        console.log('Document already analyzed, using cached results');
        setProgress(100);
        setAnalysisStep("Analysis complete - using cached results");
        
        // Short delay to show the completion message before ending
        setTimeout(() => {
          setAnalyzing(false);
          if (onAnalysisComplete) onAnalysisComplete();
        }, 1500);
        return;
      }
      
      // Performance optimization: Run analysis in a non-blocking way
      // This allows the UI to remain responsive during processing
      executeAnalysisProcess(storagePath, currentSession);
      
    } catch (error: any) {
      console.error('Document analysis failed:', error);
      setError(error.message || 'An unknown error occurred');
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze document"
      });
    } finally {
      // Note: We don't set analyzing to false here anymore
      // It will be set to false when the process completes
    }
  };

  useEffect(() => {
    // Listen for document status updates to update progress in real-time
    const channel = supabase
      .channel('document_analysis_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `storage_path=eq.${storagePath}`,
        },
        (payload) => {
          console.log('Document status update:', payload);
          const metadata = payload.new.metadata;
          
          // Update UI based on processing stage
          if (metadata?.processing_stage) {
            setProcessingStage(metadata.processing_stage);
            
            // Calculate progress based on completed steps
            if (metadata?.processing_steps_completed?.length) {
              const completedSteps = metadata.processing_steps_completed.length;
              const totalSteps = 8; // Total number of processing steps
              const calculatedProgress = Math.min(Math.round((completedSteps / totalSteps) * 100), 100);
              setProgress(calculatedProgress);
            }
          }
          
          // If processing is complete, end the analyzing state
          if (payload.new.ai_processing_status === 'complete') {
            setProgress(100);
            setAnalyzing(false);
            if (onAnalysisComplete) onAnalysisComplete();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storagePath, onAnalysisComplete]);

  useEffect(() => {
    if (session && storagePath && !analyzing) {
      const checkDocumentStatus = async () => {
        try {
          const { data: document } = await supabase
            .from('documents')
            .select('ai_processing_status, metadata')
            .eq('storage_path', storagePath)
            .maybeSingle();
            
          if (document && 
             (document.ai_processing_status === 'pending' || 
              document.ai_processing_status === 'failed' ||
              document.metadata?.processing_steps_completed?.length < 8)) {
            console.log('Document needs analysis, current status:', document.ai_processing_status);
            handleAnalyzeDocument(session);
          }
        } catch (err) {
          console.error('Error checking document status:', err);
        }
      };
      
      checkDocumentStatus();
    }
  }, [session, storagePath, analyzing]);

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
