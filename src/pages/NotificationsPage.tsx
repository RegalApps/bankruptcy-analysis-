
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { NotificationsSidebar } from "@/components/notifications/NotificationsSidebar";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import type { DatabaseNotification, Notification, NotificationCategory } from "@/types/notifications";
import { useState } from "react";

const mapDatabaseNotificationToNotification = (dbNotification: DatabaseNotification): Notification => {
  // Extract category from metadata if it exists, otherwise use a default
  const category = (dbNotification.metadata?.category as NotificationCategory) || 
                  'file_activity';
  
  return {
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    category: category,
    created_at: dbNotification.created_at,
    read: dbNotification.read,
    priority: dbNotification.priority || 'normal',
    action_url: dbNotification.action_url,
    icon: dbNotification.icon,
    metadata: dbNotification.metadata || {},
    type: dbNotification.type || 'info',
  };
};

// Sample notifications for each category
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "New File Uploaded",
    message: "Document 'Q4 Report.pdf' has been uploaded to your workspace",
    category: "file_activity",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    priority: "normal",
    metadata: { type: "upload" },
    type: "info"
  },
  {
    id: "2",
    title: "Security Alert",
    message: "Unusual login attempt detected from new device",
    category: "security",
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
    priority: "high",
    metadata: { type: "access" },
    type: "warning"
  },
  {
    id: "3",
    title: "Task Completed",
    message: "John completed the document review task",
    category: "task",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: true,
    priority: "normal",
    metadata: { type: "completed" },
    type: "info"
  },
  {
    id: "4",
    title: "New Task Assigned",
    message: "You have been assigned to review the latest contract",
    category: "task",
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    read: false,
    priority: "high",
    metadata: { type: "task_assigned" },
    type: "info"
  },
  {
    id: "5",
    title: "Task Comment",
    message: "Sarah commented on your document review task",
    category: "task",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
    priority: "normal",
    metadata: { type: "comment" },
    type: "info"
  },
  {
    id: "6",
    title: "Subscription Renewal",
    message: "Your subscription will renew in 7 days",
    category: "subscription",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    read: false,
    priority: "normal",
    metadata: {},
    type: "info"
  },
  {
    id: "7",
    title: "Meeting Reminder",
    message: "Team meeting starts in 15 minutes",
    category: "reminder",
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    read: false,
    priority: "normal",
    metadata: {},
    type: "info"
  }
];

export const NotificationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: dbNotifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Properly cast and map database notifications to the UI notification format
      return (data as unknown as DatabaseNotification[]).map(mapDatabaseNotificationToNotification);
    },
  });

  // Combine real and sample notifications
  const allNotifications = [...(dbNotifications || []), ...sampleNotifications];
  
  // Filter notifications based on selected category
  const filteredNotifications = selectedCategory 
    ? allNotifications.filter(n => n.category === selectedCategory) 
    : allNotifications;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <NotificationsSidebar 
          notifications={allNotifications} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
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
