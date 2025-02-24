
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, Bell, FileText, Home, MessageCircle, PieChart, Settings, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const MainSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActivePath = (path: string) => location.pathname === path;

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: MessageCircle, label: "Con & Branding", path: "/con-branding" },
    { icon: Activity, label: "Activity", path: "/activity" },
    { icon: PieChart, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-background border-r flex flex-col fixed left-0 top-0 z-40">
      {/* App Logo */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-6 hover:bg-transparent"
          onClick={() => navigate('/')}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">Secure Files AI</span>
          </div>
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-4 py-6 h-auto",
              isActivePath(item.path) && "bg-secondary"
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className={cn(
              "h-5 w-5",
              isActivePath(item.path) ? "text-foreground" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-sm",
              isActivePath(item.path) ? "text-foreground" : "text-muted-foreground"
            )}>
              {item.label}
            </span>
          </Button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t">
        <Button 
          variant="ghost"
          className="w-full justify-start gap-3 px-4 py-6 h-auto"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Notifications</span>
        </Button>
        
        <Button 
          variant="ghost"
          className="w-full justify-start gap-3 px-4 py-6 h-auto"
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Profile</span>
        </Button>
      </div>
    </aside>
  );
};
