
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AnalysisInitializationProps {
  storagePath: string;
  fileExists: boolean;
  isExcelFile: boolean;
  analyzing: boolean;
  error: string | null;
  setSession: (session: any) => void;
  handleAnalyzeDocument: (session: any) => void;
  setPreviewError: (error: string | null) => void;
  onAnalysisComplete?: (id: string) => void;
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
  const [hasInitializedAnalysis, setHasInitializedAnalysis] = useState(false);
  const [hasCheckedDocumentStatus, setHasCheckedDocumentStatus] = useState(false);

  // Load session and initialize document analysis
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data && data.session) {
          setSession(data.session);
        } else {
          console.log("No active session found");
          setPreviewError('Authentication required');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    
    fetchSession();
  }, [setSession, setPreviewError]);

  // Initialize document analysis if conditions are met
  useEffect(() => {
    if (
      storagePath && 
      fileExists && 
      !analyzing && 
      !hasInitializedAnalysis && 
      !bypassAnalysis &&
      !isExcelFile // Don't analyze Excel files
    ) {
      const checkDocumentStatus = async () => {
        try {
          const { data } = await supabase
            .from('documents')
            .select('id, storage_path, ai_processing_status')
            .eq('storage_path', storagePath)
            .maybeSingle();
          
          setHasCheckedDocumentStatus(true);
            
          // If document exists but hasn't been processed, start analysis
          if (data && (
            data.ai_processing_status === 'pending' || 
            data.ai_processing_status === 'failed' ||
            !data.ai_processing_status
          )) {
            console.log("Document found but needs analysis");
            
            const { data: sessionData } = await supabase.auth.getSession();
            
            if (sessionData?.session) {
              setSession(sessionData.session);
              handleAnalyzeDocument(sessionData.session);
              setHasInitializedAnalysis(true);
            }
          } else if (data && data.ai_processing_status === 'complete') {
            console.log("Document analysis already complete");
            setHasInitializedAnalysis(true);
            
            // If we have a document ID and analysis is complete, call the callback
            if (data.id && onAnalysisComplete) {
              onAnalysisComplete(data.id);
            }
          }
        } catch (err) {
          console.error("Error checking document status:", err);
        }
      };
      
      checkDocumentStatus();
    }
  }, [
    storagePath, 
    fileExists, 
    analyzing, 
    hasInitializedAnalysis,
    setSession,
    handleAnalyzeDocument,
    bypassAnalysis,
    isExcelFile,
    onAnalysisComplete
  ]);

  // Handle errors in document analysis
  useEffect(() => {
    if (error) {
      toast.error(`Analysis Error: ${error}`);
      setPreviewError(error);
    }
  }, [error, setPreviewError]);

  return { hasInitializedAnalysis, hasCheckedDocumentStatus };
};
