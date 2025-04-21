import { Client, Document, Task } from "../types";

// Helper to produce a valid ISO date X days ago
const getDateFromDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Core helper: ensures all Document objects have proper fields (compliant typing)
const setDefaultDocumentProps = (doc: Partial<Document>): Document => {
  // Prefer a .pdf for forms, otherwise keep as-is
  const fileType = doc.type === "form" || doc.type?.startsWith("form-") ? "pdf" : "pdf";
  return {
    ...doc,
    storage_path: doc.storage_path || `${doc.id || "unknown"}.${fileType}`,
    size: doc.size ?? 1024
  } as Document;
};

// Template tasks for each client (no change)
export const getClientTasks = (clientId: string): Task[] => {
  switch (clientId) {
    case 'jane-smith':
      return [
        {
          id: "jane-task-1",
          title: "Review financial statement",
          dueDate: getDateFromDaysAgo(0),
          status: 'pending',
          priority: 'high'
        },
        {
          id: "jane-task-2",
          title: "Schedule quarterly meeting",
          dueDate: getDateFromDaysAgo(-7),
          status: 'pending',
          priority: 'medium'
        }
      ];
    case 'robert-johnson':
      return [
        {
          id: "robert-task-1",
          title: "Complete Form 32 processing",
          dueDate: getDateFromDaysAgo(2),
          status: 'overdue',
          priority: 'high'
        },
        {
          id: "robert-task-2",
          title: "Request updated bank statements",
          dueDate: getDateFromDaysAgo(-3),
          status: 'pending',
          priority: 'medium'
        },
        {
          id: "robert-task-3",
          title: "Prepare monthly report",
          dueDate: getDateFromDaysAgo(-10),
          status: 'pending',
          priority: 'low'
        }
      ];
    case 'maria-garcia':
      return [
        {
          id: "maria-task-1",
          title: "Follow up on missing documents",
          dueDate: getDateFromDaysAgo(1),
          status: 'pending',
          priority: 'high'
        },
        {
          id: "maria-task-2",
          title: "Process debt consolidation agreement",
          dueDate: getDateFromDaysAgo(-5),
          status: 'pending',
          priority: 'high'
        }
      ];
    default:
      return [];
  }
};

