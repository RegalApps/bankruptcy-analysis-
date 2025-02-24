
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BrainCog, Bell, FileText, Home, MessageCircle, PieChart, Settings, User, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const MainSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActivePath = (path: string) => location.pathname === path;

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: MessageCircle, label: "SAFA", path: "/SAFA" },
    { icon: Users, label: "CRM", path: "/crm" },
    { icon: BrainCog, label: "Smart Income Expense", path: "/activity" },
    { icon: PieChart, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen flex flex-col fixed left-0 top-0 z-40 border-r bg-background">
      {/* App Logo */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-6 hover:bg-transparent"
          onClick={() => navigate('/')}
        >
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/b8620d24-fab6-4068-9af7-3e91ace7b559.png" 
              alt="Secure Files AI Logo" 
              className="w-8 h-8 mix-blend-multiply dark:mix-blend-normal"
              style={{ filter: 'brightness(1) contrast(1)' }}
            />
            <span className="font-semibold text-lg text-foreground">Secure Files AI</span>
          </div>
        </Button>
      </div>

      {/* Navigation Links with ScrollArea */}
      <ScrollArea className="flex-1">
        <nav className="px-3 py-2 space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-4 py-6 h-auto",
                "hover:bg-accent/10 hover:text-accent transition-colors duration-200",
                isActivePath(item.path) && "bg-accent/10 text-accent"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActivePath(item.path) ? "text-accent" : "text-muted-foreground group-hover:text-accent"
              )} />
              <span className={cn(
                "text-sm font-medium",
                isActivePath(item.path) ? "text-accent" : "text-black dark:text-white"
              )}>
                {item.label}
              </span>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t">
        <Button 
          variant="ghost"
          className="w-full justify-start gap-3 px-4 py-6 h-auto hover:bg-accent/10 hover:text-accent"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium text-black dark:text-white">Notifications</span>
        </Button>
        
        <Button 
          variant="ghost"
          className="w-full justify-start gap-3 px-4 py-6 h-auto hover:bg-accent/10 hover:text-accent"
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium text-black dark:text-white">Profile</span>
        </Button>
      </div>
    </aside>
  );
};
