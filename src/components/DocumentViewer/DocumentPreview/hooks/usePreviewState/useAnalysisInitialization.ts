
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

interface AnalysisInitializationProps {
  storagePath: string;
  fileExists: boolean;
  isExcelFile: boolean;
  analyzing: boolean;
  error: string | null;
  setSession: (session: Session | null) => void;
  handleAnalyzeDocument: (session: Session | null) => void;
  setPreviewError: (error: string | null) => void;
  onAnalysisComplete?: () => void;
  bypassAnalysis?: boolean;
}

export const useAnalysisInitialization = ({
  storagePath,
  fileExists,
  isExcelFile,
  analyzing,
  error,
  setSession,
  handleAnalyzeDocument,
  setPreviewError,
  onAnalysisComplete,
  bypassAnalysis = false
}: AnalysisInitializationProps) => {
  const { toast } = useToast();

  // Fetch session on component mount and start analysis when ready
  useEffect(() => {
    console.log('DocumentPreview mounted with storagePath:', storagePath, 'bypassAnalysis:', bypassAnalysis);
    
    if (!fileExists) {
      console.error('File does not exist, skipping analysis');
      return;
    }
    
    if (bypassAnalysis) {
      console.log('Bypassing analysis due to user preference');
      return;
    }
    
    let mounted = true;
    const initializeComponent = async () => {
      try {
        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log("Current auth session in DocumentPreview:", currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          
          // Skip analysis for Excel files
          if (isExcelFile) {
            console.log('Skipping analysis for Excel file');
            return;
          }
          
          // Check document status to determine if analysis is needed
          if (storagePath) {
            const { data: document, error: docError } = await supabase
              .from('documents')
              .select('ai_processing_status, metadata')
              .eq('storage_path', storagePath)
              .maybeSingle();
              
            if (docError) {
              console.error('Error fetching document record:', docError);
              setPreviewError(`Database error: ${docError.message}`);
              return;
            }
              
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
              setPreviewError("Document record not found in the database. It may have been deleted.");
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
    
    return () => {
      mounted = false;
    };
  }, [storagePath, analyzing, error, setSession, handleAnalyzeDocument, isExcelFile, onAnalysisComplete, toast, fileExists, setPreviewError, bypassAnalysis]);
};