// ---- Document templates updated. Each object is always passed through setDefaultDocumentProps ----
export const getClientDocuments = (clientId: string): Document[] => {
  const now = getDateFromDaysAgo(0);
  const oneWeekAgo = getDateFromDaysAgo(7);
  const twoWeeksAgo = getDateFromDaysAgo(14);
  const oneMonthAgo = getDateFromDaysAgo(30);

  switch (clientId) {
    case 'jane-smith':
      return [
        setDefaultDocumentProps({
          id: 'jane-folder',
          title: 'Jane Smith',
          type: 'folder',
          created_at: oneMonthAgo,
          updated_at: now,
          is_folder: true,
          folder_type: 'client',
          metadata: {
            client_name: 'Jane Smith',
            client_id: 'jane-smith'
          }
        }),
        setDefaultDocumentProps({
          id: 'jane-financial-folder',
          title: 'Financial Documents',
          type: 'folder',
          created_at: oneMonthAgo,
          updated_at: now,
          is_folder: true,
          folder_type: 'financial',
          parent_folder_id: 'jane-folder',
          metadata: {
            client_name: 'Jane Smith',
            client_id: 'jane-smith'
          }
        }),
        setDefaultDocumentProps({
          id: 'jane-tax-return',
          title: 'Tax Return 2023',
          type: 'financial',
          created_at: oneWeekAgo,
          updated_at: oneWeekAgo,
          parent_folder_id: 'jane-financial-folder',
          metadata: {
            client_name: 'Jane Smith',
            client_id: 'jane-smith',
            document_type: 'tax_return'
          }
        }),
        setDefaultDocumentProps({
          id: 'jane-employment-letter',
          title: 'Employment Verification Letter',
          type: 'document',
          created_at: twoWeeksAgo,
          updated_at: twoWeeksAgo,
          parent_folder_id: 'jane-folder',
          metadata: {
            client_name: 'Jane Smith',
            client_id: 'jane-smith',
            document_type: 'employment_verification'
          }
        })
      ];
    case 'robert-johnson':
      return [
        setDefaultDocumentProps({
          id: 'robert-folder',
          title: 'Robert Johnson',
          type: 'folder',
          created_at: oneMonthAgo,
          updated_at: now,
          is_folder: true,
          folder_type: 'client',
          metadata: {
            client_name: 'Robert Johnson',
            client_id: 'robert-johnson'
          }
        }),
        setDefaultDocumentProps({
          id: 'robert-form-folder',
          title: 'Forms',
          type: 'folder',
          created_at: oneMonthAgo,
          updated_at: now,
          is_folder: true,
          folder_type: 'forms',
          parent_folder_id: 'robert-folder',
          metadata: {
            client_name: 'Robert Johnson',
            client_id: 'robert-johnson'
          }
        }),
        setDefaultDocumentProps({
          id: 'robert-form-32',
          title: 'Form 32 - Debt Restructuring',
          type: 'form',
          created_at: oneWeekAgo,
          updated_at: oneWeekAgo,
          parent_folder_id: 'robert-form-folder',
          metadata: {
            client_name: 'Robert Johnson',
            client_id: 'robert-johnson',
            document_type: 'form',
            form_number: '32'
          }
        }),
        setDefaultDocumentProps({
          id: 'robert-bank-statements',
          title: 'Bank Statements - Q1 2024',
          type: 'financial',
          created_at: twoWeeksAgo,
          updated_at: twoWeeksAgo,
          parent_folder_id: 'robert-folder',
          metadata: {
            client_name: 'Robert Johnson',
            client_id: 'robert-johnson',
            document_type: 'bank_statement'
          }
        }),
        setDefaultDocumentProps({
          id: 'robert-credit-report',
          title: 'Credit Report',
          type: 'document',
          created_at: oneMonthAgo,
          updated_at: oneMonthAgo,
          parent_folder_id: 'robert-folder',
          metadata: {
            client_name: 'Robert Johnson',
            client_id: 'robert-johnson',
            document_type: 'credit_report'
          }
        })
      ];
    case 'maria-garcia':
      return [
        setDefaultDocumentProps({
          id: 'maria-folder',
          title: 'Maria Garcia',
          type: 'folder',
          created_at: oneMonthAgo,
          updated_at: now,
          is_folder: true,
          folder_type: 'client',
          metadata: {
            client_name: 'Maria Garcia',
            client_id: 'maria-garcia'
          }
        }),
        setDefaultDocumentProps({
          id: 'maria-proposal-folder',
          title: 'Consumer Proposal',
          type: 'folder',
          created_at: oneMonthAgo,
          updated_at: now,
          is_folder: true,
          folder_type: 'proposal',
          parent_folder_id: 'maria-folder',
          metadata: {
            client_name: 'Maria Garcia',
            client_id: 'maria-garcia'
          }
        }),
        setDefaultDocumentProps({
          id: 'maria-form-47',
          title: 'Form 47 - Consumer Proposal',
          type: 'form-47',
          created_at: oneWeekAgo,
          updated_at: oneWeekAgo,
          parent_folder_id: 'maria-proposal-folder',
          storage_path: 'documents/maria-form-47.pdf',
          metadata: {
            client_name: 'Maria Garcia',
            client_id: 'maria-garcia',
            document_type: 'form',
            form_number: '47'
          }
        }),
        setDefaultDocumentProps({
          id: 'maria-creditor-list',
          title: 'Creditor List',
          type: 'document',
          created_at: twoWeeksAgo,
          updated_at: twoWeeksAgo,
          parent_folder_id: 'maria-proposal-folder',
          metadata: {
            client_name: 'Maria Garcia',
            client_id: 'maria-garcia',
            document_type: 'creditor_list'
          }
        }),
        setDefaultDocumentProps({
          id: 'maria-income-statement',
          title: 'Income and Expense Statement',
          type: 'financial',
          created_at: oneMonthAgo,
          updated_at: oneMonthAgo,
          parent_folder_id: 'maria-folder',
          metadata: {
            client_name: 'Maria Garcia',
            client_id: 'maria-garcia',
            document_type: 'income_statement'
          }
        })
      ];
    default:
      return [
        setDefaultDocumentProps({
          id: 'client-folder',
          title: `${clientId} Main Folder`,
          type: 'folder',
          created_at: oneMonthAgo,
          updated_at: now,
          is_folder: true,
          folder_type: 'client',
          metadata: {
            client_name: clientId,
            client_id: clientId
          }
        }),
        setDefaultDocumentProps({
          id: 'generic-form-47',
          title: 'Form 47 - Consumer Proposal',
          type: 'form-47',
          created_at: now,
          updated_at: now,
          parent_folder_id: 'client-folder',
          storage_path: `documents/${clientId}-form47.pdf`,
          metadata: {
            client_name: clientId,
            client_id: clientId,
            document_type: 'form',
            form_number: '47'
          }
        })
      ];
  }
};

