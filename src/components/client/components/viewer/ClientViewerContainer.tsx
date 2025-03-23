
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClientHeader } from "../ClientHeader";
import { ClientSkeleton } from "../ClientSkeleton";
import { ClientNotFound } from "../ClientNotFound";
import { useClientData } from "../../hooks/useClientData";
import { ClientViewerProps } from "../../types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";
import { MobileTabletView } from "./MobileTabletView";
import { DesktopView } from "./DesktopView";

export const ClientViewerContainer = ({ clientId, onBack, onDocumentOpen, onError }: ClientViewerProps) => {
  const { client, documents, isLoading, activeTab, setActiveTab, error } = useClientData(clientId, onBack);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [openingDocument, setOpeningDocument] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

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

  const selectedDocument = selectedDocumentId 
    ? documents.find(doc => doc.id === selectedDocumentId)
    : null;

  const handleDocumentSelect = (documentId: string) => {
    console.log("Selected document ID:", documentId);
    setSelectedDocumentId(documentId);
    if (isMobile) setMobileTab("preview");
  };

  const handleDocumentOpen = (documentId: string) => {
    if (openingDocument || !documentId) {
      console.log("Document open already in progress or invalid ID, ignoring request");
      if (!documentId) toast.error("Cannot open document: Invalid ID");
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
      
      const isForm47 = docToOpen?.title?.toLowerCase().includes('form 47') || 
                      docToOpen?.title?.toLowerCase().includes('consumer proposal');
      
      if (onDocumentOpen) {
        onDocumentOpen(documentId);
      }
      
      toast.success(`Opening ${docToOpen.title}`);
    } catch (error) {
      console.error("Error opening document:", error);
      toast.error("Error opening document. Please try again.");
    } finally {
      setTimeout(() => setOpeningDocument(false), 1000);
    }
  };

  const lastActivityDate = documents.length > 0 
    ? new Date(Math.max(...documents.map(d => new Date(d.updated_at).getTime()))).toISOString()
    : undefined;

  // Combined mobile and tablet view with tabs
  if (isMobile || isTablet) {
    return (
      <Card className="h-full">
        <CardHeader className="border-b pb-3 px-0 pt-0">
          <ClientHeader onBack={onBack} clientName={client.name} />
        </CardHeader>
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
    );
  }

  // Desktop view with resizable panels
  return (
    <Card className="h-full">
      <CardHeader className="border-b pb-3 px-0 pt-0">
        <ClientHeader onBack={onBack} clientName={client.name} />
      </CardHeader>
      <CardContent className="p-0">
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
      </CardContent>
    </Card>
  );
};
