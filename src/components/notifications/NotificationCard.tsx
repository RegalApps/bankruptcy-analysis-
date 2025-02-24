
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoryConfig, getIconForNotification } from "@/lib/notifications/categoryConfig";
import type { Notification } from "@/types/notifications";
import { format } from "date-fns";

interface NotificationCardProps {
  notification: Notification;
}

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return format(date, "MMM d, yyyy 'at' h:mm a");
};

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const category = categoryConfig[notification.category || 'file_activity'];
  const Icon = getIconForNotification(
    notification.category || 'file_activity',
    notification.metadata?.type
  );

  return (
    <Card
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
};
