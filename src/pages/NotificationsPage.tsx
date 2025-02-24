
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { NotificationsSidebar } from "@/components/notifications/NotificationsSidebar";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import type { DatabaseNotification, Notification, NotificationCategory } from "@/types/notifications";
import { useParams } from "react-router-dom";

const mapDatabaseNotificationToNotification = (dbNotification: DatabaseNotification): Notification => {
  return {
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    category: (dbNotification.category as Notification["category"]) || 'file_activity',
    created_at: dbNotification.created_at,
    read: dbNotification.read,
    priority: dbNotification.priority || 'normal',
    action_url: dbNotification.action_url,
    icon: dbNotification.icon,
    metadata: dbNotification.metadata || {},
  };
};

// Sample notifications for each category
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "New File Uploaded",
    message: "Document 'Q4 Report.pdf' has been uploaded to your workspace",
    category: "file_activity",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    priority: "normal",
    metadata: { type: "upload" }
  },
  {
    id: "2",
    title: "Security Alert",
    message: "Unusual login attempt detected from new device",
    category: "security",
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    read: false,
    priority: "high",
    metadata: { type: "access" }
  },
  {
    id: "3",
    title: "Task Completed",
    message: "John completed the document review task",
    category: "task",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    read: true,
    priority: "normal",
    metadata: { type: "completed" }
  },
  {
    id: "4",
    title: "Subscription Renewal",
    message: "Your subscription will renew in 7 days",
    category: "subscription",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    read: false,
    priority: "normal",
    metadata: {}
  },
  {
    id: "5",
    title: "Meeting Reminder",
    message: "Team meeting starts in 15 minutes",
    category: "reminder",
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    read: false,
    priority: "normal",
    metadata: {}
  }
];

export const NotificationsPage = () => {
  const { category } = useParams<{ category?: string }>();

  const { data: dbNotifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data as DatabaseNotification[]).map(mapDatabaseNotificationToNotification);
    },
  });

  // Combine real and sample notifications
  const allNotifications = [...(dbNotifications || []), ...sampleNotifications];
  
  // Filter notifications based on selected category
  const filteredNotifications = category 
    ? allNotifications.filter(n => n.category === category) 
    : allNotifications;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <NotificationsSidebar 
          notifications={allNotifications} 
          selectedCategory={category}
        />
        <main className="flex-1 overflow-hidden p-6">
          <div className="max-w-6xl mx-auto h-full">
            <NotificationsList 
              notifications={filteredNotifications} 
              isLoading={isLoading} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};
