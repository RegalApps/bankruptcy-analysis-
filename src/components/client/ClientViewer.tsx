
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";
import { ClientHeader } from "./components/ClientHeader";
import { ClientInfoPanel } from "./components/ClientInfoPanel";
import { DocumentsPanel } from "./components/DocumentsPanel";
import { ClientSkeleton } from "./components/ClientSkeleton";
import { ClientNotFound } from "./components/ClientNotFound";
import { useClientData } from "./hooks/useClientData";
import { ClientViewerProps } from "./types";

export const ClientViewer = ({ clientId, onBack, onDocumentOpen }: ClientViewerProps) => {
  const { client, documents, isLoading, activeTab, setActiveTab } = useClientData(clientId, onBack);

  // If still loading, show skeleton
  if (isLoading) {
    return <ClientSkeleton onBack={onBack} />;
  }

  // If client not found
  if (!client) {
    return <ClientNotFound onBack={onBack} />;
  }

  // Get last activity date
  const lastActivityDate = documents.length > 0 ? documents[0].updated_at : undefined;

  return (
    <Card className="h-full">
      <CardHeader className="border-b pb-3 px-0 pt-0">
        <ClientHeader onBack={onBack} />
      </CardHeader>
      <CardContent className="p-0">
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-12rem)]">
          {/* Left panel - Client info */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <ClientInfoPanel 
              client={client} 
              documentCount={documents.length}
              lastActivityDate={lastActivityDate}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right panel - Documents */}
          <ResizablePanel defaultSize={75}>
            <DocumentsPanel
              documents={documents}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onDocumentOpen={onDocumentOpen}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};
