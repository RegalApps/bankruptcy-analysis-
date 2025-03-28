
import { useEffect, useState } from "react";
import { useClientData } from "../../hooks/useClientData";
import { ClientHeader } from "./ClientHeader";
import { ClientTabs } from "./ClientTabs";
import { ClientTabContent } from "./ClientTabContent";
import { ClientErrorState } from "../ClientErrorState";
import { ClientViewerProps } from "../../types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const ClientViewerContainer = ({ 
  clientId, 
  onBack,
  onDocumentOpen,
  onError
}: ClientViewerProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { 
    client, 
    documents, 
    isLoading, 
    activeTab, 
    setActiveTab,
    error
  } = useClientData(clientId, onBack);

  // If there's an error, call the error callback
  useEffect(() => {
    if (error && onError) {
      onError();
    }
  }, [error, onError]);

  // Prevent flickering by delaying the mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted || isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return <ClientErrorState onBack={onBack} error={error} />;
  }

  if (!client) {
    return <ClientErrorState onBack={onBack} message="Client information not found" />;
  }

  return (
    <div className="h-full flex flex-col">
      <ClientHeader client={client} onBack={onBack} />
      
      <div className="mt-6 flex-1 overflow-hidden flex flex-col">
        <ClientTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-4 flex-1 overflow-auto">
          <ClientTabContent
            client={client}
            documents={documents}
            activeTab={activeTab}
            onDocumentOpen={onDocumentOpen}
          />
        </div>
      </div>
    </div>
  );
};
