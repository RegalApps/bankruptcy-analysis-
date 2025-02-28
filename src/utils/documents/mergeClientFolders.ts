
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";
import { toast } from "sonner";

export const mergeClientFolders = async (clientName: string, userId: string): Promise<boolean> => {
  try {
    if (!clientName) {
      toast.error("Client name is required");
      return false;
    }

    logger.info(`Attempting to merge folders for client: ${clientName}`);
    
    // Find all folders with the client name
    const { data: clientFolders, error: fetchError } = await supabase
      .from('documents')
      .select('id, title, folder_type')
      .eq('user_id', userId)
      .eq('is_folder', true)
      .ilike('title', clientName)
      .order('created_at', { ascending: true });
    
    if (fetchError) {
      logger.error(`Error fetching client folders for ${clientName}:`, fetchError);
      toast.error("Error fetching client folders");
      return false;
    }
    
    if (!clientFolders || clientFolders.length <= 1) {
      logger.info(`No duplicate folders found for client ${clientName}`);
      toast.info("No duplicate folders found");
      return true; // No duplicates to merge
    }
    
    // Use the first folder as the primary client folder
    const primaryFolder = clientFolders[0];
    const duplicateFolders = clientFolders.slice(1);
    
    logger.info(`Primary folder: ${primaryFolder.title} (${primaryFolder.id})`);
    logger.info(`Found ${duplicateFolders.length} duplicate folders to merge`);
    
    // For each duplicate folder
    for (const folder of duplicateFolders) {
      // 1. Find all direct children (documents and subfolders)
      const { data: children, error: childrenError } = await supabase
        .from('documents')
        .select('id, is_folder')
        .eq('parent_folder_id', folder.id);
      
      if (childrenError) {
        logger.error(`Error fetching children for folder ${folder.id}:`, childrenError);
        continue;
      }
      
      if (children && children.length > 0) {
        // 2. Move all children to the primary folder
        const { error: moveError } = await supabase
          .from('documents')
          .update({ parent_folder_id: primaryFolder.id })
          .eq('parent_folder_id', folder.id);
        
        if (moveError) {
          logger.error(`Error moving children from folder ${folder.id} to ${primaryFolder.id}:`, moveError);
          continue;
        }
        
        logger.info(`Moved ${children.length} items from folder ${folder.id} to ${primaryFolder.id}`);
      }
      
      // 3. Delete the now-empty duplicate folder
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', folder.id);
      
      if (deleteError) {
        logger.error(`Error deleting duplicate folder ${folder.id}:`, deleteError);
      } else {
        logger.info(`Deleted duplicate folder ${folder.id}`);
      }
    }
    
    toast.success(`Successfully merged folders for ${clientName}`);
    return true;
  } catch (error) {
    logger.error('Error merging client folders:', error);
    toast.error("Failed to merge client folders");
    return false;
  }
};
