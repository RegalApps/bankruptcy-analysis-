
import { User, Calendar, FileText, Phone, Mail, Clock, Folder } from "lucide-react";
import { Client, Document } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ClientInfoPanelProps {
  client: Client;
  documentCount: number;
  lastActivityDate?: string;
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
  selectedDocumentId: string | null;
}

export const ClientInfoPanel = ({ 
  client, 
  documentCount, 
  lastActivityDate, 
  documents,
  onDocumentSelect,
  selectedDocumentId
}: ClientInfoPanelProps) => {
  // Group documents by type
  const documentTypes = documents.reduce((acc, doc) => {
    const type = doc.type || 'Other';
    if (!acc[type]) acc[type] = 0;
    acc[type]++;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full mr-3">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{client.name}</h3>
            <p className="text-sm text-muted-foreground">
              {client.status === 'active' ? 'Active Client' : 'Inactive Client'}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          {client.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
          )}
          
          {client.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{documentCount} Documents</span>
          </div>
          
          {lastActivityDate && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Last activity: {format(new Date(lastActivityDate), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-b">
        <h4 className="text-sm font-medium mb-2">Document Types</h4>
        <div className="space-y-1">
          {Object.entries(documentTypes).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Folder className="h-4 w-4 mr-1.5 text-muted-foreground" />
                <span>{type}</span>
              </div>
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{count}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="p-4 border-b">
          <h4 className="text-sm font-medium">Recent Documents</h4>
        </div>
        <ScrollArea className="h-[calc(100%-12rem)]">
          <div className="p-2">
            {documents.slice(0, 10).map((doc) => (
              <div 
                key={doc.id}
                className={cn(
                  "p-2 text-sm rounded cursor-pointer hover:bg-accent/50 transition-colors",
                  selectedDocumentId === doc.id ? "bg-accent/60" : ""
                )}
                onClick={() => onDocumentSelect(doc.id)}
              >
                <div className="font-medium truncate">{doc.title}</div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{doc.type || 'Document'}</span>
                  <span>{format(new Date(doc.updated_at), 'MMM d')}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
