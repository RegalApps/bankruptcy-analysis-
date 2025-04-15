
import { useState, useCallback } from "react";
import { useProcessingStages } from "./useProcessingStages";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Define the hook to accept a callback function that takes a document ID
const useDocumentAnalysis = (storagePath: string, onAnalysisComplete?: (id: string) => void) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const { runProcessingStage, currentStage } = useProcessingStages();
  
  const processingStage = currentStage;
  
  const handleAnalyzeDocument = useCallback(async (session?: any) => {
    if (analyzing) return;
    
    if (!storagePath) {
      setError('No document path provided');
      return;
    }
    
    setAnalyzing(true);
    setError(null);
    setAnalysisStep('starting');
    setProgress(0);
    
    try {
      // Extract document ID from storage path if not explicitly provided
      let documentId = storagePath.split('/').pop()?.split('.')[0] || 'unknown-doc';
      
      // Get document from database if available
      const { data: documentData } = await supabase
        .from('documents')
        .select('id, storage_path')
        .eq('storage_path', storagePath)
        .maybeSingle();
      
      if (documentData?.id) {
        documentId = documentData.id;
      }
      
      // Run processing stages
      setAnalysisStep('preprocessing');
      setProgress(10);
      await runProcessingStage('preprocessing', (progress) => {
        setProgress(20);
      });
      
      setAnalysisStep('extraction');
      setProgress(30);
      await runProcessingStage('extraction', (progress) => {
        setProgress(40);
      });
      
      setAnalysisStep('analysis');
      setProgress(60);
      await runProcessingStage('analysis', (progress) => {
        setProgress(80);
      });
      
      setAnalysisStep('finalization');
      setProgress(90);
      await runProcessingStage('finalization', (progress) => {
        setProgress(100);
      });
      
      setAnalysisStep('complete');
      
      // Call the completion callback with the document ID
      if (onAnalysisComplete) {
        console.log("Document analysis complete, calling callback with ID:", documentId);
        onAnalysisComplete(documentId);
      }
    } catch (err: any) {
      console.error('Error during document analysis:', err);
      setError(err.message || 'Unknown error during analysis');
      toast.error('Failed to analyze document');
    } finally {
      setAnalyzing(false);
    }
  }, [analyzing, storagePath, runProcessingStage, onAnalysisComplete]);
  
  return {
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    handleAnalyzeDocument
  };
};

export { useDocumentAnalysis };
