
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ClientDataHookResult, Client, Document } from "./types";
import { fetchClientDocuments, extractClientDataFromDocuments } from "./clientDataService";
import { createDefaultJoshHartData } from "./clientDataUtils";

export const useClientData = (clientId: string, onBack: () => void): ClientDataHookResult => {
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
        
        // Handle special case for Josh Hart explicitly
        const isJoshHart = clientId.toLowerCase() === 'josh-hart' || clientId.toLowerCase().includes('josh');
        
        if (isJoshHart) {
          console.log("Detected Josh Hart client, using special handling");
          const { client: joshClient, documents: joshDocs } = createDefaultJoshHartData();
          setClient(joshClient);
          setDocuments(joshDocs);
          setIsLoading(false);
          return;
        }
        
        // Standard flow for other clients
        const clientDocs = await fetchClientDocuments(clientId);
        console.log(`Found ${clientDocs?.length || 0} documents for client:`, clientDocs);
        
        if (clientDocs && clientDocs.length > 0) {
          const clientData = extractClientDataFromDocuments(clientId, clientDocs);
          
          if (clientData) {
            setClient(clientData);
            setDocuments(clientDocs);
          } else {
            console.error("Failed to extract client data from documents");
            toast.error("Could not find client information");
            setError(new Error("No client information found"));
          }
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
