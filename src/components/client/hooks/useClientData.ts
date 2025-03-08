
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

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        // Get documents with this client ID in metadata
        const { data: clientDocs, error: docsError } = await supabase
          .from('documents')
          .select('*')
          .filter('metadata->client_id', 'eq', clientId);
          
        if (docsError) throw docsError;
        
        if (clientDocs && clientDocs.length > 0) {
          // Extract client details from the first document
          const firstDoc = clientDocs[0];
          const metadata = firstDoc.metadata as Record<string, any> || {};
          
          const clientData: Client = {
            id: clientId,
            name: metadata.client_name || 'Unknown Client',
            email: metadata.client_email,
            phone: metadata.client_phone,
            status: 'active',
          };
          
          setClient(clientData);
          setDocuments(clientDocs);
        } else {
          toast.error("Could not find client information");
          onBack();
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        toast.error("Failed to load client information");
        onBack();
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
    setActiveTab
  };
};
