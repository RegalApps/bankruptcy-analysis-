
import { Activity, Upload, Download, Edit, Eye, MessageSquare } from "lucide-react";

interface HistoryPanelProps {
  documentId: string;
}

export const HistoryPanel = ({ documentId }: HistoryPanelProps) => {
  // Mock history data - in a real app, this would come from an API
  const historyItems = [
    {
      id: "1",
      user: {
        name: "David Smith",
        avatar: "/avatars/david.jpg",
        initials: "DS",
      },
      action: "uploaded",
      icon: Upload,
      target: "financial-statement.pdf",
      timestamp: "2023-06-10T10:30:00Z",
    },
    {
      id: "2",
      user: {
        name: "Sarah Johnson",
        avatar: "/avatars/sarah.jpg",
        initials: "SJ",
      },
      action: "viewed",
      icon: Eye,
      target: "financial-statement.pdf",
      timestamp: "2023-06-12T14:45:00Z",
    },
    {
      id: "3",
      user: {
        name: "Michael Chen",
        avatar: "/avatars/michael.jpg",
        initials: "MC",
      },
      action: "commented",
      icon: MessageSquare,
      target: "financial-statement.pdf",
      timestamp: "2023-06-15T09:15:00Z",
      details: "Added 2 comments on page 2",
    },
    {
      id: "4",
      user: {
        name: "Sarah Johnson",
        avatar: "/avatars/sarah.jpg",
        initials: "SJ",
      },
      action: "edited",
      icon: Edit,
      target: "financial-statement.pdf",
      timestamp: "2023-06-16T11:20:00Z",
      details: "Updated client information",
    },
    {
      id: "5",
      user: {
        name: "You",
        avatar: "/avatars/you.jpg",
        initials: "YO",
      },
      action: "downloaded",
      icon: Download,
      target: "financial-statement.pdf",
      timestamp: "2023-06-18T16:00:00Z",
    },
  ];
  
  return (
    <div className="p-4">
      <div className="text-sm font-medium text-muted-foreground mb-4">
        Activity History
      </div>
      
      <div className="relative pl-6 space-y-6">
        {/* Timeline line */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-muted"></div>
        
        {historyItems.length > 0 ? (
          historyItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative">
                <div className="absolute left-[-24px] top-1 bg-background p-1 rounded-full border">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {item.user.name} {item.action} the document
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {item.details && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Activity className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No activity history available</p>
          </div>
        )}
      </div>
    </div>
  );
};
