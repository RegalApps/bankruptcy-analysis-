
import { supabase } from "@/lib/supabase";
import { AnalysisProcessContext } from "../types";

export const continuousLearning = async (
  documentRecord: any,
  context: AnalysisProcessContext
) => {
  const { setAnalysisStep, setProgress, setProcessingStage } = context;
  
  try {
    setAnalysisStep("Continuous AI Learning & Improvement");
    setProcessingStage("continuous_learning");
    
    // Simulate AI learning process
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update document metadata to include the learning completion
    if (documentRecord && documentRecord.id) {
      const { data, error } = await supabase
        .from('documents')
        .update({
          metadata: {
            ...documentRecord.metadata,
            continuous_learning_completed: true,
            ai_learning_timestamp: new Date().toISOString(),
            processing_steps_completed: [
              ...(documentRecord.metadata?.processing_steps_completed || []),
              "continuous_learning"
            ]
          }
        })
        .eq('id', documentRecord.id);
      
      if (error) {
        console.error("Error updating document with continuous learning data:", error);
      }
    }
    
    // If we have an onAnalysisComplete callback, call it with the document ID
    if (context.onAnalysisComplete && documentRecord && documentRecord.id) {
      context.onAnalysisComplete(documentRecord.id);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in continuous learning stage:", error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in continuous learning"
    };
  }
};
