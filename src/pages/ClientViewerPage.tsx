import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ClientInfoPanel } from "@/components/client/components/ClientInfoPanel";
import { ClientDocumentsPanel } from "@/components/client/components/ClientDocumentsPanel";
import { DocumentPreviewPanel } from "@/components/client/components/DocumentPreviewPanel";
import { formatDate } from "@/utils/formatDate";
import { Client, Document, Task } from "@/components/client/types";

const JOSH_HART_DOCUMENTS = [
  {
    id: "josh-hart-root",
    name: "Josh Hart",
    type: "folder" as const,
    folderType: "client" as const,
    status: "needs-review" as const,
    children: [
      {
        id: "estate-folder",
        name: "Estate 2025-47",
        type: "folder" as const,
        folderType: "estate" as const,
        children: [
          {
            id: "form47-folder",
            name: "Form 47 - Consumer Proposal",
            type: "folder" as const,
            folderType: "form" as const,
            children: [
              {
                id: "form47-file",
                name: "Form47_Draft1.pdf",
                type: "file" as const,
                status: "needs-review" as const,
                filePath: "/documents/form47.pdf"
              }
            ]
          },
          {
            id: "financials-folder",
            name: "Financials",
            type: "folder" as const,
            folderType: "financials" as const,
            children: [
              {
                id: "budget-file",
                name: "Budget_2025.xlsx",
                type: "file" as const,
                status: "needs-review" as const,
                filePath: "/documents/budget.xlsx"
              }
            ]
          }
        ]
      }
    ]
  }
];

interface ClientDocument {
  id: string;
  title: string;
  type: string;
  status: 'complete' | 'pending-review' | 'needs-signature' | 'draft';
  category: string;
  dateModified: string;
  fileType: string;
  fileSize: string;
}

const ClientViewerPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<{ id: string; action: string; user: string; timestamp: string; }[]>([]);
  
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (clientId === "josh-hart") {
        setClient({
          id: "josh-hart",
          name: "Josh Hart",
          status: "active",
          location: "Ontario",
          email: "josh.hart@example.com",
          phone: "(555) 123-4567",
          address: "123 Maple Street",
          city: "Toronto",
          province: "Ontario",
          postalCode: "M5V 2L7",
          company: "ABC Corporation",
          occupation: "Software Developer",
          mobilePhone: "(555) 987-6543",
          notes: "Josh is a priority client who needs regular updates on his case.",
          metrics: {
            openTasks: 3,
            pendingDocuments: 2,
            urgentDeadlines: 1
          },
          last_interaction: new Date().toISOString(),
          engagement_score: 92
        });

        setDocuments([
          {
            id: "form47-file",
            title: "Form 47 - Consumer Proposal",
            type: "Legal",
            status: "pending-review",
            category: "Forms",
            dateModified: new Date().toISOString(),
            fileType: "PDF",
            fileSize: "2.4 MB"
          },
          {
            id: "budget-file",
            title: "Budget 2025",
            type: "Financial",
            status: "draft",
            category: "Financial",
            dateModified: new Date(Date.now() - 86400000 * 2).toISOString(),
            fileType: "XLSX",
            fileSize: "1.8 MB"
          },
          {
            id: "id-scan",
            title: "ID Scan",
            type: "Personal",
            status: "complete",
            category: "Identification",
            dateModified: new Date(Date.now() - 86400000 * 5).toISOString(),
            fileType: "JPG",
            fileSize: "3.1 MB"
          }
        ]);

        setRecentActivities([
          {
            id: "activity-1",
            action: "Form 47 uploaded",
            user: "Jane Smith",
            timestamp: new Date().toISOString(),
          },
          {
            id: "activity-2",
            action: "Client information updated",
            user: "John Doe",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "activity-3",
            action: "New task assigned",
            user: "Alice Johnson",
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          }
        ]);
        
        setSelectedDocumentId("form47-file");
        
        toast.success("Client data loaded");
      } else {
        toast.error("Client not found");
        navigate("/documents");
      }
      
      setIsLoading(false);
    }, 500);
  }, [clientId, navigate]);
  
  const handleBack = () => {
    navigate("/documents");
  };
  
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);

  const clientTasks: Task[] = [
    {
      id: "task-1",
      title: "Review Form 47 submission",
      dueDate: new Date().toISOString(),
      status: 'pending',
      priority: 'high'
    },
    {
      id: "task-2",
      title: "Collect additional financial documents",
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      status: 'pending',
      priority: 'medium'
    },
    {
      id: "task-3",
      title: "Schedule follow-up meeting",
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      status: 'pending',
      priority: 'low'
    }
  ];
  
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
        
        {!isLoading && client && (
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">Last edited: Today at 10:45 AM</span>
            <Button size="sm">New Document</Button>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : client ? (
        <div className="h-[calc(100vh-12rem)]">
          <ResizablePanelGroup direction="horizontal" className="border rounded-lg bg-card">
            <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
              <ClientInfoPanel 
                client={client}
                tasks={clientTasks}
                documentCount={documents.length}
                lastActivityDate={client.last_interaction}
                documents={documents as unknown as Document[]}
                onDocumentSelect={handleDocumentSelect}
                selectedDocumentId={selectedDocumentId}
                onClientUpdate={(updatedClient) => setClient(updatedClient)}
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
      ) : (
        <div className="border rounded-lg bg-card p-4 text-center">
          <h2 className="text-lg font-semibold mb-2">Client Not Found</h2>
          <p className="text-muted-foreground mb-4">The client you're looking for doesn't exist or you don't have access.</p>
          <Button onClick={handleBack}>Return to Documents</Button>
        </div>
      )}
    </MainLayout>
  );
};

export default ClientViewerPage;
