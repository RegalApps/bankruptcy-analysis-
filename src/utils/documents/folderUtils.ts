
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

// Function to merge any duplicate folders
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

export const organizeDocumentIntoFolders = async (
  documentId: string,
  userId: string,
  clientName: string,
  formNumber: string
): Promise<void> => {
  try {
    if (clientName) {
      // First create a client folder
      const clientFolderId = await createFolderIfNotExists(
        clientName, 
        'client', 
        userId
      );
      
      // Check if the document is an Excel file (for income and expense sheets)
      const { data: document } = await supabase
        .from('documents')
        .select('title, type, storage_path, metadata')
        .eq('id', documentId)
        .single();
      
      const isExcelFile = 
        document?.type?.includes('excel') || 
        document?.storage_path?.endsWith('.xlsx') || 
        document?.storage_path?.endsWith('.xls');
      
      let targetFolderId;
      
      if (isExcelFile) {
        // For Excel files, create an "Income and Expense Sheet" folder under the client folder
        const incomeExpenseFolderId = await createFolderIfNotExists(
          "Income and Expense Sheet",
          'financial',
          userId,
          clientFolderId
        );
        
        targetFolderId = incomeExpenseFolderId;
        logger.info(`Excel file detected, organizing into Income and Expense Sheet folder for client ${clientName}`);
      } else {
        // For other documents, create a form folder as usual
        const formFolderName = `${formNumber} - Documents`;
        const formFolderId = await createFolderIfNotExists(
          formFolderName,
          'form',
          userId,
          clientFolderId
        );
        
        targetFolderId = formFolderId;
      }
      
      // Move the document into the appropriate folder
      const { error: moveError } = await supabase
        .from('documents')
        .update({ 
          parent_folder_id: targetFolderId,
          metadata: { ...document?.metadata, client_name: clientName }  // Add client name to metadata
        })
        .eq('id', documentId);
      
      if (moveError) {
        logger.error('Error moving document to folder:', moveError);
      } else {
        logger.info(`Document moved to folder for client: ${clientName}`);
      }
      
      // Run the merge process to clean up any duplicate folders
      await mergeFinancialFolders(userId);
    } else {
      logger.warn('Could not create folder structure: missing client name or form number');
    }
  } catch (error) {
    logger.error('Error organizing document into folders:', error);
    // Don't throw - we want to continue with the document update
  }
};
