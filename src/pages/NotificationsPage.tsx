
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  Bell, 
  FileText, 
  Shield, 
  MessageCircle, 
  Timer, 
  Calendar,
  CheckCircle,
  Lock,
  Upload,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type NotificationCategory = 'file_activity' | 'security' | 'task' | 'subscription' | 'reminder';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  created_at: string;
  read: boolean;
  priority: string;
  action_url?: string;
  icon?: string;
  metadata: Record<string, any>;
}

// Define the database response type
interface DatabaseNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
  user_id: string;
  category?: NotificationCategory;
  priority?: string;
  action_url?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

const categoryConfig = {
  file_activity: {
    label: "File Activity",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  security: {
    label: "Security",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  task: {
    label: "Tasks & Comments",
    icon: MessageCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  subscription: {
    label: "Subscription",
    icon: Timer,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  reminder: {
    label: "Reminders",
    icon: Calendar,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
};

const getIconForNotification = (category: NotificationCategory, type?: string) => {
  const specificIcons: Record<string, any> = {
    upload: Upload,
    access: Lock,
    mention: Users,
    completed: CheckCircle,
  };

  if (type && specificIcons[type]) {
    return specificIcons[type];
  }

  return categoryConfig[category].icon;
};

const mapDatabaseNotificationToNotification = (dbNotification: DatabaseNotification): Notification => {
  return {
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    category: (dbNotification.category as NotificationCategory) || 'file_activity',
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
      
      // Map the database response to our Notification type
      return (data as DatabaseNotification[]).map(mapDatabaseNotificationToNotification);
    },
  });

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-hidden p-6">
          <div className="max-w-6xl mx-auto h-full flex gap-6">
            {/* Category Sidebar */}
            <div className="w-64 shrink-0 space-y-2">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              {Object.entries(categoryConfig).map(([key, config]) => {
                const count = notifications?.filter(n => n.category === key && !n.read).length || 0;
                const Icon = config.icon;
                return (
                  <Button
                    key={key}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto py-3"
                  >
                    <Icon className={cn("h-5 w-5", config.color)} />
                    <span className="flex-1 text-left">{config.label}</span>
                    {count > 0 && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {count}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Notifications List */}
            <div className="flex-1 bg-card rounded-lg border">
              <div className="p-4 border-b">
                <h1 className="text-2xl font-bold">Notifications</h1>
              </div>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-4 space-y-4">
                  {isLoading ? (
                    <p className="text-center text-muted-foreground">Loading notifications...</p>
                  ) : notifications?.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-lg font-medium">No notifications yet</p>
                      <p className="text-sm text-muted-foreground">
                        When you receive notifications, they will appear here
                      </p>
                    </div>
                  ) : (
                    notifications?.map((notification) => {
                      const category = categoryConfig[notification.category || 'file_activity'];
                      const Icon = getIconForNotification(
                        notification.category || 'file_activity',
                        notification.metadata?.type
                      );
                      
                      return (
                        <Card
                          key={notification.id}
                          className={cn(
                            "p-4 transition-colors",
                            !notification.read && "bg-primary/5 dark:bg-primary/10"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              category.bgColor
                            )}>
                              <Icon className={cn("h-5 w-5", category.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-medium line-clamp-1">
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {getRelativeTime(notification.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              {notification.action_url && (
                                <div className="mt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={() => window.location.href = notification.action_url!}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
