
import { useState } from "react";
import { Client, Document } from "../../types";
import { ClientInfoPanel } from "../ClientInfoPanel";
import { DocumentsPanel } from "../DocumentsPanel";
import { ClientActivityLog } from "../ClientActivityLog";

interface ClientTabContentProps {
  client: Client;
  documents: Document[];
  activeTab: string;
  onDocumentOpen: (documentId: string) => void;
}

export const ClientTabContent = ({ 
  client, 
  documents, 
  activeTab,
  onDocumentOpen
}: ClientTabContentProps) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };
  
  const handleDocumentOpen = (documentId: string) => {
    // Call the passed onDocumentOpen prop
    onDocumentOpen(documentId);
  };
  
  // Calculate last activity date from documents
  const getLastActivityDate = () => {
    if (client.last_interaction) return client.last_interaction;
    
    if (documents.length === 0) return undefined;
    
    return documents.reduce((latest, doc) => {
      const docDate = new Date(doc.updated_at);
      return !latest || docDate > new Date(latest) ? doc.updated_at : latest;
    }, "");
  };

  return (
    <div className="h-full">
      {activeTab === "info" && (
        <ClientInfoPanel 
          client={client}
          documentCount={documents.length}
          lastActivityDate={getLastActivityDate()}
          documents={documents}
          onDocumentSelect={handleDocumentSelect}
          selectedDocumentId={selectedDocumentId}
        />
      )}
      
      {activeTab === "documents" && (
        <DocumentsPanel 
          documents={documents}
          activeTab="all"
          setActiveTab={() => {}}
          onDocumentSelect={handleDocumentSelect}
          onDocumentOpen={handleDocumentOpen}
          selectedDocumentId={selectedDocumentId}
        />
      )}
      
      {activeTab === "activity" && (
        <ClientActivityLog 
          client={client}
          documents={documents}
        />
      )}
    </div>
  );
};
