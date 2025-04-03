
import { formatDistanceToNow } from "date-fns";
import { Bell, FileText, Calendar, MessageSquare, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Notification } from "@/types/notifications";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationCard = ({ notification, onMarkAsRead }: NotificationCardProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'meeting':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div className={`p-4 ${notification.read ? 'bg-background' : 'bg-accent/10'}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <p className="text-sm text-muted-foreground">{notification.description}</p>
            </div>
            
            {!notification.read && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6" 
                onClick={handleMarkAsRead}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Mark as read</span>
              </Button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
      <Separator className="mt-4" />
    </div>
  );
};
