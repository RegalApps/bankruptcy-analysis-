import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";

/**
 * Creates a hierarchical document structure with clients, estates, forms, and documents
 */
export function createDocumentHierarchy(documents: Document[]): Document[] {
  // First, identify client documents/folders
  const clientFolders = documents.filter(doc => 
    doc.is_folder && (doc.folder_type === 'client' || doc.metadata?.client_name)
  );
  
  // For each client folder, create the proper hierarchy
  clientFolders.forEach(clientFolder => {
    const clientName = clientFolder.title;
    
    // Find or create an estate folder for this client
    const estateFolder = documents.find(doc => 
      doc.is_folder && 
      doc.folder_type === 'estate' && 
      doc.parent_folder_id === clientFolder.id
    );
    
    if (!estateFolder) {
      // Create a default estate folder if none exists
      const estateNumber = "Estate-47-2023";
      const newEstateFolder: Document = {
        id: `estate-${clientFolder.id}`,
        title: estateNumber,
        is_folder: true,
        folder_type: 'estate',
        parent_folder_id: clientFolder.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        type: 'folder',
        storage_path: '',
        size: 0,
        metadata: {
          estate_number: "47-2023",
          client_id: clientFolder.id,
          client_name: clientName
        }
      };
      documents.push(newEstateFolder);
      
      // Create a Form 47 folder under the estate
      const formFolder: Document = {
        id: `form-${estateNumber}-${clientFolder.id}`,
        title: "Form 47",
        is_folder: true,
        folder_type: 'form',
        parent_folder_id: newEstateFolder.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        type: 'folder',
        storage_path: '',
        size: 0,
        metadata: {
          form_number: "47",
          estate_number: "47-2023",
          client_id: clientFolder.id,
          client_name: clientName
        }
      };
      documents.push(formFolder);
      
      // Move any Form 47 related documents under this form folder
      documents.forEach(doc => {
        if (!doc.is_folder && isForm47or76(doc) && 
            (doc.metadata?.client_name === clientName || !doc.parent_folder_id)) {
          doc.parent_folder_id = formFolder.id;
          // Mark these documents as needing attention
          if (!doc.metadata) doc.metadata = {};
          doc.metadata.status = 'attention';
        }
      });
    }
  });
  
  return documents;
}

/**
 * Check if a document is a Form 47 or Form 76
 */
export function isForm47or76(document: Document): boolean {
  if (!document) return false;
  
  const title = document.title?.toLowerCase() || '';
  const metadata = document.metadata || {};
  
  return title.includes('form 47') || 
         title.includes('form 76') ||
         title.includes('consumer proposal') ||
         metadata.formNumber === '47' ||
         metadata.formNumber === '76' ||
         metadata.formType === 'form-47' ||
         metadata.formType === 'form-76';
}

/**
 * Check if a document needs attention
 */
export function documentNeedsAttention(document: Document): boolean {
  if (!document) return false;
  
  // Check if status explicitly requires attention
  if (document.metadata?.status === 'attention' || 
      document.metadata?.status === 'critical') {
    return true;
  }
  
  // Form 47 and 76 need attention by default
  if (isForm47or76(document) && document.metadata?.status !== 'approved') {
    return true;
  }
  
  // Documents with pending tasks need attention
  if (document.tasks && document.tasks.length > 0) {
    const hasPendingTasks = document.tasks.some(task => 
      task.status === 'pending' || task.status === 'overdue'
    );
    if (hasPendingTasks) return true;
  }
  
  return false;
}

/**
 * Flatten folder structure for easy traversal
 */
export function flattenFolderStructure(folders: FolderStructure[]): FolderStructure[] {
  let result: FolderStructure[] = [];
  
  for (const folder of folders) {
    result.push(folder);
    if (folder.children && folder.children.length > 0) {
      result = result.concat(flattenFolderStructure(folder.children));
    }
  }
  
  return result;
}

/**
 * Check if a document is locked for editing
 */
export function isDocumentLocked(document: Document): boolean {
  if (!document) return false;
  
  // Document is locked if explicitly marked as locked
  if (document.metadata?.locked === true) return true;
  
  // Document is locked if it's a system document
  if (document.metadata?.system === true) return true;
  
  // Document is locked if it's in a specific state that requires protection
  if (document.metadata?.status === 'approved' || 
      document.metadata?.status === 'submitted' ||
      document.metadata?.status === 'filed') {
    return true;
  }
  
  return false;
}
