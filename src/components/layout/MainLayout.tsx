
import { ReactNode } from "react";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { MainHeader } from "@/components/header/MainHeader";
import { Footer } from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const MainLayout = ({ children, showFooter = true }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen h-screen w-full flex overflow-hidden bg-white dark:bg-background">
      <MainSidebar />
      <div className={`flex-1 flex flex-col w-full overflow-hidden ${!isMobile ? 'pl-64' : 'pl-0'}`}>
        <MainHeader />
        <main className="flex-1 overflow-auto p-2 sm:p-4 bg-gray-50 dark:bg-background">
          <div className="container mx-auto max-w-7xl pb-16 sm:pb-20">
            {children}
          </div>
        </main>
        {showFooter && <Footer className={`fixed bottom-0 left-0 w-full ${!isMobile ? 'pl-64' : 'pl-0'}`} />}
      </div>
    </div>
  );
};
