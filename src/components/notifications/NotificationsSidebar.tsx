
import { X, Check, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationsList } from "./NotificationsList";
import { Notification } from "@/types/notifications";

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsSidebar = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationsSidebarProps) => {
  // Group notifications by category
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const category = notification.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  // Sort categories by priority (most unread first)
  const sortedCategories = Object.entries(groupedNotifications)
    .sort(([, notificationsA], [, notificationsB]) => {
      const unreadA = notificationsA.filter(n => !n.read).length;
      const unreadB = notificationsB.filter(n => !n.read).length;
      return unreadB - unreadA;
    });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </SheetTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs"
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <Separator className="my-4" />
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {sortedCategories.length > 0 ? (
            sortedCategories.map(([category, categoryNotifications]) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1 capitalize">
                  {category}
                </h3>
                <NotificationsList 
                  notifications={categoryNotifications} 
                  onMarkAsRead={onMarkAsRead}
                  isLoading={false}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
