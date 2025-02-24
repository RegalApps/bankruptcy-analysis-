
import { FileCheck } from "lucide-react";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { MainHeader } from "@/components/header/MainHeader";
import { Footer } from "@/components/layout/Footer";

export const EFilingPage = () => {
  return (
    <div className="min-h-screen flex">
      <MainSidebar />
      <div className="flex-1 pl-64 flex flex-col">
        <MainHeader />
        <main className="flex-1">
          <div className="container py-8">
            <div className="flex items-center gap-2 mb-6">
              <FileCheck className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold">E-Filing</h1>
            </div>
            
            <div className="grid gap-6">
              {/* Content will be added in future updates */}
              <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
                <FileCheck className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <h2 className="text-lg font-medium mb-2">E-Filing System</h2>
                <p>This page is under construction. Check back soon for electronic filing features.</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default EFilingPage;
