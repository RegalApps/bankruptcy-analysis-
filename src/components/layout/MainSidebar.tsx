
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Activity, 
  Bell, 
  Users,
  FileCheck,
  Settings,
  Shield, // For SAFA
  DollarSign, // For Smart Income and Expense
  UserCircle2 // For Profile
} from "lucide-react";

export const MainSidebar = () => {
  const location = useLocation();

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Documents", path: "/documents", icon: FolderOpen },
    { name: "E-Filing", path: "/e-filing", icon: FileCheck },
    { name: "Smart Income & Expense", path: "/activity", icon: DollarSign },
    { name: "SAFA", path: "/SAFA", icon: Shield },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "CRM", path: "/crm", icon: Users },
  ];

  const bottomLinks = [
    { name: "Profile", path: "/profile", icon: UserCircle2 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-card border-r">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <img 
            src="/lovable-uploads/01eb992b-a293-4ef9-a5ff-fa81da6a95ed.png" 
            alt="Logo" 
            className="h-8" 
          />
        </div>
        
        {/* Main navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors",
                      isCurrentPath(link.path)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section with Profile and Settings */}
        <div className="p-4 border-t">
          <ul className="space-y-1">
            {bottomLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors",
                      isCurrentPath(link.path)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
