
import { Client, Document } from "./types";

export function createDefaultJoshHartData(): { client: Client, documents: Document[] } {
  const clientData: Client = {
    id: 'josh-hart',
    name: 'Josh Hart',
    status: 'active',
    email: 'josh.hart@example.com',
    phone: '(555) 123-4567',
  };
  
  // Provide default documents for Josh Hart
  const defaultDocs: Document[] = [
    {
      id: 'form-47-doc',
      title: 'Form 47 - Consumer Proposal',
      type: 'application/pdf',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        formType: 'form-47',
        client_name: 'Josh Hart'
      }
    },
    {
      id: 'income-statement',
      title: 'Income Statement',
      type: 'document',
      created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      metadata: {
        client_name: 'Josh Hart'
      }
    }
  ];
  
  return { client: clientData, documents: defaultDocs };
}
