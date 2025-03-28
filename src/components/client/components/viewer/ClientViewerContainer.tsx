
import { useState } from "react";
import { ClientHeader } from "./ClientHeader";
import { DesktopView } from "./DesktopView";
import { MobileTabletView } from "./MobileTabletView";
import { useMediaQuery } from "@/hooks/use-media-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Client, Document, ClientViewerProps } from "../../types";
import { useClientData } from "../../hooks/useClientData";

export const ClientViewerContainer = ({ clientId, onBack }: ClientViewerProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  // Use the hook to fetch client data
  const { 
    client, 
    documents, 
    isLoading, 
    error, 
    activeTab, 
    setActiveTab,
    lastActivityDate 
  } = useClientData(clientId, onBack);
  
  const selectedDocument = selectedDocumentId 
    ? documents.find(doc => doc.id === selectedDocumentId) || null
    : null;
  
  // Handle document opening (e.g., in a new tab or modal)
  const handleDocumentOpen = (documentId: string) => {
    window.open(`/documents/${documentId}`, '_blank');
  };
  
  // Handle document selection (for preview)
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !client) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Error Loading Client</h3>
        <p className="text-muted-foreground">
          {error ? error.toString() : "Client information could not be loaded."}
        </p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={onBack}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-background">
      <ClientHeader client={client} onBack={onBack} />
      
      {isDesktop ? (
        <DesktopView 
          client={client}
          documents={documents}
          selectedDocument={selectedDocument}
          selectedDocumentId={selectedDocumentId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDocumentOpen={handleDocumentOpen}
          onDocumentSelect={handleDocumentSelect}
          lastActivityDate={lastActivityDate}
        />
      ) : (
        <MobileTabletView 
          client={client}
          documents={documents}
          selectedDocument={selectedDocument}
          selectedDocumentId={selectedDocumentId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDocumentOpen={handleDocumentOpen}
          onDocumentSelect={handleDocumentSelect}
          lastActivityDate={lastActivityDate}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};
