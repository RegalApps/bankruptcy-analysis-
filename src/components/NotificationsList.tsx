
import React from 'react';
import { Notification } from '@/types/notifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle, FileText, AlertTriangle, Calendar, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface NotificationsListProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (notificationId: string) => void;
}

export const NotificationsList = ({ 
  notifications, 
  isLoading, 
  onMarkAsRead 
}: NotificationsListProps) => {
  const getNotificationIcon = (notification: Notification) => {
    const category = notification.category || 'file_activity';
    
    switch (category) {
      case 'file_activity':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'task':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'system_alert':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'security':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'client_update':
        return <Info className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTimeAgo = (createdAt?: string) => {
    if (!createdAt) return '';
    
    return formatDistanceToNow(new Date(createdAt), {
      addSuffix: true
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Notifications</h3>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" className="text-xs">
            Mark all as read
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center h-[200px]">
            <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "p-3 hover:bg-muted/50 transition-colors",
                  !notification.read && "bg-muted/30"
                )}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="bg-primary/10 rounded-full p-1.5">
                      {getNotificationIcon(notification)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={cn("text-sm", !notification.read && "font-medium")}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                          onClick={() => onMarkAsRead(notification.id)}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.description || notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getTimeAgo(notification.createdAt || notification.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <Separator />
      <div className="p-2">
        <Button variant="outline" size="sm" className="w-full text-xs">
          View all notifications
        </Button>
      </div>
    </div>
  );
};
