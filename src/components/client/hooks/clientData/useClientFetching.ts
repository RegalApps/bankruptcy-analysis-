
import { useState, useEffect } from "react";
import { Client, Document } from "../../types";
import { processClientDocuments } from "./utils/documentProcessor";
import { toast } from "sonner";

export const useClientFetching = (
  clientId: string, 
  onBack: () => void,
  setError: (error: Error | null) => void
) => {
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      console.log("Fetching client data for ID:", clientId);
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the document processor to handle all the fetching and processing logic
        const { client: fetchedClient, documents: fetchedDocuments } = 
          await processClientDocuments(clientId);
        
        if (fetchedClient) {
          console.log("Client data fetched successfully:", fetchedClient.name);
          console.log("Document count:", fetchedDocuments.length);
          setClient(fetchedClient);
          setDocuments(fetchedDocuments);
        } else {
          console.error("No client data found for ID:", clientId);
          toast.error(`Could not find client information for ${clientId}`);
          setError(new Error("No client information found"));
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        toast.error("Failed to load client data");
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [clientId, onBack, setError]);

  return {
    client,
    documents,
    isLoading,
    setClient,
    setDocuments,
    setIsLoading
  };
};
