
import { supabase } from "@/lib/supabase";
import { DocumentRecord } from "../../types";
import { AnalysisProcessContext } from "../types";

export const continuousLearning = async (
  documentRecord: DocumentRecord,
  context: AnalysisProcessContext
): Promise<void> => {
  const { setAnalysisStep, setProgress, toast, onAnalysisComplete, isForm76 } = context;
  
  // Final update - processing complete
  await supabase
    .from('documents')
    .update({
      ai_processing_status: 'completed',
      metadata: {
        ...documentRecord.metadata,
        processing_stage: 'completed',
        processing_steps_completed: [...(documentRecord.metadata?.processing_steps_completed || []), 'analysis_completed'],
        completion_date: new Date().toISOString()
      }
    })
    .eq('id', documentRecord.id);

  setAnalysisStep("Stage 8: Continuous AI Learning & Improvement...");
  setProgress(100);
  
  toast({
    title: "Analysis Complete",
    description: isForm76 ? 
      "Form 76 has been fully analyzed with client details extraction" : 
      "Document has been analyzed with content extraction"
  });

  if (onAnalysisComplete) {
    onAnalysisComplete();
  }
};
