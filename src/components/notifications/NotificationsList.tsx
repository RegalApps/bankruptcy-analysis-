
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X, Check, ExternalLink } from "lucide-react";
import { NotificationCard } from "./NotificationCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Notification } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface NotificationsListProps {
  notifications: Notification[] | undefined;
  isLoading: boolean;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationsList = ({ notifications, isLoading, onMarkAsRead }: NotificationsListProps) => {
  const navigate = useNavigate();
  
  const handleViewAll = () => {
    navigate('/notifications');
  };
  
  const handleMarkAllAsRead = async () => {
    if (!notifications?.length) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const notificationIds = notifications.map(n => n.id);
      
      // Update all notifications in the database
      await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', notificationIds);
      
      // Call onMarkAsRead for each notification
      if (onMarkAsRead) {
        notificationIds.forEach(id => onMarkAsRead(id));
      }
      
      toast("All notifications marked as read");
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast("Failed to mark notifications as read");
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="flex items-center gap-2">
          {notifications && notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={handleMarkAllAsRead}
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
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
              <NotificationCard 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
