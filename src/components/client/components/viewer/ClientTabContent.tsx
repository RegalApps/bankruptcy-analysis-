
import { Client, Document } from "../../types";

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
  
  // Show client info content
  if (activeTab === "info") {
    return (
      <div className="p-4 bg-card rounded-md shadow-sm">
        <h3 className="text-lg font-medium mb-4">Client Information</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Name:</span>
            <span>{client.name}</span>
          </div>
          {client.email && (
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Email:</span>
              <span>{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Phone:</span>
              <span>{client.phone}</span>
            </div>
          )}
          {client.status && (
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Status:</span>
              <span>{client.status}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Show documents content
  if (activeTab === "documents") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium px-4">Client Documents</h3>
        {documents.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No documents found for this client
          </div>
        ) : (
          <ul className="divide-y">
            {documents.map((doc) => (
              <li key={doc.id} className="p-4 hover:bg-accent transition-colors">
                <button 
                  className="w-full text-left"
                  onClick={() => onDocumentOpen(doc.id)}
                >
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Updated: {new Date(doc.updated_at).toLocaleDateString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  
  // Show activity content
  if (activeTab === "activity") {
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        {client.last_interaction ? (
          <div>
            <p>Last interaction: {new Date(client.last_interaction).toLocaleDateString()}</p>
            {client.engagement_score !== undefined && (
              <div className="mt-4">
                <span className="text-muted-foreground">Engagement Score: </span>
                <span className="font-medium">{client.engagement_score}/10</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No recent activity found for this client
          </div>
        )}
      </div>
    );
  }
  
  // Default fallback content
  return (
    <div className="p-4 text-center text-muted-foreground">
      Select a tab to view client information
    </div>
  );
};
