
import { MainLayout } from "@/components/layout/MainLayout";

const NotificationsPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <p className="text-lg text-muted-foreground">
          Your notifications will appear here.
        </p>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
