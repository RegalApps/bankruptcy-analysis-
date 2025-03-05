
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
  
  // Enhanced validation for storage path
  if (!documentRecord.storage_path) {
    console.error('Document record is missing storage_path', documentRecord);
    throw new Error('Document record is missing storage path. Cannot proceed with analysis.');
  }
  
  // Get the public URL with better error handling
  const { data: urlData, error: urlError } = supabase.storage.from('documents').getPublicUrl(documentRecord.storage_path);
  
  if (urlError || !urlData?.publicUrl) {
    console.error('Failed to get public URL:', urlError);
    throw new Error(`Failed to get document URL: ${urlError?.message || 'Unknown error'}`);
  }
  
  const publicUrl = urlData.publicUrl;
  console.log('Extracting text from PDF at URL:', publicUrl);
  
  let documentText = '';
  let retries = 0;
  const maxRetries = 3;
  
  while (retries < maxRetries) {
    try {
      documentText = await extractTextFromPdf(publicUrl);
      
      if (!documentText || documentText.trim().length < 50) {
        console.warn(`Insufficient text extracted (${documentText?.length || 0} chars). Attempt ${retries + 1}/${maxRetries}`);
        retries++;
        
        if (retries >= maxRetries) {
          console.error('All text extraction attempts failed');
          throw new Error('Could not extract sufficient text from the document after multiple attempts');
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // If we got here, we have successful text extraction
      break;
    } catch (error: any) {
      console.error(`Text extraction error (attempt ${retries + 1}/${maxRetries}):`, error);
      retries++;
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`Extracted ${documentText.length} characters of text from PDF`);
  
  // Update document with OCR status
  await updateAnalysisStatus(documentRecord, 'document_classification', 'ocr_completed');
  
  // Check if the document is a Form 76 with enhanced detection
  const formIs76 = isForm76(documentRecord, documentText);
  console.log('Is document Form 76:', formIs76);
  
  // If it's a Form 76, let's also update the document metadata
  if (formIs76) {
    try {
      await supabase
        .from('documents')
        .update({
          metadata: {
            ...documentRecord.metadata,
            formType: 'form-76',
            formNumber: '76',
            processing_step: 'form_identified'
          }
        })
        .eq('id', documentRecord.id);
        
      console.log('Updated document metadata to indicate Form 76');
    } catch (updateError) {
      // Don't fail the whole process if this update fails
      console.error('Error updating form type metadata:', updateError);
    }
  }
  
  return { documentText, isForm76: formIs76 };
};
