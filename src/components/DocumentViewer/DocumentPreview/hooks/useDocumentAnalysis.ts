
import { useState, useCallback } from "react";
import { useProcessingStages } from "./analysisProcess/useAnalysisProcess";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useDocumentAnalysis = (
  storagePath: string,
  onAnalysisComplete?: (id: string) => void // Accept an ID parameter
) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const {
    runProcessingStage,
    currentStage: processingStage
  } = useProcessingStages();

  const handleAnalyzeDocument = useCallback(async () => {
    if (!storagePath) {
      setError("No document path provided");
      return;
    }

    console.log("Starting document analysis for:", storagePath);
    setAnalyzing(true);
    setError(null);
    setProgress(0);
    setAnalysisStep(1);

    try {
      // Extract document ID from storage path or use the path itself as ID
      const documentId = storagePath.split("/").pop() || storagePath;
      
      // Process stages sequentially
      let currentProgress = 0;
      const incrementProgress = () => {
        currentProgress += 12.5; // 8 stages total = 12.5% each
        setProgress(Math.min(currentProgress, 100));
        setAnalysisStep(prev => prev + 1);
      };

      // Run each processing stage
      await runProcessingStage("documentIngestion", incrementProgress);
      await runProcessingStage("documentClassification", incrementProgress);
      await runProcessingStage("dataExtraction", incrementProgress);
      await runProcessingStage("documentOrganization", incrementProgress);
      await runProcessingStage("riskAssessment", incrementProgress);
      await runProcessingStage("issuePrioritization", incrementProgress);
      await runProcessingStage("collaborationSetup", incrementProgress);
      await runProcessingStage("continuousLearning", incrementProgress);

      setProgress(100);
      console.log("Document analysis complete");
      
      // Call the callback with the document ID if provided
      if (onAnalysisComplete) {
        onAnalysisComplete(documentId);
      }
      
      toast.success("Document analysis complete");
    } catch (err: any) {
      console.error("Document analysis error:", err);
      setError(err.message || "Analysis failed");
      toast.error(`Analysis error: ${err.message || "Unknown error"}`);
    } finally {
      setAnalyzing(false);
    }
  }, [storagePath, runProcessingStage, onAnalysisComplete]);

  return {
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    handleAnalyzeDocument
  };
};
