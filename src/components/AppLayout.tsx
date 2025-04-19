
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FileText, LayoutDashboard, Settings, Upload } from "lucide-react";

export const AppLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Side navigation */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold">SecureFiles AI</h1>
          <p className="text-sm text-muted-foreground">Document Management</p>
        </div>
        
        <nav className="space-y-2">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md transition-colors ${
                isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/documents" 
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md transition-colors ${
                isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`
            }
          >
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </NavLink>
          
          <NavLink 
            to="/documents/manage" 
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md transition-colors ${
                isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`
            }
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </NavLink>
          
          <NavLink 
            to="/upload-diagnostics" 
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md transition-colors ${
                isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
              }`
            }
          >
            <Settings className="h-4 w-4" />
            <span>Upload Diagnostics</span>
          </NavLink>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};
