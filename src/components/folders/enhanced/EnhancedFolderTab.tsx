
import React, { useState, useEffect } from "react";
import { FolderList } from "./components/FolderList";
import { Document } from "@/components/client/types";
import { EmptyState } from "./components/EmptyState";
import { ClientSection } from "./components/ClientSection";
import { ClientTab } from "./components/ClientTab";
import { useLocation } from "react-router-dom";
import { UncategorizedTab } from "./components/UncategorizedTab";
import { extractClientsFromDocuments } from "./hooks/utils/clientExtractionUtils";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen?: (documentId: string) => void;
  onRefresh?: () => void;
}

export const EnhancedFolderTab = ({ documents = [], onDocumentOpen, onRefresh }: EnhancedFolderTabProps) => {
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);
  
  // Extract clients from documents
  useEffect(() => {
    if (documents && documents.length > 0) {
      const extractedClients = extractClientsFromDocuments(documents);
      setClients(extractedClients);
    }
  }, [documents]);
  
  // Check for selected client in location state
  useEffect(() => {
    const locationState = location.state as { selectedClient?: string } | null;
    if (locationState?.selectedClient) {
      setSelectedClient(locationState.selectedClient);
    }
  }, [location]);

  const handleClientSelect = (clientId: string) => {
    console.log("EnhancedFolderTab: Selected client:", clientId);
    setSelectedClient(clientId);
  };

  const handleClientViewerAccess = (clientId: string) => {
    console.log("EnhancedFolderTab: Opening client viewer for:", clientId);
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

  if (!documents || documents.length === 0) {
    return <EmptyState onRefresh={onRefresh} />;
  }

  // Filter documents with folders for FolderList
  const folderDocuments = documents.filter(doc => doc && (doc.is_folder || doc.parent_folder_id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
      {/* Client sidebar */}
      <div className="lg:col-span-1 h-full overflow-auto bg-muted/20 rounded-lg p-4">
        <ClientSection 
          clients={clients || []}
          onClientSelect={handleClientSelect}
          onClientViewerAccess={handleClientViewerAccess}
        />
      </div>
      
      {/* Main content */}
      <div className="lg:col-span-3 flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <div className="space-y-8">
            <FolderList 
              folders={folderDocuments.filter(doc => doc && doc.is_folder)} 
              onDocumentOpen={onDocumentOpen}
            />
            
            <UncategorizedTab 
              documents={documents.filter(doc => doc && !doc.parent_folder_id && !doc.is_folder)}
              onDocumentOpen={onDocumentOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
