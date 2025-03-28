
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CheckCircle, Clock, Mail, Phone, User } from "lucide-react";
import { Client, Document } from "../types";
import { ClientTaskList } from "./ClientTaskList";
import { format } from "date-fns";

interface ClientSummaryPanelProps {
  client: Client;
  documentCount: number;
  lastActivityDate?: string;
  documents: Document[];
}

export const ClientSummaryPanel = ({
  client,
  documentCount,
  lastActivityDate,
  documents
}: ClientSummaryPanelProps) => {
  const [showAllTasks, setShowAllTasks] = useState(false);
  
  // Count document statuses
  const statusCounts = {
    pending: documents.filter(doc => doc.metadata?.status === 'pending').length,
    complete: documents.filter(doc => doc.metadata?.status === 'complete').length,
    review: documents.filter(doc => doc.metadata?.status === 'review').length,
  };
  
  // Get most recent documents
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Client Summary</h3>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          {/* Client Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{client.name}</span>
                <Badge variant={client.status === 'active' ? "default" : "secondary"} className="ml-auto">
                  {client.status || 'Unknown'}
                </Badge>
              </div>
              
              {client.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                    {client.email}
                  </a>
                </div>
              )}
              
              {client.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                    {client.phone}
                  </a>
                </div>
              )}

              {client.address && (
                <div className="flex items-start text-sm">
                  <span className="text-muted-foreground mr-2">Address:</span>
                  <span className="flex-1">{client.address}</span>
                </div>
              )}
              
              {lastActivityDate && (
                <div className="flex items-center text-sm mt-2 pt-2 border-t">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Last activity:</span>
                  <span className="ml-1">
                    {format(new Date(lastActivityDate), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Key Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Document Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{documentCount}</div>
                  <div className="text-xs text-muted-foreground">Total Files</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-500">{statusCounts.pending || 0}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-500">{statusCounts.complete || 0}</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentDocuments.length > 0 ? (
                recentDocuments.map(doc => (
                  <div key={doc.id} className="flex items-start space-x-2 text-sm py-1">
                    <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </CardContent>
          </Card>
          
          {/* Task Management */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Client Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientTaskList clientId={client.id} limit={showAllTasks ? undefined : 3} />
              {!showAllTasks && (
                <button 
                  className="w-full text-xs text-primary mt-2 hover:underline"
                  onClick={() => setShowAllTasks(true)}
                >
                  Show all tasks
                </button>
              )}
            </CardContent>
          </Card>
          
          {/* Notes Section */}
          {client.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
