
import { supabase } from "@/lib/supabase";
import { DocumentRecord } from "../../types";
import { updateAnalysisStatus } from "../documentStatusUpdates";
import { AnalysisProcessContext } from "../types";

export const documentIngestion = async (
  storagePath: string,
  context: AnalysisProcessContext
): Promise<DocumentRecord> => {
  const { setAnalysisStep, setProgress } = context;
  
  setAnalysisStep("Stage 1: Document Ingestion & Preprocessing...");
  setProgress(10);
  
  console.log('Fetching document record for path:', storagePath);
  const { data: documentRecord, error: fetchError } = await supabase
    .from('documents')
    .select('id, title, metadata, ai_processing_status')
    .eq('storage_path', storagePath)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching document record:', fetchError);
    throw fetchError;
  }
  
  if (!documentRecord) {
    console.error('Document record not found for path:', storagePath);
    throw new Error('Document record not found in database');
  }
  
  console.log('Document record found:', documentRecord);
  
  // Update document status to processing
  await updateAnalysisStatus(documentRecord, 'document_ingestion', 'analysis_started');
  
  return documentRecord;
};
