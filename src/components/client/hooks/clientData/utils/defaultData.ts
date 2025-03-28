
import { Document } from "../../../types";
import { v4 as uuidv4 } from "uuid";

export const getDefaultDocuments = (clientName: string): Document[] => {
  const currentDate = new Date().toISOString();
  const yesterdayDate = new Date(Date.now() - 86400000).toISOString();
  
  return [
    {
      id: uuidv4(),
      title: 'Form 47 - Consumer Proposal',
      type: 'application/pdf',
      updated_at: currentDate,
      created_at: currentDate, // Fixed property
      metadata: {
        formType: 'form-47',
        client_name: clientName,
        storage_path: 'sample-documents/form-47-consumer-proposal.pdf'
      }
    },
    {
      id: uuidv4(),
      title: 'Income Statement',
      type: 'document',
      updated_at: yesterdayDate,
      created_at: yesterdayDate, // Fixed property
      metadata: {
        client_name: clientName
      }
    }
  ];
};
