
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoryConfig } from "@/lib/notifications/categoryConfig";
import { useNavigate } from "react-router-dom";
import type { Notification } from "@/types/notifications";

interface NotificationsSidebarProps {
  notifications: Notification[] | undefined;
  selectedCategory?: string;
}

export const NotificationsSidebar = ({ notifications, selectedCategory }: NotificationsSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full border-b mb-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-4 px-4">
          <Button
            variant={!selectedCategory ? "default" : "ghost"}
            className="whitespace-nowrap"
            onClick={() => navigate('/notifications')}
          >
            All Notifications
            <span className="ml-2 bg-primary-foreground/10 text-xs px-2 py-1 rounded-full">
              {notifications?.filter(n => !n.read).length || 0}
            </span>
          </Button>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const count = notifications?.filter(n => n.category === key && !n.read).length || 0;
            const Icon = config.icon;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "ghost"}
                className="whitespace-nowrap"
                onClick={() => navigate(`/notifications/${key}`)}
              >
                <Icon className={cn("h-5 w-5 mr-2", config.color)} />
                {config.label}
                {count > 0 && (
                  <span className="ml-2 bg-primary-foreground/10 text-xs px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
