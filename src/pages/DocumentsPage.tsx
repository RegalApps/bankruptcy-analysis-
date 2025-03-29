
import { useEffect, useState } from "react";
import { ClientList } from "@/components/documents/ClientList";
import { DocumentTree } from "@/components/documents/DocumentTree";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { toast } from "sonner";

// Hardcoded demo data for clients
const DEMO_CLIENTS = [
  {
    id: "josh-hart",
    name: "Josh Hart",
    status: "active" as const,
    location: "Ontario",
    lastActivity: "2024-06-01",
    needsAttention: true
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    status: "active" as const,
    location: "British Columbia",
    lastActivity: "2024-05-28",
    needsAttention: false
  },
  {
    id: "robert-johnson",
    name: "Robert Johnson",
    status: "pending" as const,
    location: "Alberta",
    lastActivity: "2024-05-25",
    needsAttention: false
  },
  {
    id: "maria-garcia",
    name: "Maria Garcia",
    status: "flagged" as const,
    location: "Quebec",
    lastActivity: "2024-05-20",
    needsAttention: true
  }
];

// Document tree structure for all clients
const CLIENT_DOCUMENTS = [
  // Josh Hart's documents
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
  },
  // Jane Smith's documents
  {
    id: "jane-smith-root",
    name: "Jane Smith",
    type: "folder" as const,
    folderType: "client" as const,
    status: "active" as const,
    children: [
      {
        id: "tax-folder",
        name: "Tax Documents",
        type: "folder" as const,
        folderType: "financial" as const,
        children: [
          {
            id: "tax-return-file",
            name: "TaxReturn2023.pdf",
            type: "file" as const,
            status: "complete" as const,
            filePath: "/documents/taxreturn.pdf"
          }
        ]
      },
      {
        id: "employment-folder",
        name: "Employment",
        type: "folder" as const,
        folderType: "documentation" as const,
        children: [
          {
            id: "employment-verification",
            name: "EmploymentVerification.pdf",
            type: "file" as const,
            status: "complete" as const,
            filePath: "/documents/employment.pdf"
          }
        ]
      }
    ]
  },
  // Robert Johnson's documents
  {
    id: "robert-johnson-root",
    name: "Robert Johnson",
    type: "folder" as const,
    folderType: "client" as const,
    status: "pending" as const,
    children: [
      {
        id: "form32-folder",
        name: "Form 32 - Debt Restructuring",
        type: "folder" as const,
        folderType: "form" as const,
        children: [
          {
            id: "form32-file",
            name: "Form32_Draft2.pdf",
            type: "file" as const,
            status: "needs-review" as const,
            filePath: "/documents/form32.pdf"
          }
        ]
      },
      {
        id: "bank-statement-folder",
        name: "Bank Statements",
        type: "folder" as const,
        folderType: "financial" as const,
        children: [
          {
            id: "q1-statements",
            name: "Q1_2024_Statements.pdf",
            type: "file" as const,
            status: "complete" as const,
            filePath: "/documents/q1statements.pdf"
          }
        ]
      },
      {
        id: "credit-report",
        name: "CreditReport.pdf",
        type: "file" as const,
        status: "complete" as const,
        filePath: "/documents/creditreport.pdf"
      }
    ]
  },
  // Maria Garcia's documents
  {
    id: "maria-garcia-root",
    name: "Maria Garcia",
    type: "folder" as const,
    folderType: "client" as const,
    status: "flagged" as const,
    children: [
      {
        id: "proposal-folder",
        name: "Consumer Proposal",
        type: "folder" as const,
        folderType: "proposal" as const,
        children: [
          {
            id: "form43-file",
            name: "Form43_ConsumerProposal.pdf",
            type: "file" as const,
            status: "needs-signature" as const,
            filePath: "/documents/form43.pdf"
          },
          {
            id: "creditor-list",
            name: "CreditorList.xlsx",
            type: "file" as const,
            status: "needs-review" as const,
            filePath: "/documents/creditors.xlsx"
          }
        ]
      },
      {
        id: "income-statement",
        name: "IncomeExpenseStatement.pdf",
        type: "file" as const,
        status: "needs-review" as const,
        filePath: "/documents/incomestatement.pdf"
      }
    ]
  }
];

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  useEffect(() => {
    // Show a toast when the page loads
    toast.success("Documents loaded", {
      description: "Document tree is now visible"
    });
  }, []);
  
  const handleNodeSelect = (node: any) => {
    console.log("Selected node:", node);
  };
  
  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    console.log("Selected client:", clientId);
  };
  
  const handleFileOpen = (node: any) => {
    console.log("Opening file:", node);
    
    // Navigate to the client viewer with the appropriate client ID
    if (node.id) {
      const clientId = node.id.split("-")[0];
      if (clientId) {
        navigate(`/client/${clientId}`);
      }
    }
  };
  
  // Filter documents based on selected client
  const filteredDocuments = selectedClient 
    ? CLIENT_DOCUMENTS.filter(doc => doc.id.startsWith(selectedClient))
    : CLIENT_DOCUMENTS;
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel: Client List */}
          <div className="w-72 flex-shrink-0">
            <ClientList 
              clients={DEMO_CLIENTS}
              onClientSelect={handleClientSelect}
              selectedClientId={selectedClient}
            />
          </div>
          
          {/* Right Panel: Document Tree */}
          <div className="flex-1 border-l p-4">
            <h2 className="text-xl font-semibold mb-4">
              {selectedClient 
                ? `${DEMO_CLIENTS.find(c => c.id === selectedClient)?.name}'s Documents` 
                : "All Documents"}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedClient 
                ? "Client-specific documents and folders" 
                : "System-wide view of all document activity. Click a client on the left to view their dedicated page."}
            </p>
            
            <div className="border rounded-lg shadow-sm overflow-hidden">
              <DocumentTree 
                rootNodes={filteredDocuments}
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
