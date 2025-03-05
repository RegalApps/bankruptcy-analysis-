
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useDocumentAnalysis } from "./useDocumentAnalysis";

export const usePreviewState = (storagePath: string, title?: string, onAnalysisComplete?: () => void) => {
  const [previewError, setPreviewError] = useState<string | null>(null);
  const {
    analyzing,
    error,
    analysisStep,
    progress,
    setSession,
    handleAnalyzeDocument
  } = useDocumentAnalysis(storagePath, onAnalysisComplete);
  
  const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;
  
  const isExcelFile = 
    storagePath?.endsWith('.xlsx') || 
    storagePath?.endsWith('.xls') ||
    title?.endsWith('.xlsx') || 
    title?.endsWith('.xls');

  // Fetch session on component mount and start analysis when ready
  useEffect(() => {
    console.log('DocumentPreview mounted with storagePath:', storagePath);
    
    let mounted = true;
    const initializeComponent = async () => {
      try {
        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log("Current auth session in DocumentPreview:", currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          
          // If we have a session and there's a storage path but we're not already analyzing
          // and there's no error, start the analysis
          if (storagePath && !analyzing && !error && !isExcelFile) {
            // Small delay to ensure the session state is updated
            setTimeout(() => {
              if (mounted) handleAnalyzeDocument(currentSession);
            }, 100);
          }
        } else {
          throw new Error("No active session found. Please sign in again.");
        }
      } catch (err: any) {
        console.error("Error fetching session:", err);
      }
    };
    
    initializeComponent();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      if (mounted) {
        console.log("Auth state changed in DocumentPreview:", updatedSession);
        setSession(updatedSession);
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [storagePath, analyzing, error, setSession, handleAnalyzeDocument, isExcelFile]);

  const handleRefreshPreview = () => {
    setPreviewError(null);
    // Force reload the iframe
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.src) {
      iframe.src = `${iframe.src}?refresh=${new Date().getTime()}`;
    }
  };

  const handleIframeError = () => {
    setPreviewError("There was an issue loading the document preview.");
  };

  return {
    previewError,
    setPreviewError,
    publicUrl,
    isExcelFile,
    analyzing,
    error,
    analysisStep,
    progress,
    handleRefreshPreview,
    handleIframeError,
    handleAnalyzeDocument
  };
};
