import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";
import { ClientHeader } from "./components/ClientHeader";
import { ClientInfoPanel } from "./components/ClientInfoPanel";
import { DocumentsPanel } from "./components/DocumentsPanel";
import { FilePreviewPanel } from "./components/FilePreviewPanel";
import { ClientSkeleton } from "./components/ClientSkeleton";
import { ClientNotFound } from "./components/ClientNotFound";
import { useClientData } from "./hooks/useClientData";
import { ClientViewerProps } from "./types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const ClientViewer = ({ clientId, onBack, onDocumentOpen, onError }: ClientViewerProps) => {
  const navigate = useNavigate();
  const { client, documents, isLoading, activeTab, setActiveTab, error } = useClientData(clientId, onBack);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  useEffect(() => {
    if (documents.length > 0 && !selectedDocumentId) {
      setSelectedDocumentId(documents[0].id);
      toast.info(`${documents.length} documents loaded for ${client?.name || 'client'}`);
    }
  }, [documents, selectedDocumentId, client]);

  const selectedDocument = selectedDocumentId 
    ? documents.find(doc => doc.id === selectedDocumentId)
    : null;

  if (error && onError) {
    console.error("Client data error:", error);
    onError();
  }

  if (isLoading) {
    return <ClientSkeleton onBack={onBack} />;
  }

  if (!client) {
    return <ClientNotFound onBack={onBack} />;
  }

  const handleDocumentSelect = (documentId: string) => {
    console.log("Selected document ID:", documentId);
    setSelectedDocumentId(documentId);
  };

  const handleDocumentOpen = (documentId: string) => {
    console.log("Opening document from ClientViewer:", documentId);
    
    if (!documentId) {
      console.error("Invalid document ID");
      toast.error("Cannot open document: Invalid ID");
      return;
    }

    const docToOpen = documents.find(doc => doc.id === documentId);
    if (docToOpen?.title?.toLowerCase().includes('form 47') || 
        docToOpen?.title?.toLowerCase().includes('consumer proposal')) {
      console.log("Opening Form 47 document");
    }
    
    if (onDocumentOpen) {
      onDocumentOpen(documentId);
    } else {
      navigate('/', { 
        state: { 
          selectedDocument: documentId,
          source: 'client-viewer',
          isForm47: docToOpen?.title?.toLowerCase().includes('form 47')
        } 
      });
    }
  };

  const lastActivityDate = documents.length > 0 
    ? new Date(Math.max(...documents.map(d => new Date(d.updated_at).getTime()))).toISOString()
    : undefined;

  return (
    <Card className="h-full">
      <CardHeader className="border-b pb-3 px-0 pt-0">
        <ClientHeader 
          onBack={onBack} 
          clientName={client.name}
        />
      </CardHeader>
      <CardContent className="p-0">
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-12rem)]">
          <ResizablePanel defaultSize={20} minSize={15}>
            <ClientInfoPanel 
              client={client} 
              documentCount={documents.length}
              lastActivityDate={lastActivityDate}
              documents={documents}
              onDocumentSelect={handleDocumentSelect}
              selectedDocumentId={selectedDocumentId}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50}>
            <DocumentsPanel
              documents={documents}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onDocumentOpen={handleDocumentOpen}
              onDocumentSelect={handleDocumentSelect}
              selectedDocumentId={selectedDocumentId}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={30} minSize={20}>
            <FilePreviewPanel 
              document={selectedDocument} 
              onDocumentOpen={handleDocumentOpen}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};
