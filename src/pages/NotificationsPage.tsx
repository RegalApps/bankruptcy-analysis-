
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { NotificationsSidebar } from "@/components/notifications/NotificationsSidebar";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import type { DatabaseNotification, Notification } from "@/types/notifications";

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

export const NotificationsPage = () => {
  const { data: notifications, isLoading } = useQuery({
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-hidden p-6">
          <div className="max-w-6xl mx-auto h-full flex gap-6">
            <NotificationsSidebar notifications={notifications} />
            <NotificationsList notifications={notifications} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
};
