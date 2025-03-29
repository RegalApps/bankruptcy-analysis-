
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { ClientInfoPanel } from "../ClientInfoPanel";
import { DocumentsPanel } from "../DocumentsPanel";
import { FilePreviewPanel } from "../FilePreview/FilePreviewPanel";
import { Client, Document, Task } from "../../types";

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

  // Mock tasks for the client
  const mockTasks: Task[] = [
    {
      id: "task-1",
      title: "Review client files",
      dueDate: new Date().toISOString(),
      status: 'pending',
      priority: 'medium'
    },
    {
      id: "task-2",
      title: "Prepare for client meeting",
      dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), 
      status: 'pending',
      priority: 'high'
    }
  ];

  // Update document selection handler to also switch to preview tab
  const handleDocumentSelect = (documentId: string) => {
    onDocumentSelect(documentId);
    setMobileTab("preview");
  };

  return (
    <Tabs value={mobileTab} onValueChange={setMobileTab} className="w-full h-full flex flex-col">
      <TabsList className="grid grid-cols-3 w-full rounded-none px-2 pt-2">
        <TabsTrigger value="info">
          {isSmallScreen ? "Info" : "Client Info"}
        </TabsTrigger>
        <TabsTrigger value="documents">
          {isSmallScreen ? "Docs" : "Documents"}
        </TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <div className="flex-1 overflow-hidden">
        <TabsContent value="info" className="m-0 p-4 h-full overflow-auto">
          <ClientInfoPanel 
            client={client} 
            tasks={mockTasks}
            documentCount={documents.length}
            lastActivityDate={lastActivityDate}
            documents={documents}
            onDocumentSelect={handleDocumentSelect}
            selectedDocumentId={selectedDocumentId}
            onClientUpdate={(updatedClient) => console.log("Client updated:", updatedClient)}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="m-0 p-0 h-full overflow-auto">
          <DocumentsPanel
            documents={documents}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onDocumentOpen={onDocumentOpen}
            onDocumentSelect={handleDocumentSelect}
            selectedDocumentId={selectedDocumentId}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="m-0 p-0 h-full overflow-auto">
          <FilePreviewPanel 
            document={selectedDocument} 
            onDocumentOpen={onDocumentOpen}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};
