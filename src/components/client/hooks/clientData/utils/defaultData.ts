
import { Document } from "../../../types";
import { v4 as uuidv4 } from "uuid";

export const getDefaultDocuments = (clientName: string): Document[] => {
  return [
    {
      id: uuidv4(), // Generate a proper UUID instead of using a string ID
      title: 'Form 47 - Consumer Proposal',
      type: 'application/pdf',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        formType: 'form-47',
        client_name: clientName,
        storage_path: 'sample-documents/form-47-consumer-proposal.pdf' // Ensure storage path is set
      }
    },
    {
      id: uuidv4(), // Generate a proper UUID instead of using a string ID
      title: 'Income Statement',
      type: 'document',
      created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      metadata: {
        client_name: clientName
      }
    }
  ];
};
