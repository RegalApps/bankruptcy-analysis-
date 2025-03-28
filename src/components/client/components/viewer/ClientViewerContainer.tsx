
import { useEffect, useState } from "react";
import { useClientData } from "../../hooks/useClientData";
import { ClientHeader } from "./ClientHeader";
import { ClientTabs } from "./ClientTabs";
import { ClientTabContent } from "./ClientTabContent";
import { ClientErrorState } from "../ClientErrorState";
import { ClientNotFound } from "../ClientNotFound";
import { ClientViewerProps } from "../../types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

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
      console.error("ClientViewerContainer: Error loading client data:", error);
      onError();
    }
  }, [error, onError]);

  // Prevent flickering by delaying the mount
  useEffect(() => {
    console.log("ClientViewerContainer: Setting up mount timer for clientId:", clientId);
    const timer = setTimeout(() => {
      console.log("ClientViewerContainer: Component mounted for clientId:", clientId);
      setIsMounted(true);
    }, 50);
    
    return () => {
      console.log("ClientViewerContainer: Cleaning up mount timer");
      clearTimeout(timer);
    };
  }, [clientId]);

  // Notify the user when client data is successfully loaded
  useEffect(() => {
    if (isMounted && client && !isLoading) {
      console.log("ClientViewerContainer: Client data loaded successfully:", client.name);
      toast.success(`${client.name}'s information loaded`);
    }
  }, [client, isMounted, isLoading]);

  if (!isMounted || isLoading) {
    console.log("ClientViewerContainer: Still loading or not mounted yet");
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    console.error("ClientViewerContainer: Rendering error state:", error.message);
    return <ClientErrorState onBack={onBack} error={error} />;
  }

  if (!client) {
    console.log("ClientViewerContainer: Client not found for ID:", clientId);
    return <ClientNotFound onBack={onBack} />;
  }

  console.log("ClientViewerContainer: Rendering client", client.name, "with", documents.length, "documents");

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
