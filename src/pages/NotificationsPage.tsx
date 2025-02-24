import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Info, MessageCircle, Search } from "lucide-react";
import { useState } from "react";

// Mock data for demonstration
const mockNotifications = [
  {
    id: 1,
    type: "message",
    title: "New message from John Doe",
    message: "Hey, I've reviewed the document you sent...",
    timestamp: new Date(2024, 2, 15, 14, 30),
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "System Update",
    message: "The system will undergo maintenance...",
    timestamp: new Date(2024, 2, 15, 10, 15),
    read: true,
  },
  {
    id: 3,
    type: "alert",
    title: "Document Shared",
    message: "Sarah shared a new document with you",
    timestamp: new Date(2024, 2, 14, 16, 45),
    read: false,
  },
];

export const NotificationsPage = () => {
  const [filter, setFilter] = useState("");
  const [view, setView] = useState<"all" | "unread">("all");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      case "alert":
        return <Bell className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  const filteredNotifications = mockNotifications
    .filter(notification => 
      notification.title.toLowerCase().includes(filter.toLowerCase()) ||
      notification.message.toLowerCase().includes(filter.toLowerCase())
    )
    .filter(notification => view === "all" || !notification.read);

  return (
    <div>
      <MainSidebar />
      <div className="pl-16">
        <MainHeader />
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <div className="flex gap-2">
              <Button
                variant={view === "all" ? "default" : "outline"}
                onClick={() => setView("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={view === "unread" ? "default" : "outline"}
                onClick={() => setView("unread")}
                size="sm"
              >
                Unread
              </Button>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              className="pl-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    !notification.read ? "bg-primary/5 border-primary/10" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={`mt-1 ${!notification.read ? "text-primary" : "text-muted-foreground"}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            {!notification.read && (
                              <Badge variant="default" className="ml-2 animate-fade-in">
                                New
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground" title={notification.timestamp.toLocaleString()}>
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
