
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { ClientSummaryPanel } from "../ClientSummaryPanel";
import { DocumentsPanel } from "../DocumentsPanel";
import { FilePreviewPanel } from "../FilePreview/FilePreviewPanel";
import { Client, Document } from "../../types";

interface MobileTabletViewProps {
  client: Client;
  documents: Document[];
  selectedDocument: Document | null;
  selectedDocumentId: string | null;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onDocumentOpen: (documentId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  lastActivityDate?: string;
  isMobile: boolean;
}

export const MobileTabletView = ({
  client,
  documents,
  selectedDocument,
  selectedDocumentId,
  activeTab,
  setActiveTab,
  onDocumentOpen,
  onDocumentSelect,
  lastActivityDate,
  isMobile
}: MobileTabletViewProps) => {
  const [mobileTab, setMobileTab] = useState<string>("summary");

  // Update document selection handler to also switch to preview tab
  const handleDocumentSelect = (documentId: string) => {
    onDocumentSelect(documentId);
    setMobileTab("preview");
  };

  return (
    <Tabs value={mobileTab} onValueChange={setMobileTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full rounded-none px-2 pt-2">
        <TabsTrigger value="summary">
          {isMobile ? "Summary" : "Client Summary"}
        </TabsTrigger>
        <TabsTrigger value="documents">
          {isMobile ? "Docs" : "Documents"}
        </TabsTrigger>
        <TabsTrigger value="preview">
          {isMobile ? "Preview" : "Document View"}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="m-0 p-0 h-[calc(100vh-10rem)]">
        <ClientSummaryPanel 
          client={client} 
          documentCount={documents.length}
          lastActivityDate={lastActivityDate}
          documents={documents}
        />
      </TabsContent>
      
      <TabsContent value="documents" className="m-0 p-0 h-[calc(100vh-10rem)]">
        <DocumentsPanel
          documents={documents}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDocumentOpen={onDocumentOpen}
          onDocumentSelect={handleDocumentSelect}
          selectedDocumentId={selectedDocumentId}
        />
      </TabsContent>
      
      <TabsContent value="preview" className="m-0 p-0 h-[calc(100vh-10rem)]">
        <FilePreviewPanel 
          document={selectedDocument} 
          onDocumentOpen={onDocumentOpen}
        />
      </TabsContent>
    </Tabs>
  );
};
