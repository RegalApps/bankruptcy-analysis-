import { useState, useEffect } from "react";
import { Client, Document } from "../types";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { processClientDocuments } from "./clientData/utils/documentProcessor";

export const useClientData = (clientId: string, onBack: () => void) => {
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [lastActivityDate, setLastActivityDate] = useState<string | undefined>(undefined);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) {
        setError("No client ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Reset states to prevent UI bleeding between clients
        setClient(null);
        setDocuments([]);
        
        const { client, documents } = await processClientDocuments(clientId);
        
        if (!client) {
          setError("Client not found");
          setIsLoading(false);
          return;
        }
        
        // Find most recent activity date from documents
        if (documents.length > 0) {
          const mostRecent = documents.reduce((latest, doc) => {
            const docDate = new Date(doc.updated_at).getTime();
            return docDate > latest ? docDate : latest;
          }, 0);
          
          if (mostRecent > 0) {
            setLastActivityDate(new Date(mostRecent).toISOString());
          }
        }
        
        setClient(client);
        setDocuments(documents);
        
        // Sort documents by date (newest first)
        const sortedDocs = [...documents].sort((a, b) => {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        
        setDocuments(sortedDocs);
        
        // Default to documents tab on mobile if documents exist
        if (isMobile && documents.length > 0) {
          setActiveTab("documents");
        }
        
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError("Failed to load client data");
        toast.error("Could not load client information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, isMobile]);

  return {
    client,
    documents,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    lastActivityDate
  };
};
