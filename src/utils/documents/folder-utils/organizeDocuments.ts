import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";
import { Document } from "@/components/DocumentList/types";
import { createFolderIfNotExists } from "./createFolder";
import { mergeFinancialFolders } from "./mergeFinancialFolders";
import { 
  extractClientName, 
  standardizeClientName, 
  isDuplicateDocument, 
  determineDocumentFolderPath,
  getOrCreateClientRecord
} from "@/utils/documents/clientUtils";

// Process Excel file in background
const processExcelFileInBackground = async (
  documentId: string,
  userId: string,
  clientName: string
) => {
  try {
    // Create specialized folder for Excel files
    const clientFolderId = await createFolderIfNotExists(
      standardizeClientName(clientName), 
      'client', 
      userId
    );
    
    // Create an "Financial Records" folder
    const folderType = 'Financial Records';
    const financialFolderId = await createFolderIfNotExists(
      folderType,
      'financial',
      userId,
      clientFolderId
    );
    
    // Move the document 
    await supabase
      .from('documents')
      .update({ 
        parent_folder_id: financialFolderId,
        metadata: { 
          client_name: standardizeClientName(clientName),
          folder_type: folderType,
          processing_complete: true
        }
      })
      .eq('id', documentId);
      
    logger.info(`Excel file ${documentId} processed and moved to folder ${financialFolderId} for client: ${clientName}`);
    
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
  clientName?: string,
  formNumber?: string
): Promise<{success: boolean, clientId?: string}> => {
  try {
    // First, retrieve the document to get complete information
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('title, type, storage_path, metadata, is_folder, size, created_at, updated_at')
      .eq('id', documentId)
      .single();
    
    if (fetchError) {
      logger.error('Error fetching document for folder organization:', fetchError);
      throw fetchError;
    }
    
    if (document.is_folder) {
      logger.info('Document is a folder, skipping organization');
      return { success: true };
    }

    // Create a proper Document object with all required fields
    const documentObj: Document = {
      id: documentId,
      title: document.title,
      type: document.type,
      storage_path: document.storage_path,
      metadata: document.metadata,
      is_folder: document.is_folder,
      size: document.size || 0,
      created_at: document.created_at,
      updated_at: document.updated_at
    };

    // Check if it's a duplicate before organizing
    const { isDuplicate, duplicateId } = await isDuplicateDocument(documentObj);
    
    if (isDuplicate && duplicateId) {
      logger.warn(`Document ${documentId} appears to be a duplicate of ${duplicateId}, but will continue with organization`);
      // We still continue with organization but note the potential duplicate
    }
    
    // Determine folder path based on document content and metadata
    const extractedClientName = clientName || extractClientName(documentObj);
    let folderInfo;
    
    if (extractedClientName) {
      folderInfo = determineDocumentFolderPath(documentObj);
    } else {
      folderInfo = {
        clientName: 'Untitled Client',
        folderType: 'General Documents'
      };
    }
    
    // Use provided formNumber if available
    if (formNumber) {
      folderInfo.formNumber = formNumber;
    }
    
    // Get or create client record in database for consistent naming
    const { clientId, clientName: standardizedName } = await getOrCreateClientRecord(
      folderInfo.clientName,
      userId
    );
    
    // For Excel files, process in background to avoid blocking 
    const isExcelFile = 
      document?.type?.includes('excel') || 
      document?.storage_path?.endsWith('.xlsx') || 
      document?.storage_path?.endsWith('.xls');
    
    if (isExcelFile) {
      // Just update metadata immediately so UI can proceed
      await supabase
        .from('documents')
        .update({ 
          metadata: { 
            ...document?.metadata,
            client_name: standardizedName,
            client_id: clientId,
            processing_started: true
          }
        })
        .eq('id', documentId);
      
      // Process the rest in background
      setTimeout(() => {
        processExcelFileInBackground(documentId, userId, standardizedName);
      }, 100);
      
      return { success: true, clientId };
    }
    
    // For non-Excel files, continue with normal processing
    // First create a client folder
    const clientFolderId = await createFolderIfNotExists(
      standardizedName, 
      'client', 
      userId
    );
    
    logger.info(`Client folder created/found with ID: ${clientFolderId}`);
    
    let targetFolderId;
    
    // Create appropriate subfolder
    const subfolderType = folderInfo.folderType;
    
    // Determine folder type for database 
    let databaseFolderType = 'form';
    if (subfolderType.includes('Financial') || 
        subfolderType.includes('Income') || 
        subfolderType.includes('Bank') ||
        subfolderType === 'Form 76 - Monthly Income Statement') {
      databaseFolderType = 'financial';
    }
    
    // Create the subfolder
    targetFolderId = await createFolderIfNotExists(
      subfolderType,
      databaseFolderType,
      userId,
      clientFolderId
    );
    
    logger.info(`Document will be organized into ${subfolderType} folder`);
    
    // Move the document into the appropriate folder
    const { error: moveError } = await supabase
      .from('documents')
      .update({ 
        parent_folder_id: targetFolderId,
        metadata: { 
          ...document?.metadata, 
          client_name: standardizedName,
          client_id: clientId,
          form_number: folderInfo.formNumber,
          folder_type: subfolderType,
          organized_at: new Date().toISOString(),
          processing_complete: true
        }
      })
      .eq('id', documentId);
    
    if (moveError) {
      logger.error('Error moving document to folder:', moveError);
      throw moveError;
    } else {
      logger.info(`Document ${documentId} successfully moved to folder ${targetFolderId} for client: ${standardizedName}`);
    }
    
    // Run the merge process to clean up any duplicate folders
    await mergeFinancialFolders(userId);
    
    return { success: true, clientId };
  } catch (error) {
    logger.error('Error organizing document into folders:', error);
    // Don't throw - we want to continue with the document update even if folder organization fails
    return { success: false };
  }
};
