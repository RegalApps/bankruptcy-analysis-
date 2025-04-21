
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";
import { standardizeClientName } from "@/utils/documents/clientUtils";

// Helper function to create a folder if it doesn't exist
export const createFolderIfNotExists = async (
  folderName: string, 
  folderType: string, 
  userId: string,
  parentFolderId?: string
): Promise<string> => {
  try {
    // Standardize folder name for consistency
    const standardizedName = folderType === 'client' 
      ? standardizeClientName(folderName) 
      : folderName;
    
    // Check if folder already exists with the same name and parent folder
    const { data: existingFolders } = await supabase
      .from('documents')
      .select('id')
      .eq('title', standardizedName)
      .eq('is_folder', true)
      .eq('folder_type', folderType)
      .eq('user_id', userId)
      .eq('parent_folder_id', parentFolderId || null)
      .maybeSingle();
    
    if (existingFolders) {
      logger.info(`Folder "${standardizedName}" already exists, id: ${existingFolders.id}`);
      return existingFolders.id;
    }
    
    // Create new folder
    const { data: newFolder, error } = await supabase
      .from('documents')
      .insert({
        title: standardizedName,
        is_folder: true,
        folder_type: folderType,
        user_id: userId,
        parent_folder_id: parentFolderId,
        type: 'folder',
        size: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          created_by: userId,
          level: parentFolderId ? 1 : 0,
          folder_path: parentFolderId ? `${parentFolderId}/${standardizedName}` : standardizedName
        }
      })
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    logger.info(`Created new folder "${standardizedName}", id: ${newFolder.id}`);
    return newFolder.id;
  } catch (error) {
    logger.error(`Error creating folder "${folderName}":`, error);
    throw error;
  }
};
