
import { useEffect } from "react";
import { ClientList } from "@/components/documents/ClientList";
import { DocumentTree } from "@/components/documents/DocumentTree";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { toast } from "sonner";

// Hardcoded demo data for Josh Hart
const DEMO_CLIENTS = [
  {
    id: "josh-hart",
    name: "Josh Hart",
    status: "active" as const,
    location: "Ontario",
    lastActivity: "2024-06-01",
    needsAttention: false // Changed to false to remove orange icon
  },
  {
    id: "client-2",
    name: "Jane Smith",
    status: "active" as const,
    location: "British Columbia",
    lastActivity: "2024-05-28",
    needsAttention: false
  },
  {
    id: "client-3",
    name: "Robert Johnson",
    status: "pending" as const,
    location: "Alberta",
    lastActivity: "2024-05-25",
    needsAttention: false
  },
  {
    id: "client-4",
    name: "Maria Garcia",
    status: "flagged" as const,
    location: "Quebec",
    lastActivity: "2024-05-20",
    needsAttention: false // Changed to false to remove orange icon
  }
];

// Josh Hart's document tree structure
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

const DocumentsPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Show a toast when the page loads
    toast.success("Documents loaded", {
      description: "Document tree is now visible"
    });
  }, []);
  
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
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel: Client List */}
          <div className="w-80 flex-shrink-0 border-r bg-card/50">
            <ClientList 
              clients={DEMO_CLIENTS} 
            />
          </div>
          
          {/* Right Panel: Document Tree */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Document Tree</h2>
              <p className="text-sm text-muted-foreground">
                System-wide view of all document activity. Click a client on the left to view their dedicated page.
              </p>
            </div>
            
            <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
              <DocumentTree 
                rootNodes={JOSH_HART_DOCUMENTS}
                onNodeSelect={handleNodeSelect}
                onFileOpen={handleFileOpen}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
