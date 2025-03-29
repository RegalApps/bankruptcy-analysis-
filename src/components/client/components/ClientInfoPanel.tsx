
import React from "react";
import { Client, Document } from "../types";
import { formatDate } from "@/utils/formatDate";
import { EditableClientInfo } from "./EditableClientInfo";

interface ClientInfoPanelProps {
  client: Client;
  documentCount: number;
  lastActivityDate?: string;
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
  selectedDocumentId: string | null;
  onClientUpdate?: (updatedClient: Client) => void;
}

export const ClientInfoPanel = ({ 
  client, 
  documentCount, 
  lastActivityDate,
  documents,
  onDocumentSelect,
  selectedDocumentId,
  onClientUpdate 
}: ClientInfoPanelProps) => {
  const handleClientUpdate = (updatedClient: Client) => {
    if (onClientUpdate) {
      onClientUpdate(updatedClient);
    }
  };

  return (
    <div className="space-y-6">
      <EditableClientInfo client={client} onSave={handleClientUpdate} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Client Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Documents:</span>
              <span className="text-xs font-medium">{documentCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Last Activity:</span>
              <span className="text-xs font-medium">
                {lastActivityDate ? formatDate(lastActivityDate) : 'No activity'}
              </span>
            </div>
            {client.engagement_score !== undefined && (
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Engagement Score:</span>
                <span className="text-xs font-medium">{client.engagement_score}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Recent Documents</h3>
          {documents.length > 0 ? (
            <ul className="space-y-2">
              {documents.slice(0, 3).map(doc => (
                <li 
                  key={doc.id}
                  className={`text-xs p-2 rounded cursor-pointer ${selectedDocumentId === doc.id ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
                  onClick={() => onDocumentSelect(doc.id)}
                >
                  {doc.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No documents available</p>
          )}
        </div>
      </div>
    </div>
  );
};
