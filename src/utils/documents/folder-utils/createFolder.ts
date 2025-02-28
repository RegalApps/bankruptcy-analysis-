
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
    // Check if folder already exists with the same name and parent folder
    const { data: existingFolders } = await supabase
      .from('documents')
      .select('id')
      .eq('title', folderName)
      .eq('is_folder', true)
      .eq('folder_type', folderType)
      .eq('user_id', userId)
      .eq('parent_folder_id', parentFolderId || null)
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
