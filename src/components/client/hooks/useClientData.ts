
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  last_interaction?: string;
  engagement_score?: number;
}

interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export const useClientData = (clientId: string, onBack: () => void) => {
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("documents");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching client data for ID:", clientId);
        
        // Get documents with this client ID in metadata
        const { data: clientDocs, error: docsError } = await supabase
          .from('documents')
          .select('*')
          .or(`metadata->client_id.eq.${clientId},id.eq.${clientId}`);
          
        if (docsError) {
          console.error("Error fetching documents:", docsError);
          throw docsError;
        }
        
        console.log(`Found ${clientDocs?.length || 0} documents for client:`, clientDocs);
        
        if (clientDocs && clientDocs.length > 0) {
          // Extract client details from the first document
          const firstDoc = clientDocs[0];
          const metadata = firstDoc.metadata as Record<string, any> || {};
          
          console.log("Document metadata:", metadata);
          
          // Try to find client info from different sources
          let clientName = metadata.client_name || metadata.clientName;
          let clientEmail = metadata.client_email || metadata.email;
          let clientPhone = metadata.client_phone || metadata.phone;
          
          // If this is a client folder, the name might be in the title
          if (firstDoc.is_folder && firstDoc.folder_type === 'client') {
            clientName = firstDoc.title;
          }
          
          // If we couldn't find a name at all, try a last resort
          if (!clientName) {
            const clientIdParts = clientId.split('-');
            if (clientIdParts.length > 0) {
              clientName = clientIdParts[0].replace(/([A-Z])/g, ' $1').trim();
              clientName = clientName.charAt(0).toUpperCase() + clientName.slice(1);
            } else {
              clientName = 'Unknown Client';
            }
          }
          
          const clientData: Client = {
            id: clientId,
            name: clientName || 'Unknown Client',
            email: clientEmail,
            phone: clientPhone,
            status: 'active',
          };
          
          console.log("Constructed client data:", clientData);
          
          setClient(clientData);
          setDocuments(clientDocs);
        } else {
          console.error("No client documents found");
          toast.error("Could not find client information");
          setError(new Error("No client information found"));
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        toast.error("Failed to load client information");
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [clientId, onBack]);

  return {
    client,
    documents,
    isLoading,
    activeTab,
    setActiveTab,
    error
  };
};
