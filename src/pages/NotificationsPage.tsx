
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Notification } from "@/types/notifications";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would fetch from the database
        const mockNotifications: Notification[] = [
          {
            id: "1",
            title: "New document uploaded",
            description: "Form 47 has been uploaded for Josh Hart",
            createdAt: new Date().toISOString(),
            read: false,
            type: "document",
            metadata: { documentId: "form47-file" }
          },
          {
            id: "2",
            title: "Meeting reminder",
            description: "You have a meeting scheduled with Josh Hart tomorrow",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            read: false,
            type: "meeting",
            metadata: { clientId: "josh-hart" }
          }
        ];
        
        setNotifications(mockNotifications);
        toast.success("Notifications loaded");
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Could not load notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    toast("Notification marked as read");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
          <NotificationsList 
            notifications={notifications} 
            isLoading={isLoading}
            onMarkAsRead={handleMarkAsRead}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
