
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { NotificationCard } from "./NotificationCard";
import type { Notification } from "@/types/notifications";

interface NotificationsListProps {
  notifications: Notification[] | undefined;
  isLoading: boolean;
}

export const NotificationsList = ({ notifications, isLoading }: NotificationsListProps) => {
  return (
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
            notifications?.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
