
import { useState } from "react";
import { useClientFetching } from "./clientData/useClientFetching";
import { useClientTabs } from "./clientData/useClientTabs";
import { Client, Document } from "../types";

export const useClientData = (clientId: string, onBack: () => void) => {
  const [error, setError] = useState<Error | null>(null);
  
  const { 
    client, 
    documents, 
    isLoading,
    setClient,
    setDocuments,
    setIsLoading 
  } = useClientFetching(clientId, onBack, setError);
  
  const { activeTab, setActiveTab } = useClientTabs();

  return {
    client,
    documents,
    isLoading,
    activeTab,
    setActiveTab,
    error
  };
};
