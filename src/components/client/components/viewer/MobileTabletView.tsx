
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { ClientInfoPanel } from "../ClientInfoPanel";
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
  const [mobileTab, setMobileTab] = useState<string>("info");
  const isSmallScreen = isMobile;

  return (
    <Tabs value={mobileTab} onValueChange={setMobileTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full rounded-none px-2 pt-2">
        <TabsTrigger value="info">
          {isSmallScreen ? "Info" : "Client Info"}
        </TabsTrigger>
        <TabsTrigger value="documents">
          {isSmallScreen ? "Docs" : "Documents"}
        </TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="m-0 p-4 h-[calc(100vh-10rem)]">
        <ClientInfoPanel 
          client={client} 
          documentCount={documents.length}
          lastActivityDate={lastActivityDate}
          documents={documents}
          onDocumentSelect={onDocumentSelect}
          selectedDocumentId={selectedDocumentId}
        />
      </TabsContent>
      
      <TabsContent value="documents" className="m-0 p-0 h-[calc(100vh-10rem)]">
        <DocumentsPanel
          documents={documents}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDocumentOpen={onDocumentOpen}
          onDocumentSelect={onDocumentSelect}
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
