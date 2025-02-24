
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";

export const AnalyticsPage = () => {
  return (
    <div>
      <MainSidebar />
      <div className="pl-16">
        <MainHeader />
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
          <p className="text-muted-foreground">View your document analytics here.</p>
        </div>
      </div>
    </div>
  );
};
