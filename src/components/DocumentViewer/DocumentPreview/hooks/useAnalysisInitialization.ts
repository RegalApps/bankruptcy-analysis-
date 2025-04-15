
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface UseAnalysisInitializationProps {
  storagePath: string;
  fileExists: boolean;
  isExcelFile: boolean;
  analyzing: boolean;
  error: string | null;
  setSession: (session: Session | null) => void;
  handleAnalyzeDocument: (session?: Session | null) => void;
  setPreviewError: (error: string | null) => void;
  onAnalysisComplete?: (id: string) => void;
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
}: UseAnalysisInitializationProps) => {
  // Set up session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  // Auto-analyze if appropriate conditions are met
  useEffect(() => {
    if (
      fileExists &&
      !isExcelFile &&
      !analyzing &&
      !error &&
      !bypassAnalysis
    ) {
      console.log("Auto-triggering document analysis");
      handleAnalyzeDocument();
    } else if (fileExists && isExcelFile && !analyzing && !error) {
      console.log("Skipping analysis for Excel file");
      if (onAnalysisComplete) {
        onAnalysisComplete("excel-file-skipped");
      }
    } else if (bypassAnalysis && fileExists) {
      console.log("Analysis bypassed as requested");
      if (onAnalysisComplete) {
        // For bypassed analysis, try to get the document ID if possible
        const extractDocumentId = async () => {
          try {
            const { data } = await supabase
              .from('documents')
              .select('id')
              .eq('storage_path', storagePath)
              .maybeSingle();
            
            if (data?.id) {
              onAnalysisComplete(data.id);
            } else {
              // Fall back to a generated ID if no document record exists
              const fallbackId = `${storagePath.split('/').pop()}-${Date.now()}`;
              onAnalysisComplete(fallbackId);
            }
          } catch (err) {
            // If database lookup fails, use a fallback ID
            const fallbackId = `bypass-${Date.now()}`;
            onAnalysisComplete(fallbackId);
          }
        };
        
        extractDocumentId();
      }
    }
  }, [
    fileExists,
    isExcelFile,
    analyzing,
    error,
    handleAnalyzeDocument,
    bypassAnalysis,
    onAnalysisComplete,
    storagePath
  ]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setPreviewError(`Analysis error: ${error}`);
    }
  }, [error, setPreviewError]);
};
