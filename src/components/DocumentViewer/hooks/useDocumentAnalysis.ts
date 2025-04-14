import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAnalysisProcess } from "./analysisProcess/useAnalysisProcess";
import { AnalysisProcessProps } from "./analysisProcess/types";

export const useDocumentAnalysis = (storagePath: string, onAnalysisComplete?: (id: string) => void) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const { toast } = useToast();

  const handleAnalysisCompleteWrapper = () => {
    if (onAnalysisComplete) {
      onAnalysisComplete(storagePath);
    }
  };

  const analysisProcessProps: AnalysisProcessProps = {
    setAnalysisStep,
    setProgress,
    setError,
    setProcessingStage,
    toast,
    onAnalysisComplete: handleAnalysisCompleteWrapper
  };

  const { executeAnalysisProcess } = useAnalysisProcess(analysisProcessProps);

  const getDocumentAnalysisCache = async (documentPath: string) => {
    try {
      const { data: document } = await supabase
        .from('documents')
        .select('id, ai_processing_status, metadata, type, title')
        .eq('storage_path', documentPath)
        .maybeSingle();
        
      const isExcelFile = document?.type?.includes('excel') || 
                         document?.title?.toLowerCase().endsWith('.xlsx') ||
                         document?.title?.toLowerCase().endsWith('.xls') ||
                         document?.metadata?.fileType === 'excel';
      
      if (isExcelFile) {
        console.log('Excel file detected - using simplified analysis path');
        
        await supabase
          .from('documents')
          .update({
            ai_processing_status: 'complete',
            metadata: {
              ...(document?.metadata || {}),
              fileType: 'excel',
              excel_processing_only: true,
              processing_complete: true,
              last_analyzed: new Date().toISOString()
            }
          })
          .eq('id', document?.id);
          
        return true;
      }
        
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
      
      const { data: document } = await supabase
        .from('documents')
        .select('id, title, type')
        .eq('storage_path', storagePath)
        .maybeSingle();
        
      const isExcelFile = document?.type?.includes('excel') || 
                         document?.title?.toLowerCase().endsWith('.xlsx') ||
                         document?.title?.toLowerCase().endsWith('.xls');
                         
      if (isExcelFile) {
        console.log('Excel file detected - using fast path processing');
        
        setAnalysisStep("Processing Excel file - extracting metadata only");
        
        await supabase.functions.invoke('analyze-document', {
          body: { 
            documentId: document?.id,
            isExcelFile: true,
            title: document?.title || '',
          }
        });
        
        setProgress(100);
        setAnalysisStep("Excel file processing complete");
        
        setTimeout(() => {
          setAnalyzing(false);
          handleAnalysisCompleteWrapper();
        }, 1500);
        
        return;
      }
      
      const hasCachedAnalysis = await getDocumentAnalysisCache(storagePath);
      if (hasCachedAnalysis) {
        console.log('Document already analyzed, using cached results');
        setProgress(100);
        setAnalysisStep("Analysis complete - using cached results");
        
        setTimeout(() => {
          setAnalyzing(false);
          handleAnalysisCompleteWrapper();
        }, 1500);
        return;
      }
      
      executeAnalysisProcess(storagePath, currentSession);
    } catch (error: any) {
      console.error('Document analysis failed:', error);
      setError(error.message || 'An unknown error occurred');
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze document"
      });
      setAnalyzing(false);
    }
  };

  useEffect(() => {
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
          const metadata = payload.new.metadata;
          
          if (metadata?.processing_stage) {
            setProcessingStage(metadata.processing_stage);
            
            if (metadata?.processing_steps_completed?.length) {
              const completedSteps = metadata.processing_steps_completed.length;
              const totalSteps = 8;
              const calculatedProgress = Math.min(Math.round((completedSteps / totalSteps) * 100), 100);
              setProgress(calculatedProgress);
            }
          }
          
          if (payload.new.ai_processing_status === 'complete') {
            setProgress(100);
            setAnalyzing(false);
            if (onAnalysisComplete) onAnalysisComplete(storagePath);
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
            .select('ai_processing_status, metadata, type, title')
            .eq('storage_path', storagePath)
            .maybeSingle();
            
          const isExcelFile = document?.type?.includes('excel') || 
                           document?.title?.toLowerCase().endsWith('.xlsx') ||
                           document?.title?.toLowerCase().endsWith('.xls') ||
                           document?.metadata?.fileType === 'excel';
                         
          if (isExcelFile) {
            console.log('Excel file detected - using simplified processing path');
            
            if (document && document.ai_processing_status !== 'complete') {
              await supabase
                .from('documents')
                .update({
                  ai_processing_status: 'complete',
                  metadata: {
                    ...(document.metadata || {}),
                    fileType: 'excel',
                    excel_processing_only: true,
                    processing_complete: true,
                    last_analyzed: new Date().toISOString()
                  }
                })
                .eq('storage_path', storagePath);
                
              if (onAnalysisComplete) {
                onAnalysisComplete(storagePath);
              }
            }
            
            return;
          }
          
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
