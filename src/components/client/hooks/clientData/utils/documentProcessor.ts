
import { toast } from "sonner";
import { Client, Document } from "../../../types";
import { 
  fetchClientDocuments, 
  fetchForm47Documents, 
  handleJoshHartClient
} from "./documentFetcher";
import { initializeClientFromDocuments } from "./clientDataInitializer";
import { extractClientInfo } from "@/utils/documents/formExtraction";
import { supabase } from "@/lib/supabase";

/**
 * Processes client documents and returns client data and documents
 */
export const processClientDocuments = async (
  clientId: string
): Promise<{ client: Client | null; documents: Document[] }> => {
  console.log("Processing client documents for ID:", clientId);
  
  // Create a client ID suitable for database queries
  const searchClientId = clientId.toLowerCase().replace(/\s+/g, '-');
  
  console.log("Using search client ID:", searchClientId);
  
  try {
    // First try to get client documents
    let clientDocs: Document[] = [];
    try {
      clientDocs = await fetchClientDocuments(clientId, searchClientId);
    } catch (docsError) {
      // Special case handling for Josh Hart when there's an error
      const joshHartData = handleJoshHartClient(clientId, searchClientId);
      if (joshHartData) {
        return { 
          client: joshHartData.clientData, 
          documents: joshHartData.clientDocs 
        };
      }
      
      throw docsError;
    }
    
    // If no documents found with exact matching, try for Form 47 documents
    if (!clientDocs || clientDocs.length === 0) {
      console.log("No exact matches found, looking for Form 47 documents");
      
      try {
        const form47Docs = await fetchForm47Documents();
        
        if (form47Docs && form47Docs.length > 0) {
          console.log(`Found ${form47Docs.length} Form 47 documents`);
          
          // For Josh Hart, we know this is the correct client for Form 47
          const joshHartData = handleJoshHartClient(clientId, searchClientId, form47Docs);
          if (joshHartData) {
            return { 
              client: joshHartData.clientData, 
              documents: joshHartData.clientDocs 
            };
          }
        }
      } catch (form47Error) {
        console.error("Error in Form 47 fallback:", form47Error);
        // Continue with the flow, doesn't block the main functionality
      }
    }
    
    console.log(`Found ${clientDocs?.length || 0} documents for client:`, clientDocs);
    
    if (clientDocs && clientDocs.length > 0) {
      // Try to extract text content for Form 31 processing
      try {
        const processedClientDocs = await processDocumentsContent(clientDocs);
        const client = initializeClientFromDocuments(clientId, processedClientDocs);
        return { client, documents: processedClientDocs };
      } catch (extractError) {
        console.error("Error processing document content:", extractError);
        const client = initializeClientFromDocuments(clientId, clientDocs);
        return { client, documents: clientDocs };
      }
    }
    
    // Special case for Josh Hart when no documents found
    const joshHartData = handleJoshHartClient(clientId, searchClientId);
    if (joshHartData) {
      return { 
        client: joshHartData.clientData, 
        documents: joshHartData.clientDocs 
      };
    }
    
    // No client documents or special cases found
    console.error("No client documents found");
    toast.error("Could not find client information");
    return { client: null, documents: [] };
    
  } catch (error) {
    console.error('Error processing client documents:', error);
    toast.error("Failed to load client information");
    throw error;
  }
};

/**
 * Process document content to extract client information for appropriate form types
 */
async function processDocumentsContent(docs: Document[]): Promise<Document[]> {
  const processedDocs = [...docs];
  
  for (let i = 0; i < processedDocs.length; i++) {
    const doc = processedDocs[i];
    
    // Skip if not a Form 31 or no storage path
    if (!doc.storage_path || !doc.title?.toLowerCase().includes('form 31')) {
      continue;
    }
    
    try {
      // Fetch document text content
      const { data } = await supabase.storage
        .from('documents')
        .download(doc.storage_path);
      
      if (!data) continue;
      
      // Get text content from document
      const text = await data.text();
      
      // Extract client info
      const clientInfo = extractClientInfo(text);
      
      // Update document metadata
      if (Object.keys(clientInfo).length > 0) {
        processedDocs[i] = {
          ...doc,
          metadata: {
            ...doc.metadata,
            extractedClientInfo: clientInfo,
            formType: 'form-31'
          }
        };
        
        // Also update in database
        await supabase
          .from('documents')
          .update({
            metadata: {
              ...doc.metadata,
              extractedClientInfo: clientInfo,
              formType: 'form-31'
            }
          })
          .eq('id', doc.id);
          
        // Create client record if needed
        if (clientInfo.clientName) {
          const { data: existingClient } = await supabase
            .from('clients')
            .select('id')
            .eq('name', clientInfo.clientName)
            .single();
            
          if (!existingClient) {
            const { data: newClient, error } = await supabase
              .from('clients')
              .insert({
                name: clientInfo.clientName,
                status: 'active',
                metadata: {
                  source: 'form-31',
                  documentId: doc.id,
                  isCompany: clientInfo.isCompany === 'true',
                  totalDebts: clientInfo.totalDebts
                }
              })
              .select()
              .single();
              
            if (newClient && !error) {
              toast.success(`Created client profile for ${clientInfo.clientName}`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing document text:", error);
    }
  }
  
  return processedDocs;
}

