
import { useState, useEffect } from "react";
import { useClientFetching } from "./clientData/useClientFetching";
import { useClientTabs } from "./clientData/useClientTabs";
import { Client, Document } from "../types";

export const useClientData = (clientId: string, onBack: () => void) => {
  const [error, setError] = useState<Error | null>(null);
  
  console.log("useClientData: Initializing with clientId:", clientId);
  
  const { 
    client, 
    documents, 
    isLoading,
    setClient,
    setDocuments,
    setIsLoading 
  } = useClientFetching(clientId, onBack, setError);
  
  const { activeTab, setActiveTab } = useClientTabs();

  // Add effect to log client data loading state
  useEffect(() => {
    console.log("useClientData: Client data state updated:", {
      clientId,
      clientLoaded: !!client,
      documentCount: documents?.length,
      isLoading,
      hasError: !!error
    });
  }, [client, documents, isLoading, error, clientId]);

  return {
    client,
    documents,
    isLoading,
    activeTab,
    setActiveTab,
    error
  };
};
