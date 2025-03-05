
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";
import { createFolderIfNotExists } from "./createFolder";
import { mergeFinancialFolders } from "./mergeFinancialFolders";

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
      // or if it's Form 76 (for financial assessments)
      const { data: document } = await supabase
        .from('documents')
        .select('title, type, storage_path, metadata')
        .eq('id', documentId)
        .single();
      
      const isExcelFile = 
        document?.type?.includes('excel') || 
        document?.storage_path?.endsWith('.xlsx') || 
        document?.storage_path?.endsWith('.xls');
      
      const isForm76 = 
        formNumber === 'Form-76' || 
        document?.metadata?.formType === 'form-76' ||
        document?.title?.toLowerCase().includes('form 76');
      
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
      } else if (isForm76) {
        // For Form 76, create a dedicated Form 76 folder under the client folder
        const form76FolderId = await createFolderIfNotExists(
          "Form 76 - Monthly Income Statement",
          'financial',
          userId,
          clientFolderId
        );
        
        targetFolderId = form76FolderId;
        logger.info(`Form 76 detected, organizing into Form 76 folder for client ${clientName}`);
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
          metadata: { 
            ...document?.metadata, 
            client_name: clientName,
            form_number: formNumber,
            is_form_76: isForm76
          }
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
