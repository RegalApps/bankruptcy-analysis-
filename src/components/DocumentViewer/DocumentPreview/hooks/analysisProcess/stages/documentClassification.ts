
import { supabase } from "@/lib/supabase";
import { DocumentRecord } from "../../types";
import { updateAnalysisStatus } from "../documentStatusUpdates";
import { AnalysisProcessProps } from "../types";
import { isForm76 } from "../formIdentification";

export const documentClassification = async (
  documentRecord: DocumentRecord,
  context: AnalysisProcessProps
): Promise<{ documentText: string; isForm76: boolean }> => {
  const { setAnalysisStep, setProgress } = context;
  setAnalysisStep("Stage 2: Document Classification & Understanding...");
  setProgress(25);
  
  try {
    // Get document content from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(documentRecord.storage_path);
      
    if (fileError) {
      throw fileError;
    }
    
    // Convert file to text (simplified for implementation)
    const documentText = await fileData.text();
    
    // Check if this is Form 76 using our enhanced detection
    const isForm76Document = isForm76(documentRecord, documentText);
    
    // Check if this is Form 47 (Consumer Proposal)
    const isForm47 = documentRecord.title?.toLowerCase().includes('form 47') || 
                    documentRecord.title?.toLowerCase().includes('consumer proposal') ||
                    documentText.toLowerCase().includes('consumer proposal') ||
                    documentText.toLowerCase().includes('form 47');
    
    console.log(`Document classification results - Form 76: ${isForm76Document}, Form 47: ${isForm47}`);
    
    // Update document with classification results
    await supabase
      .from('documents')
      .update({
        metadata: {
          ...documentRecord.metadata,
          formType: isForm76Document ? 'form-76' : (isForm47 ? 'form-47' : 'unknown'),
          formNumber: isForm76Document ? '76' : (isForm47 ? '47' : ''),
          classification_confidence: isForm76Document || isForm47 ? 'high' : 'medium',
          processing_stage: 'classification',
          processing_steps_completed: [...(documentRecord.metadata?.processing_steps_completed || []), 'ingestion_completed']
        }
      })
      .eq('id', documentRecord.id);
      
    // Update document status
    await updateAnalysisStatus(documentRecord, 'classification', 'ingestion_completed');
    
    return { documentText, isForm76: isForm76Document };
  } catch (error) {
    console.error('Error in document classification:', error);
    throw error;
  }
};
