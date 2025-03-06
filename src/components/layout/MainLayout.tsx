
import { ReactNode } from "react";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { MainHeader } from "@/components/header/MainHeader";
import { Footer } from "@/components/layout/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen h-screen w-full flex overflow-hidden">
      <MainSidebar />
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <MainHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
