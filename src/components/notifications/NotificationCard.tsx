
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Notification } from "@/types/notifications";
import { File, UserCircle, Bell, AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationCard = ({ notification, onMarkAsRead }: NotificationCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (notification.action_url) {
      navigate(notification.action_url);
    }
    
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };
  
  const getIcon = () => {
    switch (notification.category) {
      case 'file_activity':
        return <File className="h-5 w-5" />;
      case 'client_update':
        return <UserCircle className="h-5 w-5" />;
      case 'system_alert':
        return <AlertCircle className="h-5 w-5" />;
      case 'task_complete':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const getPriorityStyles = () => {
    switch (notification.priority) {
      case 'high':
        return "border-l-4 border-destructive";
      case 'medium':
        return "border-l-4 border-warning";
      default:
        return "";
    }
  };
  
  return (
    <div 
      className={cn(
        "p-4 rounded-md hover:bg-accent/30 transition-colors cursor-pointer",
        !notification.read && "bg-accent/10",
        getPriorityStyles()
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-full",
          notification.priority === 'high' 
            ? "bg-destructive/10 text-destructive" 
            : "bg-muted text-muted-foreground"
        )}>
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          
          {notification.action_url && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto mt-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                navigate(notification.action_url);
                if (!notification.read && onMarkAsRead) {
                  onMarkAsRead(notification.id);
                }
              }}
            >
              View details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
