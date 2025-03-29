
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { DocumentTree } from "@/components/documents/DocumentTree";

// Reuse the same document structure from DocumentsPage
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

interface Client {
  id: string;
  name: string;
  status: string;
  location: string;
}

const ClientViewerPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  
  useEffect(() => {
    // Simulate loading client data
    setIsLoading(true);
    
    // For this demo, we're just checking if the clientId is "josh-hart"
    setTimeout(() => {
      if (clientId === "josh-hart") {
        setClient({
          id: "josh-hart",
          name: "Josh Hart",
          status: "active",
          location: "Ontario"
        });
        
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
  
  const handleNodeSelect = (node: any) => {
    console.log("Selected node:", node);
  };
  
  const handleFileOpen = (node: any) => {
    console.log("Opening file:", node);
    
    // For demonstration, let's only handle the Form47 file
    if (node.id === "form47-file") {
      // Navigate to the document viewer with the form47 document ID
      navigate("/document-viewer/form47");
    }
  };
  
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
        <div>
          <div className="border rounded-lg bg-card p-4 mb-4">
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground mr-2">Location: {client.location}</span>
              <span className="text-sm text-muted-foreground">Status: {client.status}</span>
            </div>
          </div>
          
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <DocumentTree 
              rootNodes={JOSH_HART_DOCUMENTS}
              onNodeSelect={handleNodeSelect}
              onFileOpen={handleFileOpen}
            />
          </div>
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
