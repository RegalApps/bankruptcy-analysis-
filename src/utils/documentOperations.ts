
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

    // Try to detect if this is Form 76 from the filename
    const isForm76 = file.name.toLowerCase().includes('form 76') || 
                    file.name.toLowerCase().includes('f76') || 
                    file.name.toLowerCase().includes('form76');
    
    // Create a record in the documents table
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        type: file.type,
        size: file.size,
        url: urlData.publicUrl,
        storage_path: filePath,
        is_folder: false,
        metadata: {
          formType: isForm76 ? 'form-76' : null,
          uploadDate: new Date().toISOString()
        }
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
      
      // Extract client name and form number from metadata or file name
      let clientName = 'Untitled Client';
      let formNumber = isForm76 ? 'Form-76' : 'General Document';
      
      // If it's a Form 76, try to extract client name from the filename
      if (isForm76) {
        const nameMatch = file.name.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
        if (nameMatch && nameMatch[1]) {
          clientName = nameMatch[1].trim();
        }
      }
      
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
