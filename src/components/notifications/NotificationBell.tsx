
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Notification, NotificationCategory } from '@/types/notifications';
import { categoryConfig } from '@/lib/notifications/categoryConfig';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('read', false)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        // Transform database notifications to UI notifications
        const transformedNotifications: Notification[] = data.map(dbNotification => {
          // Extract category from metadata, defaulting to 'file_activity'
          const category = (dbNotification.metadata?.category as NotificationCategory) || 'file_activity';
          
          return {
            id: dbNotification.id,
            title: dbNotification.title,
            message: dbNotification.message,
            type: dbNotification.type,
            created_at: dbNotification.created_at,
            read: dbNotification.read,
            priority: dbNotification.priority || 'normal',
            action_url: dbNotification.action_url || '',
            icon: dbNotification.icon || '',
            metadata: dbNotification.metadata || {},
            category: category
          };
        });

        setNotifications(transformedNotifications);
        setUnreadCount(transformedNotifications.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, async (payload) => {
        // Get the full notification object
        const { data: { user } } = await supabase.auth.getUser();
        if (user && payload.new.user_id === user.id) {
          const newDbNotification = payload.new;
          const category = (newDbNotification.metadata?.category as NotificationCategory) || 'file_activity';
          
          // Create a notification with the correct structure
          const newNotification: Notification = {
            id: newDbNotification.id,
            title: newDbNotification.title,
            message: newDbNotification.message,
            type: newDbNotification.type,
            created_at: newDbNotification.created_at,
            read: newDbNotification.read,
            priority: newDbNotification.priority || 'normal',
            action_url: newDbNotification.action_url || '',
            icon: newDbNotification.icon || '',
            metadata: newDbNotification.metadata || {},
            category: category
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs"
          variant="destructive"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </>
  );
};
