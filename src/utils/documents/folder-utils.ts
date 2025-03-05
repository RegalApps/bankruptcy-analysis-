
import { supabase } from "@/lib/supabase";
import { FolderOperationResult } from "@/types/folders";

/**
 * Creates client folders if they don't exist
 */
export const createClientFolder = async (
  clientName: string,
  userId: string
): Promise<FolderOperationResult> => {
  try {
    // Check if client folder already exists
    const { data: existingFolders } = await supabase
      .from('documents')
      .select('id, title')
      .eq('is_folder', true)
      .eq('folder_type', 'client')
      .ilike('title', clientName)
      .limit(1);
      
    if (existingFolders && existingFolders.length > 0) {
      return {
        success: true,
        message: "Client folder already exists",
        folderId: existingFolders[0].id
      };
    }
    
    // Create new client folder
    const { data: newFolder, error } = await supabase
      .from('documents')
      .insert({
        title: clientName,
        type: 'folder',
        is_folder: true,
        folder_type: 'client',
        metadata: {
          level: 0,
          created_by: userId,
          created_at: new Date().toISOString()
        },
        user_id: userId
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Create standard subfolders: Forms and Financial Sheets
    const subfolders = [
      { name: 'Forms', type: 'form' },
      { name: 'Financial Sheets', type: 'financial' }
    ];
    
    for (const subfolder of subfolders) {
      await supabase
        .from('documents')
        .insert({
          title: subfolder.name,
          type: 'folder',
          is_folder: true,
          folder_type: subfolder.type,
          parent_folder_id: newFolder.id,
          metadata: {
            level: 1,
            created_by: userId,
            created_at: new Date().toISOString()
          },
          user_id: userId
        });
    }
    
    return {
      success: true,
      message: "Client folder created successfully",
      folderId: newFolder.id
    };
  } catch (error) {
    console.error("Error creating client folder:", error);
    return {
      success: false,
      message: "Failed to create client folder",
      error
    };
  }
};

/**
 * Organizes a document into the appropriate folder
 */
export const organizeDocumentIntoFolders = async (
  documentId: string,
  userId: string,
  clientName: string,
  documentType: "Form" | "Excel" | "PDF" | "Document"
): Promise<FolderOperationResult> => {
  try {
    // First create/get client folder
    const clientFolderResult = await createClientFolder(clientName, userId);
    
    if (!clientFolderResult.success || !clientFolderResult.folderId) {
      throw new Error(clientFolderResult.message);
    }
    
    // Get appropriate subfolder based on document type
    const subfolderType = documentType === "Excel" ? "financial" : "form";
    
    const { data: subfolders } = await supabase
      .from('documents')
      .select('id, title')
      .eq('is_folder', true)
      .eq('folder_type', subfolderType)
      .eq('parent_folder_id', clientFolderResult.folderId);
      
    let subfolderId: string | undefined;
    
    if (subfolders && subfolders.length > 0) {
      subfolderId = subfolders[0].id;
    } else {
      // Create subfolder if it doesn't exist
      const subfolderName = documentType === "Excel" ? "Financial Sheets" : "Forms";
      
      const { data: newSubfolder, error } = await supabase
        .from('documents')
        .insert({
          title: subfolderName,
          type: 'folder',
          is_folder: true,
          folder_type: subfolderType,
          parent_folder_id: clientFolderResult.folderId,
          metadata: {
            level: 1,
            created_by: userId,
            created_at: new Date().toISOString()
          },
          user_id: userId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      subfolderId = newSubfolder.id;
    }
    
    // Update document to be in the appropriate subfolder
    const { error: updateError } = await supabase
      .from('documents')
      .update({ 
        parent_folder_id: subfolderId,
        metadata: {
          organized_at: new Date().toISOString(),
          organized_by: userId,
          client_name: clientName,
          document_type: documentType,
          processing_complete: true
        }
      })
      .eq('id', documentId);
      
    if (updateError) throw updateError;
    
    return {
      success: true,
      message: "Document organized successfully",
      folderId: subfolderId
    };
  } catch (error) {
    console.error("Error organizing document:", error);
    return {
      success: false,
      message: "Failed to organize document",
      error
    };
  }
};

/**
 * Gets the complete path for a folder
 */
export const getFolderPath = async (folderId: string): Promise<string[]> => {
  try {
    const path: string[] = [];
    let currentFolderId = folderId;
    
    while (currentFolderId) {
      const { data: folder } = await supabase
        .from('documents')
        .select('id, title, parent_folder_id')
        .eq('id', currentFolderId)
        .single();
        
      if (!folder) break;
      
      path.unshift(folder.title);
      currentFolderId = folder.parent_folder_id || '';
    }
    
    return path;
  } catch (error) {
    console.error("Error getting folder path:", error);
    return [];
  }
};
