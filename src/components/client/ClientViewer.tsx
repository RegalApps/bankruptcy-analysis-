
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const ClientViewer = ({ clientId, onBack, onDocumentOpen, onError }: ClientViewerProps) => {
  const navigate = useNavigate();
  const { client, documents, isLoading, activeTab, setActiveTab, error } = useClientData(clientId, onBack);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [openingDocument, setOpeningDocument] = useState(false);
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState<string>("info");
  
  useEffect(() => {
    if (documents.length > 0 && !selectedDocumentId) {
      // Prioritize Form 47 document if available
      const form47Doc = documents.find(doc => 
        doc.title?.toLowerCase().includes('form 47') || 
        doc.title?.toLowerCase().includes('consumer proposal')
      );
      
      if (form47Doc) {
        console.log("Found Form 47 document, selecting automatically:", form47Doc.id);
        setSelectedDocumentId(form47Doc.id);
      } else {
        setSelectedDocumentId(documents[0].id);
      }
      
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
    if (isMobile) setMobileTab("preview");
  };

  const handleDocumentOpen = (documentId: string) => {
    console.log("Opening document from ClientViewer:", documentId);
    
    if (openingDocument) {
      console.log("Document open already in progress, ignoring request");
      return;
    }
    
    if (!documentId) {
      console.error("Invalid document ID");
      toast.error("Cannot open document: Invalid ID");
      return;
    }

    setOpeningDocument(true);
    
    try {
      const docToOpen = documents.find(doc => doc.id === documentId);
      
      if (!docToOpen) {
        console.error("Document not found in list:", documentId);
        toast.error("Document not found");
        return;
      }
      
      // For Form 47 documents, add specific handling
      const isForm47 = docToOpen?.title?.toLowerCase().includes('form 47') || 
                      docToOpen?.title?.toLowerCase().includes('consumer proposal');
      
      if (isForm47) {
        console.log("Opening Form 47 document with special handling");
      }
      
      if (onDocumentOpen) {
        onDocumentOpen(documentId);
      } else {
        navigate('/', { 
          state: { 
            selectedDocument: documentId,
            source: 'client-viewer',
            isForm47: isForm47,
            documentTitle: docToOpen?.title
          } 
        });
      }
      
      toast.success(`Opening ${docToOpen.title}`);
    } catch (error) {
      console.error("Error opening document:", error);
      toast.error("Error opening document. Please try again.");
    } finally {
      // Reset the flag after a short delay
      setTimeout(() => {
        setOpeningDocument(false);
      }, 1000);
    }
  };

  const lastActivityDate = documents.length > 0 
    ? new Date(Math.max(...documents.map(d => new Date(d.updated_at).getTime()))).toISOString()
    : undefined;

  // Mobile view with tabs
  if (isMobile) {
    return (
      <Card className="h-full">
        <CardHeader className="border-b pb-3 px-0 pt-0">
          <ClientHeader 
            onBack={onBack} 
            clientName={client.name}
          />
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={mobileTab} onValueChange={setMobileTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full rounded-none px-2 pt-2">
              <TabsTrigger value="info">Client Info</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="m-0 p-4 h-[calc(100vh-10rem)]">
              <ClientInfoPanel 
                client={client} 
                documentCount={documents.length}
                lastActivityDate={lastActivityDate}
                documents={documents}
                onDocumentSelect={handleDocumentSelect}
                selectedDocumentId={selectedDocumentId}
              />
            </TabsContent>
            
            <TabsContent value="documents" className="m-0 p-0 h-[calc(100vh-10rem)]">
              <DocumentsPanel
                documents={documents}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onDocumentOpen={handleDocumentOpen}
                onDocumentSelect={handleDocumentSelect}
                selectedDocumentId={selectedDocumentId}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="m-0 p-0 h-[calc(100vh-10rem)]">
              <FilePreviewPanel 
                document={selectedDocument} 
                onDocumentOpen={handleDocumentOpen}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  // Desktop view with resizable panels
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
