
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Notification, NotificationCategory } from "@/types/notifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { categoryConfig } from "@/lib/notifications/categoryConfig";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would fetch notifications from an API
    const fetchNotifications = async () => {
      // Mock data for now
      const mockNotifications = [
        {
          id: "1",
          title: "New document uploaded",
          description: "A new document has been uploaded: Form 47",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          message: "A new document has been uploaded: Form 47",
          type: "document",
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: false,
          priority: "high",
          action_url: "/documents/form47",
          icon: "file",
          metadata: {},
          category: "file_activity" as NotificationCategory
        },
        {
          id: "2",
          title: "Task deadline approaching",
          description: "Task 'Review client proposal' is due in 2 days",
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          message: "Task 'Review client proposal' is due in 2 days",
          type: "task",
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          read: false,
          priority: "medium",
          action_url: "/tasks/123",
          icon: "calendar",
          metadata: {},
          category: "task" as NotificationCategory
        },
        {
          id: "3",
          title: "System maintenance",
          description: "Scheduled maintenance on June 15th",
          createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          message: "Scheduled maintenance on June 15th",
          type: "system",
          created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          read: true,
          priority: "low",
          action_url: "/announcements",
          icon: "info",
          metadata: {},
          category: "system_alert" as NotificationCategory
        }
      ] as Notification[];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    };
    
    fetchNotifications();
  }, []);
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    const updatedNotifications = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    setOpen(false);
    
    // Navigate to the action URL in a real app
    console.log("Navigating to:", notification.actionUrl || notification.action_url);
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    toast({
      title: "All notifications marked as read",
      duration: 2000,
    });
  };
  
  const getTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  const getCategoryIcon = (notification: Notification) => {
    const category = notification.category;
    if (!category || !categoryConfig[category]) return null;
    
    const config = categoryConfig[category];
    const IconComponent = config.icon;
    
    return <IconComponent className={cn("h-4 w-4", config.color)} />;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-muted/30"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-1">
                      {getCategoryIcon(notification) || (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {notification.title?.[0] || "N"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={cn("text-sm", !notification.read && "font-medium")}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.description || notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeAgo(notification.createdAt || notification.created_at || '')}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
