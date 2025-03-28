
import { Document } from "../../../types";

export const getDefaultDocuments = (clientName = 'Josh Hart'): Document[] => {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const lastWeek = new Date(Date.now() - 604800000).toISOString();
  
  const clientId = clientName.toLowerCase().replace(/\s+/g, '-');
  
  return [
    {
      id: 'form-47-doc',
      title: 'Form 47 - Consumer Proposal',
      type: 'form-47',
      created_at: lastWeek,
      updated_at: lastWeek,
      metadata: {
        client_id: clientId,
        client_name: clientName,
        formType: 'form-47',
        formNumber: '47'
      }
    },
    {
      id: 'id-verification',
      title: 'ID Verification Documents',
      type: 'identification',
      created_at: lastWeek,
      updated_at: now,
      metadata: {
        client_id: clientId,
        client_name: clientName
      }
    },
    {
      id: 'financial-statement',
      title: 'Financial Statement',
      type: 'financial',
      created_at: yesterday,
      updated_at: yesterday,
      metadata: {
        client_id: clientId,
        client_name: clientName
      }
    },
    {
      id: 'correspondence-folder',
      title: 'Correspondence',
      type: 'folder',
      is_folder: true,
      folder_type: 'correspondence',
      created_at: lastWeek,
      updated_at: now,
      metadata: {
        client_id: clientId,
        client_name: clientName
      }
    },
    {
      id: 'email-thread-1',
      title: 'Initial Consultation Email',
      type: 'email',
      parent_folder_id: 'correspondence-folder',
      created_at: lastWeek,
      updated_at: lastWeek,
      metadata: {
        client_id: clientId,
        client_name: clientName
      }
    },
    {
      id: 'email-thread-2',
      title: 'Document Requirements',
      type: 'email',
      parent_folder_id: 'correspondence-folder',
      created_at: yesterday,
      updated_at: yesterday,
      metadata: {
        client_id: clientId,
        client_name: clientName
      }
    }
  ];
};
