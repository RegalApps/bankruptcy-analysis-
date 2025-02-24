
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { EFilingDashboard } from "@/components/e-filing/EFilingDashboard";
import { EFilingProvider } from "@/components/e-filing/context/EFilingContext";

export const EFilingPage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <EFilingProvider>
            <EFilingDashboard />
          </EFilingProvider>
        </main>
      </div>
    </div>
  );
};
