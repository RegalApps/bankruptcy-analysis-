
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAnalysisProcess } from "./analysisProcess/useAnalysisProcess";
import { AnalysisProcessProps } from "./analysisProcess/types";
import { Session } from "@supabase/supabase-js";

export const useDocumentAnalysis = (storagePath: string, onAnalysisComplete?: () => void) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
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
        // First attempt to refresh the token before giving up
        const { data: refreshedSession, error: refreshError } = await supabase.auth.getSession();
        
        if (refreshError || !refreshedSession.session) {
          console.error("No active session found for document analysis:", refreshError);
          throw new Error('Authentication required: You must be logged in to analyze documents');
        }
        
        currentSession = refreshedSession.session;
        setSession(currentSession);
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
      
      // Execute the analysis process with valid session
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

  // Check document status and session on initial load
  useEffect(() => {
    const checkSessionAndDocument = async () => {
      try {
        // Always get a fresh session to prevent token expiration issues
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(`Authentication error: ${sessionError.message}`);
          return;
        }
        
        if (!sessionData.session) {
          console.log("No active session found, trying to refresh");
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !refreshData.session) {
            console.error("Failed to refresh session:", refreshError);
            setError("Your session has expired. Please log in again.");
            return;
          }
          
          setSession(refreshData.session);
        } else {
          setSession(sessionData.session);
        }
        
        // Now check document status if we have a session and storagePath
        if (sessionData.session && storagePath && !analyzing && !error) {
          const { data: document, error: docError } = await supabase
            .from('documents')
            .select('id, ai_processing_status, metadata, type, title')
            .eq('storage_path', storagePath)
            .maybeSingle();
            
          if (docError) {
            console.error("Error fetching document status:", docError);
            return;
          }
            
          if (document) {
            console.log("Checking document analysis status:", document.ai_processing_status);
            
            // For documents without complete analysis, trigger analysis
            if (document.ai_processing_status === 'pending' || 
                document.ai_processing_status === 'failed' ||
                !document.metadata?.processing_steps_completed?.length ||
                document.metadata?.processing_steps_completed?.length < 4) {
              console.log('Document needs analysis, current status:', document.ai_processing_status);
              handleAnalyzeDocument(sessionData.session);
            }
          } else {
            console.log("Document not found in database, cannot check status");
          }
        }
      } catch (err) {
        console.error("Error in session/document check:", err);
      }
    };
    
    if (storagePath) {
      checkSessionAndDocument();
    }
  }, [storagePath, analyzing, error]);

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
