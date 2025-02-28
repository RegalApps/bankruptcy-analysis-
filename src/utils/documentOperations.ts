
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
      await organizeDocumentIntoFolders(documentData);
    }

    return documentData;
  } catch (error) {
    logger.error('Error uploading document:', error);
    throw error;
  }
};
