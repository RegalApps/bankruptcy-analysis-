
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
  onAnalysisComplete: (documentId: string) => void;
  bypassAnalysis: boolean;
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
  bypassAnalysis
}: AnalysisInitializationProps) => {
  // Initialize session and attempt document analysis if needed
  useEffect(() => {
    if (!fileExists || bypassAnalysis) {
      return;
    }

    // Don't analyze Excel files
    if (isExcelFile) {
      console.log("Skipping analysis for Excel file");
      return;
    }

    // Stop if already analyzing or there's an analysis error
    if (analyzing || error) {
      return;
    }

    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          setSession(data.session);

          // Check if document has been analyzed already
          const { data: document } = await supabase
            .from('documents')
            .select('ai_processing_status')
            .eq('storage_path', storagePath)
            .maybeSingle();

          if (!document || document.ai_processing_status !== 'complete') {
            console.log("Document needs analysis, starting...");
            handleAnalyzeDocument(data.session);
          } else {
            console.log("Document already analyzed");
            onAnalysisComplete(storagePath);
          }
        }
      } catch (error: any) {
        console.error("Error initializing session:", error);
        setPreviewError(`Authentication error: ${error.message}`);
      }
    };

    initSession();
  }, [fileExists, isExcelFile, analyzing, error, storagePath, setSession, handleAnalyzeDocument, setPreviewError, bypassAnalysis, onAnalysisComplete]);
};
