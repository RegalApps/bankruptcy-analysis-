
import { MainHeader } from "@/components/header/MainHeader";

export const NotificationsPage = () => {
  return (
    <div className="pl-16">
      <MainHeader />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        <p className="text-muted-foreground">Your notifications will appear here.</p>
      </div>
    </div>
  );
};
