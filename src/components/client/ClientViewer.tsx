
import React, { useState, useEffect } from "react";
import { DocumentsPanel } from "./components/DocumentsPanel";
import { ClientInfoPanel } from "./components/ClientInfoPanel";
import { FilePreviewPanel } from "./components/FilePreviewPanel";
import { useClientData } from "./hooks/useClientData";
import { Document } from "./types";
import { ClientHeader } from "./components/ClientHeader";
import { ClientSkeleton } from "./components/ClientSkeleton";
import { toast } from "sonner";

interface ClientViewerProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen: (documentId: string) => void;
  onError?: () => void;
}

export const ClientViewer: React.FC<ClientViewerProps> = ({ 
  clientId, 
  onBack,
  onDocumentOpen,
  onError
}) => {
  const { client, documents, isLoading, error } = useClientData(clientId);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState('documents');

  // Set selected document when document ID changes
  useEffect(() => {
    if (selectedDocumentId && documents.length > 0) {
      const document = documents.find(doc => doc.id === selectedDocumentId);
      setSelectedDocument(document || null);
    } else {
      setSelectedDocument(null);
    }
  }, [selectedDocumentId, documents]);

  // Error handling
  useEffect(() => {
    if (error) {
      console.error("Error loading client data:", error);
      toast.error("Failed to load client data");
      if (onError) {
        onError();
      }
    }
  }, [error, onError]);

  const handleDocumentSelect = (documentId: string) => {
    console.log("Selected document ID:", documentId);
    setSelectedDocumentId(documentId);
  };

  const handleDocumentOpen = (documentId: string) => {
    console.log("Opening document with ID:", documentId);
    onDocumentOpen(documentId);
  };

  if (isLoading) {
    return <ClientSkeleton />;
  }

  if (!client) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Client Not Found</h2>
        <p className="text-muted-foreground mb-4">
          We couldn't find the client you're looking for.
        </p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ClientHeader client={client} onBack={onBack} />
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <div className="md:col-span-1">
          <ClientInfoPanel client={client} />
        </div>
        
        <div className="md:col-span-1 lg:col-span-1 border rounded-lg">
          <DocumentsPanel 
            documents={documents} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onDocumentSelect={handleDocumentSelect}
            onDocumentOpen={handleDocumentOpen}
            selectedDocumentId={selectedDocumentId}
          />
        </div>
        
        <div className="md:col-span-1 lg:col-span-2 border rounded-lg">
          <FilePreviewPanel 
            document={selectedDocument} 
            activeTab={activeTab} 
            onDocumentOpen={handleDocumentOpen}
          />
        </div>
      </div>
    </div>
  );
};
