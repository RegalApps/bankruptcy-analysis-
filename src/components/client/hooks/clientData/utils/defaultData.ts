
import { Document } from "../../../types";

export const getDefaultDocuments = (clientName: string): Document[] => {
  return [
    {
      id: 'form-47-doc',
      title: 'Form 47 - Consumer Proposal',
      type: 'application/pdf',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        formType: 'form-47',
        client_name: clientName
      }
    },
    {
      id: 'income-statement',
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
