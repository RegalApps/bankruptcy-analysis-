import { Document } from "../types";
import { getDateFromDaysAgo, setDefaultDocumentProps } from "./clientDocumentHelpers";

// Dynamic/async handling for future: you would replace this default with
// an async `getDynamicClientDocuments(clientId)` if needed.
const getFormDocumentTemplate = (formId: string, clientId: string): Document | null => {
  const now = getDateFromDaysAgo(0);
  switch (formId) {
    case "47":
      return setDefaultDocumentProps({
        id: `${clientId}-form-47`,
        title: "Form 47 - Consumer Proposal",
        type: "form-47",
        created_at: now,
        updated_at: now,
        storage_path: `documents/${clientId}-form47.pdf`,
        parent_folder_id: "client-folder",
        metadata: {
          client_name: clientId,
          client_id: clientId,
          document_type: "form",
          form_number: "47"
        }
      });
    case "31":
      return setDefaultDocumentProps({
        id: `${clientId}-form-31`,
        title: "Form 31 - Proof of Claim",
        type: "form-31",
        created_at: now,
        updated_at: now,
        storage_path: `documents/${clientId}-form31.pdf`,
        parent_folder_id: "client-folder",
        metadata: {
          client_name: clientId,
          client_id: clientId,
          document_type: "form",
          form_number: "31"
        }
      });
    default:
      return null;
  }
};

// All static document templates for each client
export const getClientDocuments = (clientId: string): Document[] => {
  // Handle Form 47/31 if called directly
  if (clientId.startsWith("form-47")) {
    const [_, realClientId = "generic"] = clientId.split(":");
    const doc = getFormDocumentTemplate("47", realClientId);
    return doc ? [doc] : [];
  }
  if (clientId.startsWith("form-31")) {
    const [_, realClientId = "generic"] = clientId.split(":");
    const doc = getFormDocumentTemplate("31", realClientId);
    return doc ? [doc] : [];
  }

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
