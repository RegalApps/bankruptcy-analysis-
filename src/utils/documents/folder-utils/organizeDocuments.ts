
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";
import { createFolderIfNotExists } from "./createFolder";
import { mergeFinancialFolders } from "./mergeFinancialFolders";

// Use background task for Excel processing
const processExcelFileInBackground = async (
  documentId: string,
  userId: string,
  clientName: string
) => {
  try {
    // Create specialized folder for Excel files
    const clientFolderId = await createFolderIfNotExists(
      clientName, 
      'client', 
      userId
    );
    
    // Create an "Income and Expense Sheet" folder
    const folderType = 'Income and Expense Sheet';
    const incomeExpenseFolderId = await createFolderIfNotExists(
      folderType,
      'financial',
      userId,
      clientFolderId
    );
    
    // Move the document 
    await supabase
      .from('documents')
      .update({ 
        parent_folder_id: incomeExpenseFolderId,
        metadata: { 
          client_name: clientName,
          folder_type: folderType,
          processing_complete: true
        }
      })
      .eq('id', documentId);
      
    logger.info(`Excel file ${documentId} processed and moved to folder ${incomeExpenseFolderId} for client: ${clientName}`);
    
    // Run the merge process with low priority
    setTimeout(async () => {
      await mergeFinancialFolders(userId);
    }, 5000);
    
  } catch (error) {
    logger.error('Error in background Excel processing:', error);
  }
};

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
    
    // Check if the document is an Excel file
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
    
    // For Excel files, process in background to avoid blocking 
    if (isExcelFile) {
      // Just update metadata immediately so UI can proceed
      await supabase
        .from('documents')
        .update({ 
          metadata: { 
            ...document?.metadata,
            client_name: clientName,
            processing_started: true
          }
        })
        .eq('id', documentId);
      
      // Process the rest in background
      setTimeout(() => {
        processExcelFileInBackground(documentId, userId, clientName);
      }, 100);
      
      return;
    }
    
    // For non-Excel files, continue with normal processing
    // First create a client folder
    const clientFolderId = await createFolderIfNotExists(
      clientName, 
      'client', 
      userId
    );
    
    logger.info(`Client folder created/found with ID: ${clientFolderId}`);
    
    let targetFolderId;
    let folderType;
    
    if (isForm76) {
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
