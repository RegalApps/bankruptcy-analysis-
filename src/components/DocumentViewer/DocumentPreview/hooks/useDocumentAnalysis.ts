
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  useAnalysisProcess,
  AnalysisProcessProps
} from "./analysisProcess/useAnalysisProcess";

export const useDocumentAnalysis = (storagePath: string, onAnalysisComplete?: () => void) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const analysisProcessProps: AnalysisProcessProps = {
    setAnalysisStep,
    setProgress,
    setError,
    toast,
    onAnalysisComplete
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

  // When mounted, check if analysis is needed but not yet started
  useEffect(() => {
    if (session && storagePath && !analyzing) {
      // Check current document status
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
            // If pending or failed, restart analysis
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
    setSession,
    handleAnalyzeDocument
  };
};
