
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
  const { setAnalysisStep, setProgress } = context;
  
  setAnalysisStep("Stage 2: Document Classification & Understanding...");
  setProgress(25);
  
  const publicUrl = supabase.storage.from('documents').getPublicUrl(documentRecord.storage_path).data.publicUrl;
  console.log('Extracting text from PDF at URL:', publicUrl);
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
};
