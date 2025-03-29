
import { Document } from "@/components/client/types";
import { FolderStructure } from "@/types/folders";

/**
 * Extracts unique clients from a list of documents
 */
export const extractClientsFromDocuments = (documents: Document[]) => {
  // Create a map to store unique clients
  const clientMap = new Map<string, { id: string; name: string }>();
  
  // Iterate through documents to find client information
  documents.forEach(doc => {
    if (doc.metadata && typeof doc.metadata === 'object') {
      const clientId = doc.metadata.client_id || doc.metadata.clientId;
      const clientName = doc.metadata.client_name || doc.metadata.clientName;
      
      if (clientId && clientName && !clientMap.has(clientId)) {
        clientMap.set(clientId, { id: clientId, name: clientName });
      }
    }
  });
  
  // Convert map to array and sort by name
  return Array.from(clientMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
};

/**
 * Filters documents based on selected client
 */
export const filterDocumentsByClient = (
  documents: Document[], 
  selectedClientId: string | null
): Document[] => {
  if (!selectedClientId) return documents;
  
  return documents.filter(doc => {
    if (!doc.metadata || typeof doc.metadata !== 'object') return false;
    
    const clientId = doc.metadata.client_id || doc.metadata.clientId;
    return clientId === selectedClientId;
  });
};

/**
 * Filters folders based on selected client and matching documents
 */
export const filterFoldersByClient = (
  folders: FolderStructure[],
  filteredDocuments: Document[],
  selectedClientId: string | null
): FolderStructure[] => {
  if (!selectedClientId) return folders;
  
  // Get array of document IDs that are associated with the selected client
  const documentIds = filteredDocuments.map(doc => doc.id);
  
  // Filter folders that are related to the selected client
  return folders.filter(folder => {
    // Check if this folder is directly associated with the client
    if (folder.metadata && typeof folder.metadata === 'object') {
      const folderClientId = folder.metadata.client_id || folder.metadata.clientId;
      if (folderClientId === selectedClientId) return true;
    }
    
    // Or check if this folder contains any documents that are associated with the client
    return documentIds.includes(folder.id);
  });
};
