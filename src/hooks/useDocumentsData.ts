
import { useState, useEffect, useMemo } from "react";

// Define types for the data
type DocumentStatus = "needs-review" | "complete" | "needs-signature" | undefined;
type FolderType = 'client' | 'estate' | 'form' | 'financials' | 'default';

interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  folderType?: FolderType;
  status?: DocumentStatus;
  children?: TreeNode[];
  filePath?: string;
}

interface Client {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending" | "flagged";
  location?: string;
  lastActivity?: string;
  needsAttention?: boolean;
}

// Demo data for clients
const DEMO_CLIENTS: Client[] = [
  {
    id: "josh-hart",
    name: "Josh Hart",
    status: "active",
    location: "Ontario",
    lastActivity: "2024-06-01",
    needsAttention: true
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    status: "active",
    location: "British Columbia",
    lastActivity: "2024-05-28",
    needsAttention: false
  },
  {
    id: "robert-johnson",
    name: "Robert Johnson",
    status: "pending",
    location: "Alberta",
    lastActivity: "2024-05-25",
    needsAttention: false
  },
  {
    id: "maria-garcia",
    name: "Maria Garcia",
    status: "flagged",
    location: "Quebec",
    lastActivity: "2024-05-20",
    needsAttention: true
  }
];

// Document tree structure for all clients
const CLIENT_DOCUMENTS: TreeNode[] = [
  // Josh Hart's documents
  {
    id: "josh-hart-root",
    name: "Josh Hart",
    type: "folder",
    folderType: "client",
    status: "needs-review",
    children: [
      {
        id: "estate-folder",
        name: "Estate 2025-47",
        type: "folder",
        folderType: "estate",
        children: [
          {
            id: "form47-folder",
            name: "Form 47 - Consumer Proposal",
            type: "folder",
            folderType: "form",
            children: [
              {
                id: "form47-file",
                name: "Form47_Draft1.pdf",
                type: "file",
                status: "needs-review",
                filePath: "/documents/form47.pdf"
              }
            ]
          },
          {
            id: "financials-folder",
            name: "Financials",
            type: "folder",
            folderType: "financials",
            children: [
              {
                id: "budget-file",
                name: "Budget_2025.xlsx",
                type: "file",
                status: "needs-review",
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
    type: "folder",
    folderType: "client",
    children: [
      {
        id: "tax-folder",
        name: "Tax Documents",
        type: "folder",
        folderType: "financials",
        children: [
          {
            id: "tax-return-file",
            name: "TaxReturn2023.pdf",
            type: "file",
            status: "complete",
            filePath: "/documents/taxreturn.pdf"
          }
        ]
      },
      {
        id: "employment-folder",
        name: "Employment",
        type: "folder",
        folderType: "form",
        children: [
          {
            id: "employment-verification",
            name: "EmploymentVerification.pdf",
            type: "file",
            status: "complete",
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
    type: "folder",
    folderType: "client",
    children: [
      {
        id: "form32-folder",
        name: "Form 32 - Debt Restructuring",
        type: "folder",
        folderType: "form",
        children: [
          {
            id: "form32-file",
            name: "Form32_Draft2.pdf",
            type: "file",
            status: "needs-review",
            filePath: "/documents/form32.pdf"
          }
        ]
      },
      {
        id: "bank-statement-folder",
        name: "Bank Statements",
        type: "folder",
        folderType: "financials",
        children: [
          {
            id: "q1-statements",
            name: "Q1_2024_Statements.pdf",
            type: "file",
            status: "complete",
            filePath: "/documents/q1statements.pdf"
          }
        ]
      },
      {
        id: "credit-report",
        name: "CreditReport.pdf",
        type: "file",
        status: "complete",
        filePath: "/documents/creditreport.pdf"
      }
    ]
  },
  // Maria Garcia's documents
  {
    id: "maria-garcia-root",
    name: "Maria Garcia",
    type: "folder",
    folderType: "client",
    children: [
      {
        id: "proposal-folder",
        name: "Consumer Proposal",
        type: "folder",
        folderType: "form",
        children: [
          {
            id: "form43-file",
            name: "Form43_ConsumerProposal.pdf",
            type: "file",
            status: "needs-signature",
            filePath: "/documents/form43.pdf"
          },
          {
            id: "creditor-list",
            name: "CreditorList.xlsx",
            type: "file",
            status: "needs-review",
            filePath: "/documents/creditors.xlsx"
          }
        ]
      },
      {
        id: "income-statement",
        name: "IncomeExpenseStatement.pdf",
        type: "file",
        status: "needs-review",
        filePath: "/documents/incomestatement.pdf"
      }
    ]
  }
];

export function useDocumentsData(selectedClient: string | null) {
  const [clients] = useState<Client[]>(DEMO_CLIENTS);
  const [documents] = useState<TreeNode[]>(CLIENT_DOCUMENTS);
  
  // Filter documents based on selected client
  const filteredDocuments = useMemo(() => {
    if (!selectedClient) return documents;
    return documents.filter(doc => doc.id.startsWith(selectedClient));
  }, [selectedClient, documents]);

  return {
    clients,
    documents,
    filteredDocuments
  };
}
