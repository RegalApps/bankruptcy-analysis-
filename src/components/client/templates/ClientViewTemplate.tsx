
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ClientInfoPanel } from "@/components/client/components/ClientInfo";
import { ClientDocumentsPanel } from "@/components/client/components/ClientDocumentsPanel";
import { DocumentPreviewPanel } from "@/components/client/components/DocumentPreviewPanel";
import { Client, Document, Task } from "@/components/client/types";

interface ClientViewTemplateProps {
  client: Client;
  documents: any[];
  tasks: Task[];
  recentActivities: { id: string; action: string; user: string; timestamp: string; }[];
}

export const ClientViewTemplate = ({ 
  client, 
  documents, 
  tasks,
  recentActivities 
}: ClientViewTemplateProps) => {
  const navigate = useNavigate();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(documents[0]?.id || null);
  
  const handleBack = () => {
    navigate("/documents");
  };
  
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);
  
  return (
    <MainLayout>
      <div className="mb-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> 
          Back to Documents
        </Button>
        
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Last edited: Today at 10:45 AM</span>
          <Button size="sm">New Document</Button>
        </div>
      </div>
      
      <div className="h-[calc(100vh-12rem)]">
        <ResizablePanelGroup direction="horizontal" className="border rounded-lg bg-card">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
            <ClientInfoPanel 
              client={client}
              tasks={tasks}
              documentCount={documents.length}
              lastActivityDate={client.last_interaction}
              documents={documents as unknown as Document[]}
              onDocumentSelect={handleDocumentSelect}
              selectedDocumentId={selectedDocumentId}
              onClientUpdate={(updatedClient) => toast.success("Client information updated")}
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={40}>
            <ClientDocumentsPanel 
              documents={documents}
              onDocumentSelect={handleDocumentSelect}
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
    </MainLayout>
  );
};

// Fix the useState import
import { useState } from "react";
