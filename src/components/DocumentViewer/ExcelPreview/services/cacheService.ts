
import { supabase } from '@/lib/supabase';
import { ExcelData } from '../types';

/**
 * Attempts to load cached Excel data for a document
 */
export const loadCachedExcelData = async (
  documentId: string | undefined
): Promise<{
  cachedData: ExcelData | null;
  clientName: string | null;
}> => {
  if (!documentId) {
    return { cachedData: null, clientName: null };
  }
  
  try {
    const { data: cachedDocData, error: cacheError } = await supabase
      .from('document_metadata')
      .select('extracted_metadata')
      .eq('document_id', documentId)
      .maybeSingle();
      
    // If we have valid cached data, use it
    if (!cacheError && cachedDocData?.extracted_metadata?.excel_data) {
      console.log('Using cached Excel data');
      
      return { 
        cachedData: cachedDocData.extracted_metadata.excel_data,
        clientName: cachedDocData.extracted_metadata.client_name || null
      };
    }
    
    return { cachedData: null, clientName: null };
  } catch (error) {
    console.error('Error loading cached data:', error);
    return { cachedData: null, clientName: null };
  }
};

/**
 * Marks a document as being processed
 */
export const markDocumentProcessingStarted = async (documentId: string | undefined): Promise<void> => {
  if (!documentId) return;
  
  try {
    await supabase
      .from('documents')
      .update({ 
        metadata: { 
          excel_processing_started: true,
          last_processing_attempt: new Date().toISOString()
        }
      })
      .eq('id', documentId);
  } catch (error) {
    console.error('Error marking document as processing:', error);
  }
};
