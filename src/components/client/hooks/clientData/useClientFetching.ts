
import { useState, useEffect } from "react";
import { Client, Document } from "../../types";
import { processClientDocuments } from "./utils/documentProcessor";

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
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the document processor to handle all the fetching and processing logic
        const { client: fetchedClient, documents: fetchedDocuments } = 
          await processClientDocuments(clientId);
        
        if (fetchedClient) {
          setClient(fetchedClient);
          setDocuments(fetchedDocuments);
        } else {
          setError(new Error("No client information found"));
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
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
