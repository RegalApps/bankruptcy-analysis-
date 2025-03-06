
import { ReactNode } from "react";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { MainHeader } from "@/components/header/MainHeader";
import { Footer } from "@/components/layout/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen h-screen w-full flex overflow-hidden bg-white dark:bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64 w-full overflow-hidden">
        <MainHeader />
        <main className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-background">
          <div className="container mx-auto h-full max-w-7xl">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
