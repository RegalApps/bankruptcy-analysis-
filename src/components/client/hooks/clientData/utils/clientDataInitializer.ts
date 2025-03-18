
import { Client, Document } from "../../../types";
import { createClientData } from "./clientDataCreator";
import { extractClientInfoFromDocument, extractClientNameFromId, isForm47Document } from "./documentFetcher";

/**
 * Creates client data from documents
 */
export const initializeClientFromDocuments = (
  clientId: string, 
  clientDocs: Document[]
): Client => {
  // If we have documents, use them to create client data
  if (clientDocs && clientDocs.length > 0) {
    // First check if any document is a Form 47 to prioritize it for client data
    const form47Doc = clientDocs.find(doc => isForm47Document(doc));
    
    // Use Form 47 if available or fall back to first document
    const sourceDoc = form47Doc || clientDocs[0];
    
    console.log("Using document for client data:", sourceDoc.title);
    console.log("Document metadata:", sourceDoc.metadata);
    
    // Extract client info
    const { clientName, clientEmail, clientPhone } = extractClientInfoFromDocument(sourceDoc);
    
    // If we couldn't find a name at all, try a last resort
    const finalClientName = clientName || extractClientNameFromId(clientId);
    
    return createClientData(
      clientId,
      finalClientName || 'Unknown Client',
      'active',
      clientEmail,
      clientPhone
    );
  }
  
  // Fallback to a basic client with name from ID
  return createClientData(
    clientId,
    extractClientNameFromId(clientId),
    'active'
  );
};
