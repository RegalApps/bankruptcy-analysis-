
import { useState, useEffect } from 'react';
import { Bell, MessageSquare, FileText, Shield, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { categoryConfig } from "@/lib/notifications/categoryConfig";
import type { Notification } from "@/types/notifications";

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Fetch notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        const mappedNotifications = data.map(notification => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          category: notification.category || 'file_activity',
          created_at: notification.created_at,
          read: notification.read || false,
          priority: notification.priority || 'normal',
          action_url: notification.action_url,
          icon: notification.icon,
          metadata: notification.metadata || {}
        }));
        
        setNotifications(mappedNotifications);
        setUnreadCount(mappedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up a real-time subscription for new notifications
    const channel = supabase
      .channel('notification_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        payload => {
          const newNotification = payload.new as any;
          
          // Only show notifications for the current user
          if (newNotification.user_id === supabase.auth.getUser()) {
            setNotifications(prev => [newNotification, ...prev].slice(0, 10));
            setUnreadCount(prev => prev + 1);
            
            // Show a toast for new notifications
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Mark notifications as read when the popover is opened
  useEffect(() => {
    const markAsRead = async () => {
      if (isOpen && unreadCount > 0) {
        try {
          const unreadIds = notifications
            .filter(n => !n.read)
            .map(n => n.id);
            
          if (unreadIds.length === 0) return;
          
          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .in('id', unreadIds);
            
          if (error) throw error;
          
          // Update local state
          setNotifications(prev => 
            prev.map(n => unreadIds.includes(n.id) ? { ...n, read: true } : n)
          );
          setUnreadCount(0);
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      }
    };
    
    markAsRead();
  }, [isOpen, unreadCount, notifications]);

  const getNotificationIcon = (category: string, type?: string) => {
    switch (category) {
      case 'file_activity':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'security':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'task':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
    setIsOpen(false);
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 font-medium">
          Notifications
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto opacity-50 mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="py-1">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-muted transition-colors ${
                    !notification.read ? 'bg-muted/40' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.category, notification.metadata?.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(notification.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              window.location.href = '/notifications';
              setIsOpen(false);
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
