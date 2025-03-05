
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";

// Import directly from the createFolder file
import { createFolderIfNotExists } from "@/utils/documents/folder-utils/createFolder";

export const mergeClientFolders = async (clientName: string, userId: string): Promise<boolean> => {
  try {
    if (!clientName.trim()) {
      throw new Error("Client name cannot be empty");
    }

    // Search for client folders containing the client name
    const { data: clientFolders, error: fetchError } = await supabase
      .from('documents')
      .select('id, title, folder_type')
      .eq('is_folder', true)
      .eq('user_id', userId)
      .ilike('title', `%${clientName}%`);
    
    if (fetchError) throw fetchError;
    
    if (!clientFolders || clientFolders.length <= 1) {
      // No folders to merge or only one folder found
      logger.info(`No folders to merge for client: ${clientName}`);
      return false;
    }
    
    logger.info(`Found ${clientFolders.length} folders matching client: ${clientName}`);
    
    // Create a standard client folder
    const standardizedName = clientName.trim();
    const targetFolderId = await createFolderIfNotExists(
      standardizedName,
      'client',
      userId
    );
    
    // Move all documents from each folder to the target folder
    for (const folder of clientFolders) {
      if (folder.id === targetFolderId) continue; // Skip the target folder itself
      
      // Get all subfolders in this client folder
      const { data: subfolders } = await supabase
        .from('documents')
        .select('id, title, folder_type')
        .eq('is_folder', true)
        .eq('parent_folder_id', folder.id);
      
      // For each subfolder, create or find the corresponding subfolder in the target
      if (subfolders && subfolders.length > 0) {
        for (const subfolder of subfolders) {
          // Create or find equivalent subfolder in target
          const newSubfolderId = await createFolderIfNotExists(
            subfolder.title,
            subfolder.folder_type || 'form',
            userId,
            targetFolderId
          );
          
          // Move documents from old subfolder to new subfolder
          const { error: moveSubfolderDocsError } = await supabase
            .from('documents')
            .update({ parent_folder_id: newSubfolderId })
            .eq('parent_folder_id', subfolder.id)
            .eq('is_folder', false);
          
          if (moveSubfolderDocsError) {
            logger.error(`Error moving documents from subfolder ${subfolder.id} to ${newSubfolderId}:`, moveSubfolderDocsError);
          }
          
          // Delete the now-empty subfolder
          const { error: deleteSubfolderError } = await supabase
            .from('documents')
            .delete()
            .eq('id', subfolder.id);
          
          if (deleteSubfolderError) {
            logger.error(`Error deleting empty subfolder ${subfolder.id}:`, deleteSubfolderError);
          }
        }
      }
      
      // Move top-level documents directly to the target folder
      const { error: moveDocsError } = await supabase
        .from('documents')
        .update({ parent_folder_id: targetFolderId })
        .eq('parent_folder_id', folder.id)
        .eq('is_folder', false);
      
      if (moveDocsError) {
        logger.error(`Error moving documents from folder ${folder.id} to ${targetFolderId}:`, moveDocsError);
        continue;
      }
      
      // Delete the now-empty source folder
      const { error: deleteFolderError } = await supabase
        .from('documents')
        .delete()
        .eq('id', folder.id);
      
      if (deleteFolderError) {
        logger.error(`Error deleting empty folder ${folder.id}:`, deleteFolderError);
      }
    }
    
    logger.info(`Successfully merged folders for client: ${clientName}`);
    return true;
  } catch (error) {
    logger.error('Error merging client folders:', error);
    throw error;
  }
};
