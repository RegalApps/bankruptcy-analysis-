
import { supabase } from "@/lib/supabase";
import { Document, Client } from "../../../types";
import { createClientData } from "./clientDataCreator";
import { getDefaultDocuments } from "./defaultData";
import { getClientData, getClientDocuments } from "../../../data/clientTemplates";

/**
 * Fetches documents for a specific client ID
 */
export const fetchClientDocuments = async (clientId: string, searchClientId: string) => {
  console.log("Fetching client documents for:", clientId);
  
  try {
    // First check if we have template data for this client
    if (['jane-smith', 'robert-johnson', 'maria-garcia'].includes(searchClientId)) {
      console.log(`Using template data for ${searchClientId}`);
      return getClientDocuments(searchClientId);
    }
    
    // If not a template client, try the database
    const { data: clientDocs, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .or(`metadata->client_id.eq.${searchClientId},metadata->client_name.ilike.%${clientId}%`)
      .order('created_at', { ascending: false });
      
    if (docsError) {
      console.error("Error fetching documents:", docsError);
      throw docsError;
    }
    
    return clientDocs || [];
  } catch (error) {
    console.error("Failed to fetch client documents:", error);
    throw error;
  }
};

/**
 * Tries to fetch Form 47 documents if no direct client matches are found
 */
export const fetchForm47Documents = async () => {
  console.log("Fetching Form 47 documents as fallback");
  
  try {
    // Look specifically for Form 47 or Consumer Proposal documents
    const { data: form47Docs, error: form47Error } = await supabase
      .from('documents')
      .select('*')
      .or('metadata->formType.eq.form-47,metadata->formNumber.eq.47,title.ilike.%consumer proposal%,title.ilike.%form 47%')
      .order('created_at', { ascending: false });
      
    if (form47Error) {
      console.error("Error fetching Form 47 documents:", form47Error);
      throw form47Error;
    }
    
    return form47Docs || [];
  } catch (error) {
    console.error("Failed to fetch Form 47 documents:", error);
    return [];
  }
};

/**
 * Handles special case for clients
 */
export const handleJoshHartClient = (clientId: string, searchClientId: string, documents?: Document[]) => {
  if (searchClientId === 'josh-hart' || clientId.toLowerCase().includes('josh')) {
    console.log("Detected Josh Hart client ID, providing fallback data");
    
    const clientData: Client = createClientData(
      'josh-hart', 
      'Josh Hart', 
      'active', 
      'josh.hart@example.com', 
      '(555) 123-4567',
      new Date().toISOString(),
      85
    );
    
    // If documents are provided, use them, otherwise use default documents
    const clientDocs = documents && documents.length > 0 
      ? documents 
      : getDefaultDocuments('Josh Hart');
    
    return { 
      clientData, 
      clientDocs 
    };
  }
  
  // Handle other template clients
  if (['jane-smith', 'robert-johnson', 'maria-garcia'].includes(searchClientId)) {
    const clientData = getClientData(searchClientId);
    const clientDocs = getClientDocuments(searchClientId);
    
    return {
      clientData,
      clientDocs
    };
  }
  
  return null;
};

/**
 * Extracts client information from a document
 */
export const extractClientInfoFromDocument = (sourceDoc: Document) => {
  const metadata = sourceDoc.metadata as Record<string, any> || {};
  
  // Try to find client info from different sources
  let clientName = metadata.client_name || metadata.clientName;
  let clientEmail = metadata.client_email || metadata.email;
  let clientPhone = metadata.client_phone || metadata.phone;
  
  // If this is a client folder, the name might be in the title
  if (sourceDoc.is_folder && sourceDoc.folder_type === 'client') {
    clientName = sourceDoc.title;
  }
  
  // For Form 47 we know the client is Josh Hart
  if (isForm47Document(sourceDoc)) {
    clientName = clientName || "Josh Hart";
  }
  
  return {
    clientName,
    clientEmail,
    clientPhone
  };
};

/**
 * Checks if a document is a Form 47 document
 */
export const isForm47Document = (doc: Document) => {
  const metadata = doc.metadata as Record<string, any> || {};
  const title = doc.title?.toLowerCase() || '';
  
  return metadata.formType === 'form-47' || 
         metadata.formNumber === '47' || 
         title.includes('form 47') || 
         title.includes('consumer proposal');
};

/**
 * Extract client name from client ID as a last resort
 */
export const extractClientNameFromId = (id: string): string => {
  // Try to extract the name from the client ID
  const clientIdParts = id.split('-');
  if (clientIdParts.length > 0) {
    return clientIdParts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  } 
  return 'Unknown Client';
};
