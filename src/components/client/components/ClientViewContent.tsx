
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ClientInfoPanel } from "@/components/client/components/ClientInfo";
import { ClientDocumentsPanel } from "@/components/client/components/ClientDocumentsPanel";
import { DocumentPreviewPanel } from "@/components/client/components/DocumentPreviewPanel";
import { Client, Document, Task } from "@/components/client/types";

interface ClientViewContentProps {
  client: Client;
  documents: any[];
  selectedDocumentId: string | null;
  onDocumentSelect: (documentId: string) => void;
  tasks: Task[];
  recentActivities: { id: string; action: string; user: string; timestamp: string; }[];
  onClientUpdate: (updatedClient: Client) => void;
}

export const ClientViewContent = ({
  client,
  documents,
  selectedDocumentId,
  onDocumentSelect,
  tasks,
  recentActivities,
  onClientUpdate
}: ClientViewContentProps) => {
  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);

  return (
    <div className="h-[calc(100vh-12rem)]">
      <ResizablePanelGroup direction="horizontal" className="border rounded-lg bg-card">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <ClientInfoPanel 
            client={client}
            tasks={tasks}
            documentCount={documents.length}
            lastActivityDate={client.last_interaction}
            documents={documents as unknown as Document[]}
            onDocumentSelect={onDocumentSelect}
            selectedDocumentId={selectedDocumentId}
            onClientUpdate={onClientUpdate}
          />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={40}>
          <ClientDocumentsPanel 
            documents={documents}
            onDocumentSelect={onDocumentSelect}
            selectedDocumentId={selectedDocumentId}
          />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={35} minSize={25}>
          <DocumentPreviewPanel 
            document={selectedDocument}
            recentActivities={recentActivities}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
