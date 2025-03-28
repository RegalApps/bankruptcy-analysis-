
import { useState, useEffect } from "react";
import { Document } from "../../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CalendarClock, FileText, MessageSquare, Clock, UserPlus, Download, Edit } from "lucide-react";

interface ActivityEvent {
  id: string;
  type: 'view' | 'edit' | 'comment' | 'upload' | 'download' | 'share';
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  details?: string;
}

interface ActivityHistoryTabProps {
  document: Document;
}

export const ActivityHistoryTab = ({ document }: ActivityHistoryTabProps) => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be fetched from an API
    // For now, generating mock data based on the document
    
    const mockActivities: ActivityEvent[] = [
      {
        id: '1',
        type: 'upload',
        timestamp: document.created_at,
        user: {
          id: '1',
          name: 'John Doe',
          avatar: ''
        },
        details: `Uploaded ${document.title}`
      },
      {
        id: '2',
        type: 'view',
        timestamp: new Date(new Date(document.updated_at).getTime() - 86400000 * 2).toISOString(),
        user: {
          id: '2',
          name: 'Jane Smith',
          avatar: ''
        },
        details: `Viewed ${document.title}`
      },
      {
        id: '3',
        type: 'comment',
        timestamp: new Date(new Date(document.updated_at).getTime() - 86400000).toISOString(),
        user: {
          id: '1',
          name: 'John Doe',
          avatar: ''
        },
        details: 'Added comment: "Please review this document"'
      },
      {
        id: '4',
        type: 'edit',
        timestamp: document.updated_at,
        user: {
          id: '3',
          name: 'Robert Johnson',
          avatar: ''
        },
        details: `Updated ${document.title}`
      }
    ];
    
    // Sort activities by timestamp (newest first)
    const sortedActivities = mockActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    setActivities(sortedActivities);
    setLoading(false);
  }, [document]);
  
  const getActivityIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'upload':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'view':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'edit':
        return <Edit className="h-4 w-4 text-amber-500" />;
      case 'download':
        return <Download className="h-4 w-4 text-purple-500" />;
      case 'share':
        return <UserPlus className="h-4 w-4 text-indigo-500" />;
      default:
        return <CalendarClock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading activity...</div>;
  }
  
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <CalendarClock className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="font-medium">No activity yet</h3>
        <p className="text-sm text-muted-foreground">
          This document doesn't have any recorded activity.
        </p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex space-x-3">
            <div className="mt-0.5">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>
                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center">
                <span className="font-medium text-sm">{activity.user.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
              <div className="flex items-center">
                {getActivityIcon(activity.type)}
                <span className="text-sm ml-2">{activity.details}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
