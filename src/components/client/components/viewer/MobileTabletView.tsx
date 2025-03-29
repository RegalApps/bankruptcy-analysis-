import { Client, Document } from "../../types";
import { ClientTabs } from "./ClientTabs";
import { ClientInfoPanel } from "../ClientInfo";
import { DocumentsPanel } from "../DocumentsPanel";
import { ClientActivityLog } from "../ClientActivityLog";
import { ClientHeader } from "./ClientHeader";

interface MobileTabletViewProps {
  client: Client;
  documents: Document[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBack?: () => void;
  onDocumentOpen?: (documentId: string) => void;
  onClientUpdate?: (updatedClient: Client) => void;
}

export const MobileTabletView = ({
  client,
  documents,
  activeTab,
  setActiveTab,
  onBack,
  onDocumentOpen,
  onClientUpdate
}: MobileTabletViewProps) => {
  const handleDocumentOpen = (documentId: string) => {
    if (onDocumentOpen) {
      onDocumentOpen(documentId);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ClientHeader client={client} onBack={onBack} />
      
      <div className="mt-4 flex-1 overflow-hidden flex flex-col px-4">
        <ClientTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-4 flex-1 overflow-auto">
          {activeTab === "info" && (
            <ClientInfoPanel 
              client={client}
              documents={documents}
              onClientUpdate={onClientUpdate}
            />
          )}
          
          {activeTab === "documents" && (
            <DocumentsPanel 
              documents={documents}
              activeTab="all"
              setActiveTab={() => {}}
              onDocumentOpen={handleDocumentOpen}
            />
          )}
          
          {activeTab === "activity" && (
            <ClientActivityLog 
              client={client}
              documents={documents}
            />
          )}
        </div>
      </div>
    </div>
  );
};
