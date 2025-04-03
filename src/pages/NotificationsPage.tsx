
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { Notification, NotificationPriority, NotificationCategory } from "@/types/notifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notificationCategories } from "@/lib/notifications/categoryConfig";

const NotificationsPage = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded",
      type: "success",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      priority: NotificationPriority.MEDIUM,
      category: NotificationCategory.DOCUMENT,
      metadata: { documentId: "doc-123" }
    },
    {
      id: "2",
      title: "Client Updated",
      description: "Client information has been updated",
      type: "info",
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: false,
      priority: NotificationPriority.LOW,
      category: NotificationCategory.CLIENT,
      metadata: { clientId: "client-456" }
    },
    {
      id: "3",
      title: "Security Alert",
      description: "Unusual login activity detected",
      type: "warning",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      read: false,
      priority: NotificationPriority.HIGH,
      category: NotificationCategory.SECURITY,
      action_url: "/settings/security"
    },
    {
      id: "4",
      title: "Meeting Scheduled",
      description: "New meeting scheduled for tomorrow",
      type: "info",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      read: true,
      priority: NotificationPriority.MEDIUM,
      category: NotificationCategory.MEETING,
      action_url: "/meetings"
    },
    {
      id: "5",
      title: "Task Assigned",
      description: "You have been assigned a new task",
      type: "info",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
      priority: NotificationPriority.HIGH,
      category: NotificationCategory.TASK,
      action_url: "/tasks"
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    console.log("Marking notification as read:", id);
  };

  const getNotificationsByCategory = (category: NotificationCategory | "all") => {
    if (category === "all") return notifications;
    return notifications.filter(n => n.category === category);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.entries(notificationCategories).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                {config.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationsList notifications={getNotificationsByCategory("all")} onMarkAsRead={handleMarkAsRead} isLoading={false} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {Object.entries(notificationCategories).map(([key, config]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle>{config.name} Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationsList 
                    notifications={getNotificationsByCategory(key as NotificationCategory)} 
                    onMarkAsRead={handleMarkAsRead} 
                    isLoading={false} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
