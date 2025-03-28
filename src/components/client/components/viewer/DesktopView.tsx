
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ClientSummaryPanel } from "../ClientSummaryPanel";
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
    <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-12rem)]">
      {/* Left Panel: Client & Task Summary */}
      <ResizablePanel defaultSize={25} minSize={20}>
        <ClientSummaryPanel 
          client={client} 
          documentCount={documents.length}
          lastActivityDate={lastActivityDate}
          documents={documents}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* Center Panel: Document Files */}
      <ResizablePanel defaultSize={40}>
        <DocumentsPanel
          documents={documents}
          activeTab="all"
          setActiveTab={setActiveTab}
          onDocumentOpen={onDocumentOpen}
          onDocumentSelect={onDocumentSelect}
          selectedDocumentId={selectedDocumentId}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* Right Panel: Document Viewer, History, and Comments */}
      <ResizablePanel defaultSize={35} minSize={25}>
        <FilePreviewPanel 
          document={selectedDocument} 
          onDocumentOpen={onDocumentOpen}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
