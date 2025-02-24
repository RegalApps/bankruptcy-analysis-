import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CheckCircle, Clock, Mail } from "lucide-react";

export const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      title: "Document Updated",
      description: "The document 'Project Proposal' has been updated",
      time: "2 hours ago",
      type: "update",
      read: false,
    },
    {
      id: 2,
      title: "New Comment",
      description: "John Doe commented on 'Financial Report'",
      time: "5 hours ago",
      type: "comment",
      read: true,
    },
    {
      id: 3,
      title: "Document Shared",
      description: "Sarah shared 'Meeting Minutes' with you",
      time: "1 day ago",
      type: "share",
      read: false,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-4 ${
                      notification.read ? "bg-card" : "bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.read
                            ? "bg-muted"
                            : "bg-primary/10"
                        }`}
                      >
                        {notification.type === "update" && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                        {notification.type === "comment" && (
                          <Mail className="h-5 w-5 text-primary" />
                        )}
                        {notification.type === "share" && (
                          <Bell className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
};
