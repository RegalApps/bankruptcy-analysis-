
import { supabase } from "@/lib/supabase";
import { extractTextFromPdf } from "@/utils/documents/pdfUtils";
import { DocumentRecord } from "../../types";
import { updateAnalysisStatus } from "../documentStatusUpdates";
import { isForm76 } from "../formIdentification";
import { AnalysisProcessContext } from "../types";

export const documentClassification = async (
  documentRecord: DocumentRecord,
  context: AnalysisProcessContext
): Promise<{ documentText: string; isForm76: boolean }> => {
  const { setAnalysisStep, setProgress, setError } = context;
  
  setAnalysisStep("Stage 2: Document Classification & Understanding...");
  setProgress(25);
  
  // Validate storage path to prevent errors
  if (!documentRecord.storage_path) {
    console.error('Document record is missing storage_path');
    throw new Error('Document record is missing storage path. Cannot proceed with analysis.');
  }
  
  const publicUrl = supabase.storage.from('documents').getPublicUrl(documentRecord.storage_path).data.publicUrl;
  console.log('Extracting text from PDF at URL:', publicUrl);
  
  try {
    const documentText = await extractTextFromPdf(publicUrl);
    
    if (!documentText || documentText.trim().length < 50) {
      console.error('Insufficient text extracted from document. Length:', documentText?.length || 0);
      throw new Error('Could not extract sufficient text from the document');
    }
    
    console.log(`Extracted ${documentText.length} characters of text from PDF`);
    
    // Update document with OCR status
    await updateAnalysisStatus(documentRecord, 'document_classification', 'ocr_completed');
    
    // Check if the document is a Form 76
    const formIs76 = isForm76(documentRecord, documentText);
    console.log('Is document Form 76:', formIs76);
    
    return { documentText, isForm76: formIs76 };
  } catch (error: any) {
    console.error('Error during document classification:', error);
    
    // Update document status to reflect the error
    await supabase
      .from('documents')
      .update({
        ai_processing_status: 'failed',
        metadata: {
          ...documentRecord.metadata,
          processing_error: `Classification error: ${error.message}`,
          error_timestamp: new Date().toISOString()
        }
      })
      .eq('id', documentRecord.id);
      
    throw new Error(`Failed to classify document: ${error.message}`);
  }
};
