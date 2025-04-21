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

// Core document organization function: always uses robust new extraction and deduplication.
export const organizeDocumentIntoFolders = async (
  documentId: string,
  userId: string,
  clientName?: string,
  formNumber?: string
): Promise<{ success: boolean; clientId?: string }> => {
  try {
    // Retrieve the full document from Supabase
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('id, title, type, storage_path, metadata, is_folder, size, created_at, updated_at')
      .eq('id', documentId)
      .single();

    if (fetchError || !document) {
      logger.error('Error fetching document for folder organization:', fetchError);
      throw fetchError;
    }
    if (document.is_folder) {
      logger.info('Document is a folder, skipping organization');
      return { success: true };
    }

    // Assemble a real Document object (ensure all fields exist, fill in missing with sane defaults)
    const documentObj: Document = {
      id: document.id,
      title: document.title || "",
      type: document.type || "",
      storage_path: document.storage_path || "",
      metadata: document.metadata,
      is_folder: !!document.is_folder,
      size: Number(document.size) || 0,
      created_at: document.created_at || new Date().toISOString(),
      updated_at: document.updated_at || new Date().toISOString(),
      // Some files might have analysis; safe to ignore if not present
    };

    // Deduplication: skip or log if duplicate
    const { isDuplicate, duplicateId } = await isDuplicateDocument(documentObj);
    if (isDuplicate && duplicateId) {
      logger.warn(`Document ${documentId} appears to be a duplicate of ${duplicateId}, but will continue with organization`);
      // We still continue to enforce folder correctness even for dupes
    }

    // Extract (or override by input) the client name robustly
    const extractedClientName = clientName || extractClientName(documentObj) || "Untitled Client";
    let folderInfo = determineDocumentFolderPath(documentObj);

    // Allow forced formNumber input (e.g., for workflow integration/calling code)
    if (formNumber) folderInfo.formNumber = formNumber;
    // Always standardize client name!
    folderInfo.clientName = standardizeClientName(folderInfo.clientName || extractedClientName);

    // Find or create the client record for consistency
    const { clientId, clientName: standardizedName } = await getOrCreateClientRecord(folderInfo.clientName, userId);

    // Excel handling: background for Excel, quick meta-update, then async
    const isExcelFile =
      documentObj.type?.includes("excel") ||
      documentObj.storage_path.endsWith(".xlsx") ||
      documentObj.storage_path.endsWith(".xls");

    if (isExcelFile) {
      await supabase
        .from("documents")
        .update({
          metadata: {
            ...(documentObj.metadata || {}),
            client_name: standardizedName,
            client_id: clientId,
            processing_started: true
          }
        })
        .eq("id", documentId);
      setTimeout(() => {
        processExcelFileInBackground(documentId, userId, standardizedName);
      }, 100);
      return { success: true, clientId };
    }

    // For all other docs, proceed to full folder creation
    // Step 1: client folder
    const clientFolderId = await createFolderIfNotExists(
      standardizedName, "client", userId
    );
    logger.info(`Client folder created/found with ID: ${clientFolderId}`);

    // Step 2: best-fit subfolder (financial, form, etc)
    let targetFolderId: string;
    const subfolderType = folderInfo.folderType;
    let databaseFolderType = "form";
    if (
      subfolderType.toLowerCase().includes("financial") ||
      subfolderType.toLowerCase().includes("income") ||
      subfolderType.toLowerCase().includes("bank")
    ) {
      databaseFolderType = "financial";
    }
    targetFolderId = await createFolderIfNotExists(
      subfolderType, databaseFolderType, userId, clientFolderId
    );
    logger.info(`Document will be organized into ${subfolderType} subfolder`);

    // Move the document into the right folder and update the meta
    const { error: moveError } = await supabase
      .from("documents")
      .update({
        parent_folder_id: targetFolderId,
        metadata: {
          ...(documentObj.metadata || {}),
          client_name: standardizedName,
          client_id: clientId,
          form_number: folderInfo.formNumber,
          folder_type: subfolderType,
          organized_at: new Date().toISOString(),
          processing_complete: true
        }
      })
      .eq("id", documentId);
    if (moveError) {
      logger.error("Error moving document to folder:", moveError);
      throw moveError;
    } else {
      logger.info(`Document ${documentId} successfully moved to folder ${targetFolderId} for client: ${standardizedName}`);
    }

    // Merge dup folders of this client
    await mergeFinancialFolders(userId);
    return { success: true, clientId };
  } catch (error) {
    logger.error("Error organizing document into folders:", error);
    return { success: false };
  }
};
