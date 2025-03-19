
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
  // Pass onBack to useClientData
  const { client, documents, isLoading, error, activeTab, setActiveTab } = useClientData(clientId, onBack);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

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
    console.log("ClientViewer: Opening document with ID:", documentId);
    
    // Find the document to ensure we're passing the correct ID
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      onDocumentOpen(document.id);
    } else {
      console.warn("Document not found in documents array, using ID directly");
      onDocumentOpen(documentId);
    }
  };

  if (isLoading) {
    return <ClientSkeleton onBack={onBack} />;
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

  // Calculate document count for ClientInfoPanel
  const documentCount = documents.length;
  // Find the most recent document's updated_at date to use as last activity date
  const lastActivityDate = documents.length > 0 
    ? documents.reduce((latest, doc) => {
        return new Date(doc.updated_at) > new Date(latest) ? doc.updated_at : latest;
      }, documents[0].updated_at)
    : client.last_interaction;

  return (
    <div className="h-full flex flex-col">
      <ClientHeader client={client} onBack={onBack} />
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <div className="md:col-span-1">
          <ClientInfoPanel 
            client={client} 
            documentCount={documentCount}
            lastActivityDate={lastActivityDate}
            documents={documents}
            onDocumentSelect={handleDocumentSelect}
          />
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
            onDocumentOpen={handleDocumentOpen}
          />
        </div>
      </div>
    </div>
  );
};
