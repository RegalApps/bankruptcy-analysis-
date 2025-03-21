
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X, ExternalLink } from "lucide-react";
import { NotificationCard } from "./NotificationCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Notification } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface NotificationsListProps {
  notifications: Notification[] | undefined;
  isLoading: boolean;
}

export const NotificationsList = ({ notifications, isLoading }: NotificationsListProps) => {
  const navigate = useNavigate();
  
  const handleViewAll = () => {
    navigate('/notifications');
  };

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={handleViewAll}
        >
          View all
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 h-[420px]">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-pulse h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
            <div className="animate-pulse h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="mt-4 animate-pulse h-12 bg-muted rounded w-full mx-auto"></div>
            <div className="mt-2 animate-pulse h-12 bg-muted rounded w-full mx-auto"></div>
          </div>
        ) : notifications?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <Bell className="h-12 w-12 text-muted-foreground opacity-40 mb-2" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm text-muted-foreground max-w-[240px]">
              You don't have any unread notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="p-0">
            {notifications?.map((notification) => (
              <div key={notification.id}>
                <div className="p-3 hover:bg-muted/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{notification.title}</div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  {notification.action_url && (
                    <Button 
                      size="sm" 
                      variant="link" 
                      className="px-0 h-auto text-xs mt-1"
                      onClick={() => navigate(notification.action_url)}
                    >
                      View details
                    </Button>
                  )}
                </div>
                <Separator />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
