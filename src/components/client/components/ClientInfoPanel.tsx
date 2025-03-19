
import { User, Mail, Phone, Clock, MessageSquare, Calendar, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { DocumentTree } from "./DocumentTree";
import { Document, Client } from "../types";

interface ClientInfoPanelProps {
  client: Client;
  documentCount: number;
  lastActivityDate?: string;
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
}

export const ClientInfoPanel = ({ 
  client, 
  documentCount, 
  lastActivityDate,
  documents,
  onDocumentSelect
}: ClientInfoPanelProps) => {
  const handleQuickAction = (action: string) => {
    toast.info(`${action} feature will be available soon`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Client profile section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{client.name}</h2>
            <div className={`px-2 py-0.5 text-xs inline-block rounded-full ${
              client.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {client.status || 'Unknown Status'}
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          {client.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
          )}
          {lastActivityDate && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Last Activity: {new Date(lastActivityDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleQuickAction("Message")}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Message</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleQuickAction("Schedule")}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleQuickAction("Add Note")}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Add Note</span>
          </Button>
        </div>
        
        {/* AI insights card */}
        {documentCount > 0 && (
          <Card className="bg-muted/50 mb-2">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium">Insights</p>
                  <p className="text-muted-foreground">
                    Client has {documentCount} documents. Last activity on {lastActivityDate ? new Date(lastActivityDate).toLocaleDateString() : 'N/A'}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Document tree section */}
      <div className="flex-1 overflow-auto p-4">
        <h3 className="text-sm font-medium mb-3">Document Tree</h3>
        <DocumentTree documents={documents} onDocumentSelect={onDocumentSelect} />
      </div>
    </div>
  );
};
