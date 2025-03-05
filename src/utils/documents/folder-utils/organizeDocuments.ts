
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
    if (!clientName) {
      logger.warn('No client name provided, using "Untitled Client"');
      clientName = 'Untitled Client';
    }

    logger.info(`Starting folder organization for client: ${clientName}, document: ${documentId}`);
    
    // First create a client folder
    const clientFolderId = await createFolderIfNotExists(
      clientName, 
      'client', 
      userId
    );
    
    logger.info(`Client folder created/found with ID: ${clientFolderId}`);
    
    // Check if the document is an Excel file (for income and expense sheets)
    // or if it's Form 76 (for financial assessments)
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('title, type, storage_path, metadata')
      .eq('id', documentId)
      .single();
    
    if (fetchError) {
      logger.error('Error fetching document for folder organization:', fetchError);
      throw fetchError;
    }
    
    const isExcelFile = 
      document?.type?.includes('excel') || 
      document?.storage_path?.endsWith('.xlsx') || 
      document?.storage_path?.endsWith('.xls');
    
    const isForm76 = 
      formNumber === 'Form-76' || 
      document?.metadata?.formType === 'form-76' ||
      document?.title?.toLowerCase().includes('form 76');
    
    let targetFolderId;
    let folderType;
    
    if (isExcelFile) {
      // For Excel files, create an "Income and Expense Sheet" folder under the client folder
      folderType = 'Income and Expense Sheet';
      const incomeExpenseFolderId = await createFolderIfNotExists(
        folderType,
        'financial',
        userId,
        clientFolderId
      );
      
      targetFolderId = incomeExpenseFolderId;
      logger.info(`Excel file detected, organizing into Income and Expense Sheet folder for client ${clientName}`);
    } else if (isForm76) {
      // For Form 76, create a dedicated Form 76 folder under the client folder
      folderType = 'Form 76 - Monthly Income Statement';
      const form76FolderId = await createFolderIfNotExists(
        folderType,
        'financial',
        userId,
        clientFolderId
      );
      
      targetFolderId = form76FolderId;
      logger.info(`Form 76 detected, organizing into Form 76 folder for client ${clientName}`);
    } else {
      // For other documents, create a form folder as usual
      folderType = `${formNumber} - Documents`;
      const formFolderId = await createFolderIfNotExists(
        folderType,
        'form',
        userId,
        clientFolderId
      );
      
      targetFolderId = formFolderId;
      logger.info(`General document, organizing into ${folderType} folder`);
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
          is_form_76: isForm76,
          folder_type: folderType
        }
      })
      .eq('id', documentId);
    
    if (moveError) {
      logger.error('Error moving document to folder:', moveError);
      throw moveError;
    } else {
      logger.info(`Document ${documentId} successfully moved to folder ${targetFolderId} for client: ${clientName}`);
    }
    
    // Run the merge process to clean up any duplicate folders
    await mergeFinancialFolders(userId);
    
    return;
  } catch (error) {
    logger.error('Error organizing document into folders:', error);
    // Don't throw - we want to continue with the document update even if folder organization fails
  }
};
