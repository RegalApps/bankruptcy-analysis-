
import { useEffect, useState } from "react";
import { useClientData } from "../../hooks/useClientData";
import { ClientHeader } from "./ClientHeader";
import { ClientTabs } from "./ClientTabs";
import { ClientTabContent } from "./ClientTabContent";
import { ClientErrorState } from "../ClientErrorState";
import { ClientViewerProps } from "../../types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";
import { DesktopView } from "./DesktopView";
import { MobileTabletView } from "./MobileTabletView";

export const ClientViewerContainer = ({ 
  clientId, 
  onBack,
  onDocumentOpen,
  onError
}: ClientViewerProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const { 
    client, 
    documents, 
    isLoading, 
    activeTab, 
    setActiveTab,
    error,
    lastActivityDate
  } = useClientData(clientId, onBack);

  // Handle document selection
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };
  
  // Find the selected document for preview
  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId) || null;

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
    }, 100);
    
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
    <div className="h-full flex flex-col bg-background">
      <ClientHeader client={client} onBack={onBack} />
      
      {(isMobile || isTablet) ? (
        <div className="mt-2 flex-1 overflow-hidden flex flex-col">
          <div className="px-2">
            <ClientTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="mt-2 flex-1 overflow-hidden">
            <MobileTabletView 
              client={client}
              documents={documents}
              selectedDocument={selectedDocument}
              selectedDocumentId={selectedDocumentId}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onDocumentOpen={onDocumentOpen || (() => {})}
              onDocumentSelect={handleDocumentSelect}
              lastActivityDate={lastActivityDate}
              isMobile={isMobile}
            />
          </div>
        </div>
      ) : (
        <div className="mt-4 flex-1 overflow-hidden flex flex-col">
          <div className="px-4 mb-4">
            <ClientTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="flex-1 overflow-hidden px-4 pb-4">
            <DesktopView 
              client={client}
              documents={documents}
              selectedDocument={selectedDocument}
              selectedDocumentId={selectedDocumentId}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onDocumentOpen={onDocumentOpen || (() => {})}
              onDocumentSelect={handleDocumentSelect}
              lastActivityDate={lastActivityDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};
