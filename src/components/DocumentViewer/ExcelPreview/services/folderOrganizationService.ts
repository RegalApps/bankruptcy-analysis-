
import { supabase } from '@/lib/supabase';

/**
 * Organizes document into folders in the background
 */
export const organizeFolder = async (documentId: string, userId: string, clientName: string): Promise<void> => {
  try {
    // Get document metadata
    const { data: doc } = await supabase
      .from('documents')
      .select('metadata')
      .eq('id', documentId)
      .single();
      
    // Skip if already organized
    if (doc?.metadata?.processing_complete) return;
    
    // Do folder organization
    await supabase.functions.invoke('organize-document', {
      body: { 
        documentId,
        userId,
        clientName,
        documentType: "Excel"
      }
    });
  } catch (error) {
    console.error('Error in background folder organization:', error);
  }
};
