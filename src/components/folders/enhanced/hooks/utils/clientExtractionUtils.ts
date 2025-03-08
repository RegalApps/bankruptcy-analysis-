
import { Document } from "@/components/DocumentList/types";

/**
 * Extracts unique client information from document metadata
 * 
 * @param documents List of documents to extract client information from
 * @returns Array of unique client objects with id and name
 */
export const extractClientsFromDocuments = (documents: Document[]): {id: string, name: string}[] => {
  // Create a Map to deduplicate clients by ID
  const uniqueClients = new Map<string, {id: string, name: string}>();
  
  documents.forEach(doc => {
    const metadata = doc.metadata as Record<string, any> || {};
    
    // Check for client_id and client_name in metadata
    if (metadata?.client_id && metadata?.client_name) {
      uniqueClients.set(metadata.client_id, {
        id: metadata.client_id,
        name: metadata.client_name
      });
    }
    
    // Check for clientName in metadata (alternative format)
    if (metadata?.clientName) {
      const clientName = metadata.clientName;
      // Create a consistent client ID from the name if no explicit ID exists
      const clientId = metadata.client_id || clientName.toLowerCase().replace(/\s+/g, '-');
      
      uniqueClients.set(clientId, {
        id: clientId,
        name: clientName
      });
    }
    
    // Check for metadata from folder structure
    if (doc.is_folder && doc.folder_type === 'client') {
      uniqueClients.set(doc.id, {
        id: doc.id,
        name: doc.title
      });
    }
  });
  
  // Convert Map to array and sort by name
  return Array.from(uniqueClients.values())
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Filters documents based on selected client ID
 * 
 * @param documents List of all documents
 * @param selectedClientId ID of selected client
 * @returns Filtered list of documents belonging to selected client
 */
export const filterDocumentsByClient = (documents: Document[], selectedClientId?: string): Document[] => {
  if (!selectedClientId) return documents;
  
  return documents.filter(doc => {
    const metadata = doc.metadata as Record<string, any> || {};
    return metadata?.client_id === selectedClientId || 
           doc.id === selectedClientId ||
           (metadata?.clientName && metadata.client_id === selectedClientId);
  });
};

/**
 * Filters folders based on selected client and filtered documents
 * 
 * @param folders List of all folders
 * @param filteredDocuments Documents filtered by client ID
 * @param selectedClientId ID of selected client
 * @returns Filtered list of folders containing documents belonging to selected client
 */
export const filterFoldersByClient = (
  folders: any[], 
  filteredDocuments: Document[], 
  selectedClientId?: string
): any[] => {
  if (!selectedClientId) return folders;
  
  return folders.filter(folder => {
    // Check if any document in this folder belongs to the selected client
    return filteredDocuments.some(doc => 
      doc.parent_folder_id === folder.id || 
      doc.id === folder.id
    );
  });
};
