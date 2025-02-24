
import { FileCheck } from "lucide-react";

export const EFilingPage = () => {
  return (
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
  );
};

export default EFilingPage;
