
import { Button } from "@/components/ui/button";
import { Search, Settings } from "lucide-react";

export const MainHeader = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex h-14 items-center px-6 gap-4">
        <h1 className="text-xl font-semibold">Document Management</h1>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-md border bg-background"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
