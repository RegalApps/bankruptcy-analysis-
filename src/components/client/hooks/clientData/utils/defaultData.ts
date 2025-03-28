
import { Document } from "../../../types";

/**
 * Get default documents for a client if none are found
 */
export const getDefaultDocuments = (clientName: string): Document[] => {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const lastWeek = new Date(Date.now() - 604800000).toISOString();
  
  return [
    {
      id: "form-47-doc",
      title: "Form 47 - Consumer Proposal",
      type: "form-47",
      created_at: lastWeek,
      updated_at: yesterday,
      metadata: {
        client_name: clientName,
        client_id: clientName.toLowerCase().replace(/\s+/g, '-'),
        formType: "form-47"
      }
    },
    {
      id: "financial-statement",
      title: "Financial Statement",
      type: "financial",
      created_at: lastWeek,
      updated_at: now,
      metadata: {
        client_name: clientName,
        client_id: clientName.toLowerCase().replace(/\s+/g, '-')
      }
    },
    {
      id: "client-agreement",
      title: "Client Agreement",
      type: "legal",
      created_at: lastWeek,
      updated_at: lastWeek,
      metadata: {
        client_name: clientName,
        client_id: clientName.toLowerCase().replace(/\s+/g, '-')
      }
    }
  ];
};
