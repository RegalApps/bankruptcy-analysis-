
import { supabase } from "@/lib/supabase";
import { DocumentRecord } from "../types";

/**
 * Updates the document's analysis status with the current processing stage
 */
export const updateAnalysisStatus = async (
  documentRecord: DocumentRecord,
  processingStage: string,
  stepCompleted: string
) => {
  const updatedMetadata = {
    ...documentRecord.metadata,
    processing_stage: processingStage,
    processing_steps_completed: [
      ...(documentRecord.metadata?.processing_steps_completed || []),
      stepCompleted
    ]
  };

  return await supabase
    .from('documents')
    .update({
      ai_processing_status: 'processing',
      metadata: updatedMetadata
    })
    .eq('id', documentRecord.id);
};
