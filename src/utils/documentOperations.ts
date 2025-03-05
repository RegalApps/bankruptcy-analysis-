
import { createFolderIfNotExists, organizeDocumentIntoFolders } from './documents/folder-utils';
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';

/**
 * Uploads a document to the storage and creates a record in the database
 */
export const uploadDocument = async (file: File) => {
  try {
    logger.info(`Starting document upload process for: ${file.name}`);
    
    // First upload the file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    logger.info(`Uploading file to storage path: ${filePath}`);
    
    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      logger.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    logger.info('File uploaded successfully to storage');
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Try to detect if this is Form 76 from the filename
    const isForm76 = file.name.toLowerCase().includes('form 76') || 
                    file.name.toLowerCase().includes('f76') || 
                    file.name.toLowerCase().includes('form76');
    
    logger.info(`Document identified as Form 76: ${isForm76}`);
    
    // Get user ID for the document ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logger.error('User not authenticated');
      throw new Error('User not authenticated. Please sign in again.');
    }

    // Create a record in the documents table with user_id
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        type: file.type,
        size: file.size,
        url: urlData.publicUrl,
        storage_path: filePath,
        is_folder: false,
        user_id: user.id, // Add user_id field to fix RLS policy
        ai_processing_status: 'pending',
        metadata: {
          formType: isForm76 ? 'form-76' : null,
          uploadDate: new Date().toISOString(),
          client_name: isForm76 ? extractClientName(file.name) : 'Untitled Client',
          ocr_status: 'pending'
        }
      })
      .select()
      .single();

    if (documentError) {
      logger.error('Database insert error:', documentError);
      throw documentError;
    }

    logger.info(`Document record created with ID: ${documentData.id}`);
    
    // Trigger document analysis using the edge function
    logger.info('Triggering document analysis process');
    const { error: analysisError } = await supabase.functions.invoke('analyze-document', {
      body: { 
        documentId: documentData.id,
        includeRegulatory: true,
        includeClientExtraction: true,
        title: file.name,
        extractionMode: 'comprehensive',
        formType: isForm76 ? 'form-76' : 'unknown'
      }
    });

    if (analysisError) {
      logger.error('Error triggering analysis:', analysisError);
      // Continue anyway, the analysis might be running in the background
    }
    
    // Organize document into appropriate folders
    if (documentData) {
      // Extract client name and form number from metadata or file name
      let clientName = documentData.metadata?.client_name || 'Untitled Client';
      let formNumber = isForm76 ? 'Form-76' : 'General Document';
      
      logger.info(`Organizing document for client: ${clientName}, form type: ${formNumber}`);
      
      await organizeDocumentIntoFolders(
        documentData.id,
        user.id,
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

// Function to extract client name from Form 76 filename
function extractClientName(filename: string): string {
  const nameMatch = filename.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
  if (nameMatch && nameMatch[1]) {
    return nameMatch[1].trim();
  }
  return 'Untitled Client';
}
