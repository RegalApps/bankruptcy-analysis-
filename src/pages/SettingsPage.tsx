
import { MainLayout } from "@/components/layout/MainLayout";

const SettingsPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Your settings will appear here.
        </p>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
