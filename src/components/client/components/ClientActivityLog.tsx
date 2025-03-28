
import { Client, Document } from "../types";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, Clock } from "lucide-react";

interface ClientActivityLogProps {
  client: Client;
  documents: Document[];
}

export const ClientActivityLog = ({ client, documents }: ClientActivityLogProps) => {
  // Sort documents by updated_at date in descending order
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          {documents.length === 0 
            ? "No activity found" 
            : `${documents.length} document${documents.length === 1 ? '' : 's'} found`}
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {sortedDocuments.length > 0 ? (
            sortedDocuments.map(doc => (
              <div key={doc.id} className="flex items-start p-3 border rounded-md">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{doc.title}</h4>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {doc.type || "Document"} was updated
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-medium">No Recent Activity</h4>
              <p className="text-sm text-muted-foreground mt-1">
                There is no recent activity for this client.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
