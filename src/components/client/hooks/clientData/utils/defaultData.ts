
import { Document } from "../../../types";

/**
 * Creates a default set of documents for a client when no documents are found
 */
export const getDefaultDocuments = (clientName: string): Document[] => {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'form-47-consumer-proposal',
      title: 'Form 47 - Consumer Proposal',
      type: 'Legal Document',
      created_at: now,
      updated_at: now,
      metadata: {
        client_name: clientName,
        formType: 'form-47',
        status: 'pending_review'
      }
    },
    {
      id: 'financial-statement',
      title: 'Financial Statement',
      type: 'Financial',
      created_at: now,
      updated_at: now,
      metadata: {
        client_name: clientName,
        status: 'completed'
      }
    },
    {
      id: 'income-verification',
      title: 'Income Verification',
      type: 'Financial',
      created_at: now,
      updated_at: now,
      metadata: {
        client_name: clientName,
        status: 'pending'
      }
    },
    {
      id: 'id-verification',
      title: 'ID Verification Documents',
      type: 'Personal',
      created_at: now,
      updated_at: now,
      metadata: {
        client_name: clientName,
        status: 'completed'
      }
    }
  ];
};
