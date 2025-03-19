
import { supabase } from "@/lib/supabase";
import { DocumentRecord } from "../../types";
import { updateAnalysisStatus } from "../documentStatusUpdates";
import { AnalysisProcessContext } from "../types";
import { isUUID } from "@/utils/validation";

export const documentIngestion = async (
  storagePath: string,
  context: AnalysisProcessContext
): Promise<DocumentRecord> => {
  const { setAnalysisStep, setProgress, setError } = context;
  
  setAnalysisStep("Stage 1: Document Ingestion & Preprocessing...");
  setProgress(10);
  
  console.log('Fetching document record for path:', storagePath);
  const { data: documentRecord, error: fetchError } = await supabase
    .from('documents')
    .select('id, title, metadata, ai_processing_status, storage_path')
    .eq('storage_path', storagePath)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching document record:', fetchError);
    throw fetchError;
  }
  
  if (!documentRecord) {
    console.error('Document record not found for path:', storagePath);
    
    // Try to find by partial matching on the path
    const pathParts = storagePath.split('/');
    const filename = pathParts[pathParts.length - 1];
    
    // Try to find by title match if no exact storage_path match
    const { data: documentByTitle, error: titleError } = await supabase
      .from('documents')
      .select('id, title, metadata, ai_processing_status, storage_path')
      .filter('title', 'eq', filename)
      .maybeSingle();
      
    if (titleError) {
      console.error('Error fetching document by title:', titleError);
    }
    
    if (documentByTitle) {
      console.log('Found document by title match:', documentByTitle);
      
      // Update storage_path if it's missing
      if (!documentByTitle.storage_path) {
        const { error: updateError } = await supabase
          .from('documents')
          .update({ storage_path: storagePath })
          .eq('id', documentByTitle.id);
          
        if (updateError) {
          console.error('Error updating storage path:', updateError);
        } else {
          console.log('Updated storage_path for document:', documentByTitle.id);
          documentByTitle.storage_path = storagePath;
        }
      }
      
      await updateAnalysisStatus(documentByTitle, 'document_ingestion', 'analysis_started');
      return documentByTitle;
    }
    
    throw new Error('Document record not found in database');
  }
  
  console.log('Document record found:', documentRecord);
  
  // Ensure storage_path is set
  if (!documentRecord.storage_path) {
    console.log('Document missing storage_path, updating...');
    const { error: updateError } = await supabase
      .from('documents')
      .update({ storage_path: storagePath })
      .eq('id', documentRecord.id);
      
    if (updateError) {
      console.error('Error updating storage path:', updateError);
    } else {
      documentRecord.storage_path = storagePath;
    }
  }
  
  // Update document status to processing
  await updateAnalysisStatus(documentRecord, 'document_ingestion', 'analysis_started');
  
  return documentRecord;
};