// ---- Client data (no change) ----
export const getClientData = (clientId: string): Client => {
  switch (clientId) {
    case 'jane-smith':
      return {
        id: 'jane-smith',
        name: 'Jane Smith',
        status: 'active',
        location: 'British Columbia',
        email: 'jane.smith@example.com',
        phone: '(555) 987-6543',
        address: '456 Pine Avenue',
        city: 'Vancouver',
        province: 'British Columbia',
        postalCode: 'V6C 1G8',
        company: 'XYZ Ltd.',
        occupation: 'Marketing Director',
        mobilePhone: '(555) 555-1234',
        notes: 'Jane is a returning client with excellent communication.',
        metrics: {
          openTasks: 2,
          pendingDocuments: 1,
          urgentDeadlines: 0
        },
        last_interaction: getDateFromDaysAgo(3),
        engagement_score: 88
      };
    case 'robert-johnson':
      return {
        id: 'robert-johnson',
        name: 'Robert Johnson',
        status: 'pending',
        location: 'Alberta',
        email: 'robert.johnson@example.com',
        phone: '(555) 222-3333',
        address: '789 Maple Drive',
        city: 'Calgary',
        province: 'Alberta',
        postalCode: 'T2P 2M5',
        company: 'Johnson Construction',
        occupation: 'Contractor',
        mobilePhone: '(555) 444-5555',
        notes: 'Robert needs help with file organization and documentation.',
        metrics: {
          openTasks: 3,
          pendingDocuments: 2,
          urgentDeadlines: 1
        },
        last_interaction: getDateFromDaysAgo(5),
        engagement_score: 72
      };
    case 'maria-garcia':
      return {
        id: 'maria-garcia',
        name: 'Maria Garcia',
        status: 'flagged',
        location: 'Quebec',
        email: 'maria.garcia@example.com',
        phone: '(555) 666-7777',
        address: '321 Oak Boulevard',
        city: 'Montreal',
        province: 'Quebec',
        postalCode: 'H3B 2Y5',
        company: 'Garcia Designs',
        occupation: 'Graphic Designer',
        mobilePhone: '(555) 888-9999',
        notes: 'Maria requires urgent attention with her proposal documentation.',
        metrics: {
          openTasks: 2,
          pendingDocuments: 3,
          urgentDeadlines: 2
        },
        last_interaction: getDateFromDaysAgo(1),
        engagement_score: 65
      };
    default:
      return {
        id: clientId,
        name: clientId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        status: 'active',
        location: 'Unknown',
        metrics: {
          openTasks: 0,
          pendingDocuments: 0,
          urgentDeadlines: 0
        }
      };
  }
};
