
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoryConfig } from "@/lib/notifications/categoryConfig";
import type { Notification } from "@/types/notifications";

interface NotificationsSidebarProps {
  notifications: Notification[] | undefined;
}

export const NotificationsSidebar = ({ notifications }: NotificationsSidebarProps) => {
  return (
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
  );
};
