
import { createFolderIfNotExists, organizeDocumentIntoFolders } from './documents/folder-utils';
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';

/**
 * Uploads a document to the storage and creates a record in the database
 */
export const uploadDocument = async (file: File) => {
  try {
    // First upload the file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Create a record in the documents table
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        type: file.type,
        size: file.size,
        url: urlData.publicUrl,
        is_folder: false
      })
      .select()
      .single();

    if (documentError) {
      throw documentError;
    }

    // Organize document into appropriate folders
    if (documentData) {
      // Getting the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      // Extract client name and form number from metadata or file name if available
      // For now using placeholder values that would be extracted in a real scenario
      const clientName = documentData.title.split('-')[0]?.trim() || 'Untitled Client';
      const formNumber = documentData.type?.includes('excel') ? 'Income Statement' : 'Form-100';
      
      await organizeDocumentIntoFolders(
        documentData.id,
        userId || '',
        clientName,
        formNumber
      );
    }

    return documentData;
  } catch (error) {
    logger.error('Error uploading document:', error);
    throw error;
  }
};
