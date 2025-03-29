
import { Document } from "../../../types";

/**
 * Returns default document for a specific client
 */
export const getDefaultDocuments = (clientName: string): Document[] => {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  return [
    {
      id: 'client-folder',
      title: `${clientName} Documents`,
      type: 'folder',
      created_at: lastWeek,
      updated_at: now,
      is_folder: true,
      folder_type: 'client',
      metadata: {
        client_name: clientName
      }
    },
    {
      id: 'form-47-doc',
      title: 'Form 47 - Consumer Proposal',
      type: 'form-47',
      created_at: yesterday,
      updated_at: yesterday,
      metadata: {
        client_name: clientName,
        storage_path: 'sample-documents/form-47-consumer-proposal.pdf'
      }
    },
    {
      id: 'bank-folder',
      title: 'Bank Statements',
      type: 'folder',
      created_at: lastWeek,
      updated_at: yesterday,
      is_folder: true,
      folder_type: 'financial',
      parent_folder_id: 'client-folder',
      metadata: {
        client_name: clientName
      }
    },
    {
      id: 'bank-statement',
      title: 'Bank Statement - March 2023',
      type: 'financial',
      created_at: yesterday,
      updated_at: yesterday,
      parent_folder_id: 'bank-folder',
      metadata: {
        client_name: clientName
      }
    }
  ];
};
