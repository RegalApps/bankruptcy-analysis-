
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";

// Helper function to create a folder if it doesn't exist
export const createFolderIfNotExists = async (
  folderName: string, 
  folderType: string, 
  userId: string,
  parentFolderId?: string
): Promise<string> => {
  try {
    // Check if folder already exists
    const { data: existingFolders } = await supabase
      .from('documents')
      .select('id')
      .eq('title', folderName)
      .eq('is_folder', true)
      .eq('folder_type', folderType)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingFolders) {
      logger.info(`Folder "${folderName}" already exists, id: ${existingFolders.id}`);
      return existingFolders.id;
    }
    
    // Create new folder
    const { data: newFolder, error } = await supabase
      .from('documents')
      .insert({
        title: folderName,
        is_folder: true,
        folder_type: folderType,
        user_id: userId,
        parent_folder_id: parentFolderId,
        type: 'folder',
        size: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    logger.info(`Created new folder "${folderName}", id: ${newFolder.id}`);
    return newFolder.id;
  } catch (error) {
    logger.error(`Error creating folder "${folderName}":`, error);
    throw error;
  }
};

export const organizeDocumentIntoFolders = async (
  documentId: string,
  userId: string,
  clientName: string,
  formNumber: string
): Promise<void> => {
  try {
    if (clientName && formNumber) {
      // First create a client folder
      const clientFolderId = await createFolderIfNotExists(
        clientName, 
        'client', 
        userId
      );
      
      // Then create a form folder inside the client folder
      const formFolderName = `${formNumber} - Documents`;
      const formFolderId = await createFolderIfNotExists(
        formFolderName,
        'form',
        userId,
        clientFolderId
      );
      
      // Move the document into the form folder
      const { error: moveError } = await supabase
        .from('documents')
        .update({ parent_folder_id: formFolderId })
        .eq('id', documentId);
      
      if (moveError) {
        logger.error('Error moving document to folder:', moveError);
      } else {
        logger.info(`Document moved to folder structure: ${clientName} > ${formFolderName}`);
      }
    } else {
      logger.warn('Could not create folder structure: missing client name or form number');
    }
  } catch (error) {
    logger.error('Error organizing document into folders:', error);
    // Don't throw - we want to continue with the document update
  }
};
