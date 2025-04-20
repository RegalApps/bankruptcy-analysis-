
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotificationsList } from "@/components/notifications/NotificationsList";

const NotificationsPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Manage your alerts and notification preferences.
          </p>
        </div>
        
        <NotificationsList />
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
