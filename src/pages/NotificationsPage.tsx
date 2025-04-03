
import { MainLayout } from "@/components/layout/MainLayout";
import { NotificationsList } from "@/components/notifications/NotificationsList";

const NotificationsPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <NotificationsList />
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
