
import { Client, Document } from "../types";
import { format } from "date-fns";
import { User, Calendar, FileText, Phone, Mail, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DocumentTree } from "./DocumentTree";

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-1 space-y-6">
        <Card className="p-6">
          <div className="flex items-start">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-medium">{client.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Client ID: {client.id.substring(0, 8)}
              </p>
              <div className="mt-4 space-y-2">
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
                {client.status && (
                  <div className="flex items-center text-sm">
                    <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Status: <span className="capitalize">{client.status}</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h4 className="font-medium mb-4">Client Overview</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Documents</span>
              </div>
              <span className="font-medium">{documentCount}</span>
            </div>
            
            {lastActivityDate && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Last Activity</span>
                </div>
                <span className="font-medium">
                  {format(new Date(lastActivityDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            
            {client.engagement_score !== undefined && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Engagement Score</span>
                </div>
                <span className="font-medium">{client.engagement_score.toFixed(1)}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <Card className="h-full p-6">
          <h4 className="font-medium mb-4">Document Explorer</h4>
          <DocumentTree 
            documents={documents}
            onDocumentSelect={onDocumentSelect}
          />
        </Card>
      </div>
    </div>
  );
};
