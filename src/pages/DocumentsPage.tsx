
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ClientList } from "@/components/documents/ClientList";
import { DocumentTree } from "@/components/documents/DocumentTree";
import { DocumentList } from "@/components/documents/DocumentList";
import { toast } from "sonner";

// Mock data for clients
const CLIENTS_DATA = [
  {
    id: "josh-hart",
    name: "Josh Hart",
    status: "active" as const,
    location: "Toronto, ON",
    lastActivity: "2 hours ago",
    needsAttention: true
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    status: "active" as const,
    location: "Vancouver, BC",
    lastActivity: "1 day ago",
    needsAttention: false
  },
  {
    id: "robert-johnson",
    name: "Robert Johnson",
    status: "pending" as const,
    location: "Montreal, QC",
    lastActivity: "3 days ago",
    needsAttention: true
  },
  {
    id: "maria-garcia",
    name: "Maria Garcia",
    status: "inactive" as const,
    location: "Calgary, AB",
    lastActivity: "2 weeks ago",
    needsAttention: false
  }
];

// Mock document tree data
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

const JANE_SMITH_DOCUMENTS = [
  {
    id: "jane-smith-root",
    name: "Jane Smith",
    type: "folder" as const,
    folderType: "client" as const,
    status: "active" as const,
    children: [
      {
        id: "financial-folder-jane",
        name: "Financial Documents",
        type: "folder" as const,
        folderType: "financial" as const,
        children: [
          {
            id: "tax-return-2024",
            name: "Tax Return 2024.pdf",
            type: "file" as const,
            status: "complete" as const,
            filePath: "/documents/jane-tax-return.pdf"
          },
          {
            id: "income-statement",
            name: "Income Statement.xlsx",
            type: "file" as const,
            status: "complete" as const,
            filePath: "/documents/jane-income.xlsx"
          }
        ]
      },
      {
        id: "legal-folder-jane",
        name: "Legal Documents",
        type: "folder" as const,
        folderType: "legal" as const,
        children: [
          {
            id: "contract-file",
            name: "Service Contract.pdf",
            type: "file" as const,
            status: "needs-signature" as const,
            filePath: "/documents/jane-contract.pdf"
          }
        ]
      }
    ]
  }
];

const ROBERT_JOHNSON_DOCUMENTS = [
  {
    id: "robert-johnson-root",
    name: "Robert Johnson",
    type: "folder" as const,
    folderType: "client" as const,
    status: "pending-review" as const,
    children: [
      {
        id: "application-folder-robert",
        name: "Application Documents",
        type: "folder" as const,
        folderType: "application" as const,
        children: [
          {
            id: "application-form",
            name: "Application Form.pdf",
            type: "file" as const,
            status: "pending-review" as const,
            filePath: "/documents/robert-application.pdf"
          },
          {
            id: "credit-report",
            name: "Credit Report.pdf",
            type: "file" as const,
            status: "complete" as const,
            filePath: "/documents/robert-credit.pdf"
          }
        ]
      }
    ]
  }
];

const MARIA_GARCIA_DOCUMENTS = [
  {
    id: "maria-garcia-root",
    name: "Maria Garcia",
    type: "folder" as const,
    folderType: "client" as const,
    status: "inactive" as const,
    children: [
      {
        id: "case-folder-maria",
        name: "Case #2023-568",
        type: "folder" as const,
        folderType: "case" as const,
        children: [
          {
            id: "final-report",
            name: "Final Report.pdf",
            type: "file" as const,
            status: "complete" as const,
            filePath: "/documents/maria-report.pdf"
          },
          {
            id: "closing-documents",
            name: "Closing Documents.pdf",
            type: "file" as const,
            status: "complete" as const,
            filePath: "/documents/maria-closing.pdf"
          }
        ]
      }
    ]
  }
];

const DocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);
  
  useEffect(() => {
    // Load documents based on selected client
    if (selectedClientId === "josh-hart") {
      setSelectedDocuments(JOSH_HART_DOCUMENTS);
    } else if (selectedClientId === "jane-smith") {
      setSelectedDocuments(JANE_SMITH_DOCUMENTS);
    } else if (selectedClientId === "robert-johnson") {
      setSelectedDocuments(ROBERT_JOHNSON_DOCUMENTS);
    } else if (selectedClientId === "maria-garcia") {
      setSelectedDocuments(MARIA_GARCIA_DOCUMENTS);
    } else {
      setSelectedDocuments([]);
    }
  }, [selectedClientId]);
  
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    toast.success(`Loaded documents for ${clientId}`);
  };
  
  const handleCreateDocument = () => {
    toast.success("Create document clicked");
  };
  
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Button onClick={handleCreateDocument}>
          <Plus className="mr-2 h-4 w-4" /> Create Document
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-14rem)] rounded-lg border">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-full p-4 bg-card">
            <h2 className="text-lg font-semibold mb-4">Clients</h2>
            <ClientList 
              clients={CLIENTS_DATA}
              selectedClientId={selectedClientId}
              onSelectClient={handleClientSelect}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={30}>
          <div className="h-full p-4 bg-card">
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            {selectedClientId ? (
              <DocumentTree 
                documents={selectedDocuments} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] text-center p-4">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Client Selected</h3>
                <p className="text-sm text-muted-foreground mt-1">Select a client to view their documents</p>
              </div>
            )}
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50}>
          <div className="h-full p-4 bg-card">
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            {selectedClientId ? (
              <DocumentList />
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] text-center p-4">
                <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Documents to Display</h3>
                <p className="text-sm text-muted-foreground mt-1">Select a client and folder to view documents</p>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </MainLayout>
  );
};

export default DocumentsPage;
