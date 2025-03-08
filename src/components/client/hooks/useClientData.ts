
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
          toast({
            variant: "destructive",
            title: "Client not found",
            description: "Could not find client information"
          });
          onBack();
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load client information"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [clientId, toast, onBack]);

  return {
    client,
    documents,
    isLoading,
    activeTab,
    setActiveTab
  };
};
