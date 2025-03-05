
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
      throw new Error(`Failed to upload document: ${uploadError.message}`);
    }

    logger.info('File uploaded successfully to storage');
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Enhanced Form 76 detection
    const isForm76 = 
      file.name.toLowerCase().includes('form 76') || 
      file.name.toLowerCase().includes('f76') || 
      file.name.toLowerCase().includes('form76') ||
      file.name.toLowerCase().includes('form-76') ||
      file.name.toLowerCase().includes('monthly income');
    
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
        user_id: user.id,
        ai_processing_status: 'processing',
        metadata: {
          formType: isForm76 ? 'form-76' : 'unknown',
          uploadDate: new Date().toISOString(),
          client_name: isForm76 ? extractClientName(file.name) : 'Untitled Client',
          ocr_status: 'pending',
          processing_stage: 'document_ingestion',
          processing_steps_completed: ['upload', 'validation'],
          processing_steps_total: 8
        }
      })
      .select()
      .single();

    if (documentError) {
      logger.error('Database insert error:', documentError);
      throw new Error(`Failed to create document record: ${documentError.message}`);
    }

    logger.info(`Document record created with ID: ${documentData.id}`);
    
    // Create folders for document organization
    if (documentData) {
      try {
        // Extract client name and form number from metadata or file name
        let clientName = documentData.metadata?.client_name || 'Untitled Client';
        let formNumber = isForm76 ? 'Form-76' : 'General Document';
        
        logger.info(`Creating folder structure for client: ${clientName}, form type: ${formNumber}`);
        
        // First, create a client folder if it doesn't exist
        const { data: clientFolder } = await createFolderIfNotExists(
          clientName,
          user.id,
          null // no parent folder
        );
        
        if (clientFolder) {
          logger.info(`Client folder created/found with ID: ${clientFolder.id}`);
          
          // Create a form-type subfolder
          const { data: formTypeFolder } = await createFolderIfNotExists(
            formNumber,
            user.id,
            clientFolder.id // parent is client folder
          );
          
          if (formTypeFolder) {
            logger.info(`Form type folder created/found with ID: ${formTypeFolder.id}`);
            
            // Update document with parent folder
            const { error: updateError } = await supabase
              .from('documents')
              .update({ parent_folder_id: formTypeFolder.id })
              .eq('id', documentData.id);
              
            if (updateError) {
              logger.error('Error updating document with folder ID:', updateError);
            }
          }
        }
        
        // Also try the normal organization method as fallback
        await organizeDocumentIntoFolders(
          documentData.id,
          user.id,
          clientName,
          formNumber
        );
      } catch (folderError) {
        logger.error('Error organizing document into folders:', folderError);
        // Continue execution - folder organization is not critical
      }
    }
    
    // Trigger document analysis using the edge function
    logger.info('Triggering document analysis process');
    const { error: analysisError } = await supabase.functions.invoke('analyze-document', {
      body: { 
        documentId: documentData.id,
        includeRegulatory: true,
        includeClientExtraction: true,
        title: file.name,
        extractionMode: 'comprehensive',
        formType: isForm76 ? 'form-76' : 'unknown',
        version: '2.0', // Using newer version of the analysis
        enableOCR: true,
        priorityLevel: isForm76 ? 'high' : 'normal'
      }
    });

    if (analysisError) {
      logger.error('Error triggering analysis:', analysisError);
      // Update document status to show analysis failed
      await supabase
        .from('documents')
        .update({
          ai_processing_status: 'failed',
          metadata: {
            ...documentData.metadata,
            processing_error: analysisError.message,
            processing_stage: 'analysis_failed'
          }
        })
        .eq('id', documentData.id);
    } else {
      // Update document status to show analysis is in progress
      await supabase
        .from('documents')
        .update({
          ai_processing_status: 'processing',
          metadata: {
            ...documentData.metadata,
            processing_stage: 'document_analysis',
            processing_steps_completed: ['upload', 'validation', 'ocr_started']
          }
        })
        .eq('id', documentData.id);
    }

    return documentData;
  } catch (error) {
    logger.error('Error uploading document:', error);
    throw error;
  }
};

// Enhanced function to extract client name from Form 76 filename
function extractClientName(filename: string): string {
  // Try different patterns for Form 76 filename conventions
  const patterns = [
    /form[- ]?76[- ]?(.+?)(?:\.|$)/i,  // form76-clientname or form 76 clientname
    /f76[- ]?(.+?)(?:\.|$)/i,          // f76-clientname or f76 clientname
    /monthly[- ]?income[- ]?(.+?)(?:\.|$)/i  // monthly income clientname
  ];
  
  for (const pattern of patterns) {
    const match = filename.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no specific pattern matches, try to extract anything after the form indicator
  const generalMatch = filename.replace(/form-?76|f76|monthly-?income/i, '').trim();
  if (generalMatch) {
    // Remove file extension if present
    return generalMatch.replace(/\.[^/.]+$/, "");
  }
  
  return 'Untitled Client';
}
