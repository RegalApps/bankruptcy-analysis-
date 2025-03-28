
import { Client, Document } from "../../../types";
import { createClientData } from "./clientDataCreator";
import { extractClientInfoFromDocument, extractClientNameFromId } from "./documentFetcher";

/**
 * Initialize client data from documents
 */
export const initializeClientFromDocuments = (clientId: string, documents: Document[]): Client => {
  // Find the document with the most complete client information
  let clientName = "";
  let clientEmail = "";
  let clientPhone = "";
  
  // Try to extract client info from each document, starting with the most recent
  const sortedDocs = [...documents].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  
  for (const doc of sortedDocs) {
    const { clientName: name, clientEmail: email, clientPhone: phone } = extractClientInfoFromDocument(doc);
    
    if (name && !clientName) clientName = name;
    if (email && !clientEmail) clientEmail = email;
    if (phone && !clientPhone) clientPhone = phone;
    
    // If we have all the info, break early
    if (clientName && clientEmail && clientPhone) break;
  }
  
  // If we still don't have a client name, try to extract from client ID
  if (!clientName) {
    clientName = extractClientNameFromId(clientId);
  }
  
  // Create and return the client data
  return createClientData(
    clientId,
    clientName,
    'active',
    clientEmail,
    clientPhone
  );
};
