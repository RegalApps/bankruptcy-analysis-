import { useState, useEffect, useRef } from 'react';
import { BellRing, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Notification, NotificationCategory } from '@/types/notifications';
import { categoryConfig } from '@/lib/notifications/categoryConfig';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { NotificationsList } from './NotificationsList';
import { toast } from 'sonner';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 'local-notification-1',
        title: 'Document Uploaded',
        message: 'Your bankruptcy form has been successfully uploaded and analyzed.',
        type: 'success',
        created_at: new Date().toISOString(),
        read: false,
        priority: 'normal',
        action_url: '',
        icon: '',
        metadata: {},
        category: 'file_activity'
      },
      {
        id: 'local-notification-2',
        title: 'Analysis Complete',
        message: 'The bankruptcy form analysis has been completed. View the results now.',
        type: 'info',
        created_at: new Date(Date.now() - 3600000).toISOString(), 
        read: false,
        priority: 'normal',
        action_url: '',
        icon: '',
        metadata: {},
        category: 'system'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.length);
    
    return () => {
      // No cleanup needed
    };
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast("Failed to mark notification as read");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <div className="relative p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            <BellRing className="h-5 w-5 text-primary" />
          </div>
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1.5 -right-1.5 px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-semibold shadow-sm"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationsList 
          notifications={notifications} 
          isLoading={isLoading} 
          onMarkAsRead={handleMarkAsRead}
        />
      </PopoverContent>
    </Popover>
  );
};
