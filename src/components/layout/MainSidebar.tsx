
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, Bell, FileText, Folder, Home, PieChart, User } from "lucide-react";

export const MainSidebar = () => {
  return (
    <aside className="w-16 h-screen bg-background border-r flex flex-col items-center py-4 space-y-4 fixed">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
        <FileText className="w-6 h-6 text-primary" />
      </div>
      <nav className="flex-1 w-full flex flex-col items-center space-y-2">
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Home className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "w-10 h-10",
            "relative after:content-[''] after:absolute after:inset-0 after:rounded-md after:ring-2 after:ring-primary/50"
          )}
        >
          <Folder className="h-5 w-5 text-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Activity className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <PieChart className="h-5 w-5" />
        </Button>
      </nav>
      <div className="mt-auto space-y-2">
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </aside>
  );
};
