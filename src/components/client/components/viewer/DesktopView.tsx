
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ClientInfoPanel } from "../ClientInfoPanel";
import { DocumentsPanel } from "../DocumentsPanel";
import { FilePreviewPanel } from "../FilePreview/FilePreviewPanel";
import { Client, Document } from "../../types";

interface DesktopViewProps {
  client: Client;
  documents: Document[];
  selectedDocument: Document | null;
  selectedDocumentId: string | null;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onDocumentOpen: (documentId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  lastActivityDate?: string;
}

export const DesktopView = ({
  client,
  documents,
  selectedDocument,
  selectedDocumentId,
  activeTab,
  setActiveTab,
  onDocumentOpen,
  onDocumentSelect,
  lastActivityDate,
}: DesktopViewProps) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-12rem)] rounded-lg border">
      <ResizablePanel defaultSize={20} minSize={15} className="bg-muted/30">
        <ClientInfoPanel 
          client={client} 
          documentCount={documents.length}
          lastActivityDate={lastActivityDate}
          documents={documents}
          onDocumentSelect={onDocumentSelect}
          selectedDocumentId={selectedDocumentId}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={50}>
        <DocumentsPanel
          documents={documents}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDocumentOpen={onDocumentOpen}
          onDocumentSelect={onDocumentSelect}
          selectedDocumentId={selectedDocumentId}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={30} minSize={20}>
        <FilePreviewPanel 
          document={selectedDocument} 
          onDocumentOpen={onDocumentOpen}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
