
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
  onAnalysisComplete?: (id: string) => void; // Updated to accept id parameter
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
    console.log('DocumentPreview initialized with storagePath:', storagePath, 'bypassAnalysis:', bypassAnalysis);
    
    if (!storagePath || !fileExists) {
      console.error('File does not exist or no storage path, skipping analysis');
      return;
    }
    
    if (bypassAnalysis) {
      console.log('Bypassing analysis due to user preference');
      if (onAnalysisComplete) {
        // If we're bypassing analysis, still call the completion handler with a document ID if available
        const getDocumentId = async () => {
          try {
            const { data } = await supabase
              .from('documents')
              .select('id')
              .eq('storage_path', storagePath)
              .maybeSingle();
            
            if (data && data.id) {
              onAnalysisComplete(data.id);
            } else {
              // If no document ID is available, use the storagePath as a fallback
              onAnalysisComplete(storagePath);
            }
          } catch (err) {
            console.error("Error getting document ID:", err);
            // Use storagePath as fallback if we can't get the document ID
            onAnalysisComplete(storagePath);
          }
        };
        
        getDocumentId();
      }
      return;
    }
    
    let mounted = true;
    let sessionCheckTimeout: number | null = null;

    const initializeComponent = async () => {
      try {
        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log("Current auth session in DocumentPreview:", currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          
          // For Excel files, only extract basic metadata (client name, etc.) without full analysis
          if (isExcelFile) {
            console.log('Excel file detected - skipping full analysis, only extracting metadata');
            
            // Mark Excel file as processed to prevent repeated analysis attempts
            if (storagePath) {
              try {
                const { data: document } = await supabase
                  .from('documents')
                  .select('id, ai_processing_status')
                  .eq('storage_path', storagePath)
                  .maybeSingle();
                  
                if (document) {
                  await supabase
                    .from('documents')
                    .update({
                      ai_processing_status: 'complete',
                      metadata: {
                        processing_complete: true,
                        file_type: 'excel',
                        last_analyzed: new Date().toISOString(),
                        processing_time_ms: 0,
                        excel_processing_only: true
                      }
                    })
                    .eq('id', document.id);
                    
                  console.log('Excel file marked as processed without full analysis');
                  
                  if (onAnalysisComplete && document.id) {
                    onAnalysisComplete(document.id);
                  }
                }
              } catch (err) {
                console.error('Error updating Excel document status:', err);
              }
            }
            return;
          }
          
          // Check document status to determine if analysis is needed (for non-Excel files)
          if (storagePath) {
            const { data: document, error: docError } = await supabase
              .from('documents')
              .select('id, ai_processing_status, metadata')
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
                sessionCheckTimeout = window.setTimeout(() => {
                  if (mounted) handleAnalyzeDocument(currentSession);
                }, 100);
              } else if (document.ai_processing_status === 'completed' || document.ai_processing_status === 'complete') {
                console.log('Document already analyzed');
                if (onAnalysisComplete && document.id) {
                  onAnalysisComplete(document.id);
                }
              }
            } else {
              // If no document record found but we have a storage path and file exists,
              // we can still show the preview without analysis
              if (onAnalysisComplete) {
                // Use storagePath as fallback if we can't get the document ID
                onAnalysisComplete(storagePath);
              }
            }
          }
        } else {
          console.log("No active session found, retrying in 2 seconds");
          // Retry getting session after a delay
          sessionCheckTimeout = window.setTimeout(initializeComponent, 2000);
        }
      } catch (err: any) {
        console.error("Error fetching session:", err);
        setPreviewError(err.message || "Failed to initialize document preview");
      }
    };
    
    initializeComponent();
    
    return () => {
      mounted = false;
      if (sessionCheckTimeout) {
        clearTimeout(sessionCheckTimeout);
      }
    };
  }, [storagePath, analyzing, error, setSession, handleAnalyzeDocument, isExcelFile, onAnalysisComplete, toast, fileExists, setPreviewError, bypassAnalysis]);
};
