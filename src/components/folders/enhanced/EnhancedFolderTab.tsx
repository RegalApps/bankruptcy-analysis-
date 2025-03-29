
import React, { useState } from "react";
import { FolderList } from "./components/FolderList";
import { Document } from "@/components/client/types";
import { EmptyState } from "./components/EmptyState";
import { FolderRecommendation } from "./components/FolderRecommendation";
import { ClientTab } from "./components/ClientTab";
import { ClientSection } from "./components/ClientSection";
import { useLocation } from "react-router-dom";
import { UncategorizedTab } from "./components/UncategorizedTab";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen?: (documentId: string) => void;
  onRefresh?: () => void;
}

export const EnhancedFolderTab = ({ documents, onDocumentOpen, onRefresh }: EnhancedFolderTabProps) => {
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  // Check for selected client in location state
  React.useEffect(() => {
    const locationState = location.state as { selectedClient?: string } | null;
    if (locationState?.selectedClient) {
      setSelectedClient(locationState.selectedClient);
    }
  }, [location]);

  const handleClientSelect = (clientId: string) => {
    console.log("EnhancedFolderTab: Selected client:", clientId);
    setSelectedClient(clientId);
  };

  const handleBackFromClient = () => {
    console.log("EnhancedFolderTab: Back from client view");
    setSelectedClient(null);
  };

  if (selectedClient) {
    return (
      <ClientTab 
        clientId={selectedClient}
        onBack={handleBackFromClient}
        onDocumentOpen={onDocumentOpen}
      />
    );
  }

  if (documents.length === 0) {
    return <EmptyState onRefresh={onRefresh} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
      {/* Client sidebar */}
      <div className="lg:col-span-1 h-full overflow-auto bg-muted/20 rounded-lg p-4">
        <ClientSection 
          documents={documents}
          onClientSelect={handleClientSelect}
        />
      </div>
      
      {/* Main content */}
      <div className="lg:col-span-3 flex flex-col h-full">
        <FolderRecommendation 
          documents={documents} 
          onRefresh={onRefresh}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="space-y-8">
            <FolderList 
              documents={documents} 
              onDocumentOpen={onDocumentOpen}
            />
            
            <UncategorizedTab 
              documents={documents.filter(doc => !doc.parent_folder_id && !doc.is_folder)}
              onDocumentOpen={onDocumentOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
