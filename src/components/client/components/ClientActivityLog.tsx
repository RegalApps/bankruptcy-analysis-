
import { Client, Document } from "../types";
import { formatDate } from "@/utils/formatDate";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, User, Mail, Phone } from "lucide-react";

interface ClientActivityLogProps {
  client: Client;
  documents: Document[];
}

export const ClientActivityLog = ({ client, documents }: ClientActivityLogProps) => {
  // If this were a real component, we'd fetch the actual activity log
  // For now, we'll generate a sample log based on the documents
  
  // Sort documents by date
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  
  // Make sure client has last_interaction to avoid type issues
  const clientLastInteraction = client.last_interaction || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  // Create a simulated activity log
  const activityItems = [
    // Client creation event
    {
      id: 'client-created',
      type: 'client_created',
      title: 'Client profile created',
      icon: <User className="h-4 w-4 text-blue-500" />,
      date: clientLastInteraction
    },
    // Document events from actual documents
    ...sortedDocuments.map(doc => ({
      id: `doc-${doc.id}`,
      type: 'document_uploaded',
      title: `Document uploaded: ${doc.title}`,
      icon: <FileText className="h-4 w-4 text-green-500" />,
      date: doc.created_at
    })),
    // Add some sample events
    {
      id: 'contact-update',
      type: 'contact_update',
      title: 'Contact information updated',
      icon: <Mail className="h-4 w-4 text-purple-500" />,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'phone-call',
      type: 'phone_call',
      title: 'Phone call with client',
      icon: <Phone className="h-4 w-4 text-yellow-500" />,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  // Sort all activities by date
  const sortedActivities = activityItems.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Group by date (year-month-day)
  const groupedActivities: Record<string, typeof activityItems> = {};
  
  sortedActivities.forEach(activity => {
    const date = new Date(activity.date);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!groupedActivities[dateKey]) {
      groupedActivities[dateKey] = [];
    }
    
    groupedActivities[dateKey].push(activity);
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Activity Log</h2>
      
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-6 pr-4">
          {Object.entries(groupedActivities).map(([dateKey, activities]) => (
            <div key={dateKey} className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <h3 className="text-sm font-medium">
                  {formatDate(dateKey).split(' at')[0]}
                </h3>
              </div>
              
              <Card className="p-0 overflow-hidden">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className={`
                      px-4 py-3 flex items-start
                      ${index < activities.length - 1 ? 'border-b' : ''}
                    `}
                  >
                    <div className="mt-0.5 mr-3">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.date).split(' at')[1]}
                      </p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
