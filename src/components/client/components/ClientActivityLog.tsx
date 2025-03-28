import { Client, Document } from "../types";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, Upload, Edit, Eye, User } from "lucide-react";

interface ClientActivityLogProps {
  client: Client;
  documents: Document[];
}

export const ClientActivityLog = ({ client, documents }: ClientActivityLogProps) => {
  // Sort documents by updated_at date (most recent first)
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  
  // Create artificial activity log from documents and client info
  const activityLog = [
    // Client activities
    {
      id: `client-created-${client.id}`,
      type: 'client_created',
      description: `Client ${client.name} was added to the system`,
      timestamp: client.last_interaction || new Date().toISOString(),
      icon: <User className="h-5 w-5 text-blue-500" />
    },
    // Document activities
    ...sortedDocuments.map(doc => ({
      id: `doc-${doc.id}`,
      type: 'document_updated',
      description: `Document "${doc.title}" was ${doc.created_at === doc.updated_at ? 'created' : 'updated'}`,
      timestamp: doc.updated_at,
      icon: <FileText className="h-5 w-5 text-green-500" />
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document_created':
        return <Upload className="h-5 w-5 text-green-500" />;
      case 'document_updated':
        return <Edit className="h-5 w-5 text-amber-500" />;
      case 'document_viewed':
        return <Eye className="h-5 w-5 text-blue-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (activityLog.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg">No Activity</h3>
          <p className="text-sm text-muted-foreground mt-2">
            There is no recent activity for this client
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h3 className="font-medium text-lg mb-4">Activity Timeline</h3>
      <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="relative pl-6 pb-6">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 left-2.5 w-px bg-border"></div>
          
          {/* Activity items */}
          <div className="space-y-6">
            {activityLog.map((activity) => (
              <div key={activity.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-6 mt-1.5 rounded-full bg-background p-1 ring-1 ring-border">
                  {activity.icon}
                </div>
                
                {/* Activity content */}
                <div className="mb-1 text-sm font-medium">{activity.description}</div>
                <time className="text-xs text-muted-foreground">
                  {format(new Date(activity.timestamp), 'MMM d, yyyy - h:mma')}
                </time>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
