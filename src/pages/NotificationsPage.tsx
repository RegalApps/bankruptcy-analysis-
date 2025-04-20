
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/types/notifications";
import { toast } from "sonner";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Get notifications from supabase
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform database notifications to our UI format
        const formattedNotifications = data?.map((notif): Notification => {
          let category = 'system_alert';
          // Extract category from metadata if available
          if (notif.metadata && typeof notif.metadata === 'object' && 'category' in notif.metadata) {
            category = notif.metadata.category as string;
          }

          return {
            id: notif.id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            created_at: notif.created_at,
            read: notif.read,
            priority: notif.priority || 'normal',
            action_url: notif.action_url,
            icon: notif.icon,
            metadata: notif.metadata || {},
            category: category as any
          };
        }) || [];

        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error("Failed to update notification");
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Manage your alerts and notification preferences.
          </p>
        </div>
        
        <NotificationsList 
          notifications={notifications} 
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
