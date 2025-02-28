
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";

// Function to merge any duplicate financial folders
export const mergeFinancialFolders = async (userId: string) => {
  try {
    // Find all financial and "Income and Expense Sheet" folders for the user
    const { data: financialFolders, error: fetchError } = await supabase
      .from('documents')
      .select('id, title, parent_folder_id')
      .eq('user_id', userId)
      .eq('is_folder', true)
      .or('folder_type.eq.financial,title.eq.Income and Expense Sheet');
    
    if (fetchError) throw fetchError;
    
    if (!financialFolders || financialFolders.length <= 1) {
      // No duplicates to merge
      return;
    }
    
    // Group folders by parent_folder_id
    const foldersByParent = financialFolders.reduce((acc, folder) => {
      const parentId = folder.parent_folder_id || 'root';
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(folder);
      return acc;
    }, {} as Record<string, typeof financialFolders>);
    
    // For each parent that has multiple financial folders, merge them
    for (const [parentId, folders] of Object.entries(foldersByParent)) {
      if (folders.length <= 1) continue;
      
      // Choose the first folder as the target (preferring "Income and Expense Sheet" if available)
      const targetFolder = folders.find(f => f.title === "Income and Expense Sheet") || folders[0];
      const otherFolders = folders.filter(f => f.id !== targetFolder.id);
      
      // Move all documents from other folders to the target folder
      for (const folder of otherFolders) {
        // Move files
        const { error: moveError } = await supabase
          .from('documents')
          .update({ parent_folder_id: targetFolder.id })
          .eq('parent_folder_id', folder.id);
        
        if (moveError) {
          logger.error(`Error moving files from folder ${folder.id} to ${targetFolder.id}:`, moveError);
          continue;
        }
        
        // Delete the now-empty folder
        const { error: deleteError } = await supabase
          .from('documents')
          .delete()
          .eq('id', folder.id);
        
        if (deleteError) {
          logger.error(`Error deleting empty folder ${folder.id}:`, deleteError);
        }
      }
    }
    
    logger.info('Financial folders merged successfully');
  } catch (error) {
    logger.error('Error merging financial folders:', error);
  }
};
