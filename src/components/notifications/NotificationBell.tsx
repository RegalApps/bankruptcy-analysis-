
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Notification, NotificationCategory } from "@/types/notifications";
import { NotificationsSidebar } from "./NotificationsSidebar";

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockNotifications = [
          {
            id: "1",
            title: "New document uploaded",
            description: "A new document has been uploaded to your account.",
            type: "document",
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
            read: false,
            priority: "medium",
            action_url: "/documents",
            icon: "file",
            metadata: {},
            category: NotificationCategory.DOCUMENT
          },
          {
            id: "2",
            title: "Meeting reminder",
            description: "You have a meeting with Client X in 30 minutes.",
            type: "meeting",
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            read: true,
            priority: "high",
            action_url: "/meetings",
            icon: "calendar",
            metadata: {
              meetingId: "123",
              clientName: "Client X"
            },
            category: NotificationCategory.MEETING
          },
          {
            id: "3",
            title: "System update",
            description: "The system will be down for maintenance tonight at 10 PM.",
            type: "system",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            read: false,
            priority: "low",
            icon: "info",
            metadata: {},
            category: NotificationCategory.SYSTEM
          }
        ] as Notification[];

        setNotifications(mockNotifications);
        
        // Calculate unread count
        const unread = mockNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    
    // Set up polling for new notifications
    const interval = setInterval(() => {
      // In a real app, we would poll for new notifications here
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Recalculate unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative" 
        onClick={toggleSidebar}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      <NotificationsSidebar 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
};
