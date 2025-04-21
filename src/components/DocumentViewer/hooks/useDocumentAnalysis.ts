
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAnalysisProcess } from "./analysisProcess/useAnalysisProcess";
import { AnalysisProcessProps } from "./analysisProcess/types";

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

  // Function to manually trigger document analysis
  const handleAnalyzeDocument = async (currentSession = session) => {
    setError(null);
    
    try {
      if (!currentSession) {
        console.error("No session available for document analysis");
        throw new Error('You must be logged in to analyze documents');
      }

      setAnalyzing(true);
      toast({
        title: "Starting document analysis",
        description: "This may take a moment...",
      });
      
      // Get document information from storage path
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('id, title, type, metadata')
        .eq('storage_path', storagePath)
        .maybeSingle();
        
      if (docError) {
        throw new Error(`Error fetching document: ${docError.message}`);
      }
      
      if (!document) {
        throw new Error('Document not found in database');
      }
      
      console.log("Starting analysis for document:", document.id);
      
      // Update status to processing
      await supabase
        .from('documents')
        .update({
          ai_processing_status: 'processing',
          metadata: {
            ...(document?.metadata || {}),
            processing_started: new Date().toISOString()
          }
        })
        .eq('id', document.id);
      
      // Execute the analysis process
      await executeAnalysisProcess(storagePath, currentSession);
      
      toast({
        title: "Analysis complete",
        description: "Document has been successfully analyzed.",
      });
      
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

  // Listen for document status updates
  useEffect(() => {
    if (!storagePath) return;
    
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

  // Check document status on initial load
  useEffect(() => {
    if (session && storagePath && !analyzing) {
      const checkDocumentStatus = async () => {
        try {
          const { data: document, error: docError } = await supabase
            .from('documents')
            .select('id, ai_processing_status, metadata, type, title')
            .eq('storage_path', storagePath)
            .maybeSingle();
            
          if (docError) {
            console.error("Error fetching document status:", docError);
            return;
          }
            
          if (!document) {
            console.log("Document not found in database, cannot check status");
            return;
          }
            
          console.log("Checking document analysis status:", document.ai_processing_status);
          
          // For documents without complete analysis, trigger analysis
          if (document && 
             (document.ai_processing_status === 'pending' || 
              document.ai_processing_status === 'failed' ||
              !document.metadata?.processing_steps_completed?.length ||
              document.metadata?.processing_steps_completed?.length < 4)) {
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
