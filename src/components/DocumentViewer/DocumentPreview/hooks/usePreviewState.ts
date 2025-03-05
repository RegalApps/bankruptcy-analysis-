
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useDocumentAnalysis } from "./useDocumentAnalysis";
import { useToast } from "@/hooks/use-toast";

export const usePreviewState = (storagePath: string, title?: string, onAnalysisComplete?: () => void) => {
  const [previewError, setPreviewError] = useState<string | null>(null);
  const { toast } = useToast();
  
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
          
          // Check document status to determine if analysis is needed
          if (storagePath && !isExcelFile) {
            const { data: document } = await supabase
              .from('documents')
              .select('ai_processing_status, metadata')
              .eq('storage_path', storagePath)
              .maybeSingle();
              
            if (document) {
              const shouldStartAnalysis = 
                document.ai_processing_status === 'pending' || 
                document.ai_processing_status === 'failed' || 
                !document.metadata?.processing_steps_completed ||
                document.metadata?.processing_steps_completed.length < 6;
                
              if (shouldStartAnalysis && !analyzing && !error) {
                console.log('Starting analysis based on document status:', document.ai_processing_status);
                // Small delay to ensure the session state is updated
                setTimeout(() => {
                  if (mounted) handleAnalyzeDocument(currentSession);
                }, 100);
              } else if (document.ai_processing_status === 'completed') {
                toast({
                  title: "Document Analyzed",
                  description: "This document has already been fully processed",
                  duration: 3000
                });
              }
            } else {
              // If no document record found, show error
              setPreviewError("Document record not found. It may have been deleted.");
            }
          }
        } else {
          throw new Error("No active session found. Please sign in again.");
        }
      } catch (err: any) {
        console.error("Error fetching session:", err);
        setPreviewError(err.message || "Failed to initialize document preview");
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
    
    // Set up realtime subscription for document updates
    const channel = supabase
      .channel(`document_${storagePath}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `storage_path=eq.${storagePath}`
        },
        (payload) => {
          console.log('Document updated:', payload);
          if (payload.new.ai_processing_status === 'completed' && onAnalysisComplete) {
            onAnalysisComplete();
          }
        }
      )
      .subscribe();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [storagePath, analyzing, error, setSession, handleAnalyzeDocument, isExcelFile, onAnalysisComplete, toast]);

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
