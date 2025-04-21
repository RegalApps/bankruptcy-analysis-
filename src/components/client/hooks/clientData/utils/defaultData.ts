
import { Document } from "../../../types";
import { getClientDocuments } from "../../../data/clientDocumentTemplates";

/**
 * Helper function to add required properties to document objects
 */
const ensureDocumentProps = (doc: Partial<Document>): Document => {
  return {
    ...doc,
    storage_path: doc.storage_path || `${doc.id || 'unknown'}.pdf`,
    size: doc.size || 1024 // Default size of 1KB
  } as Document;
};

/**
 * Returns default document for a specific client
 */
export const getDefaultDocuments = (clientName: string): Document[] => {
  // Check if we have template documents for this client
  const clientId = clientName.toLowerCase().replace(/\s+/g, '-');
  if (['josh-hart', 'jane-smith', 'robert-johnson', 'maria-garcia'].includes(clientId)) {
    return getClientDocuments(clientId);
  }

  // Otherwise use generic documents
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  return [
    ensureDocumentProps({
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
    }),
    ensureDocumentProps({
      id: 'form-47-doc',
      title: 'Form 47 - Consumer Proposal',
      type: 'form-47',
      created_at: yesterday,
      updated_at: yesterday,
      metadata: {
        client_name: clientName,
        storage_path: 'sample-documents/form-47-consumer-proposal.pdf'
      }
    }),
    ensureDocumentProps({
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
    }),
    ensureDocumentProps({
      id: 'bank-statement',
      title: 'Bank Statement - March 2023',
      type: 'financial',
      created_at: yesterday,
      updated_at: yesterday,
      parent_folder_id: 'bank-folder',
      metadata: {
        client_name: clientName
      }
    })
  ];
};
