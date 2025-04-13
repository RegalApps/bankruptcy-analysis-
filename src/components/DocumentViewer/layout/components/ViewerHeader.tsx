
import React from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, PanelRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ViewerHeaderProps {
  documentTitle?: string;
  documentType?: string;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  isForm47?: boolean;
  isTablet?: boolean;
  isMobile?: boolean;
  showSidebar: boolean;
  showRightPanel: boolean;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  documentTitle = "Document",
  documentType = "Document",
  toggleSidebar,
  toggleRightPanel,
  isForm47 = false,
  isTablet = false,
  isMobile = false,
  showSidebar,
  showRightPanel,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-2 border-b bg-muted/20 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBack} title="Go back">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant={showSidebar ? "secondary" : "ghost"} 
          size="icon" 
          onClick={toggleSidebar}
          title={showSidebar ? "Hide collaboration panel" : "Show collaboration panel"}
        >
          <Sidebar className="h-5 w-5" />
        </Button>
        
        <div className="ml-2">
          <h2 className="text-sm font-medium">{documentTitle}</h2>
          <p className="text-xs text-muted-foreground">{documentType}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <Button 
          variant={showRightPanel ? "secondary" : "ghost"} 
          size="icon" 
          onClick={toggleRightPanel}
          title={showRightPanel ? "Hide details panel" : "Show details panel"}
        >
          <PanelRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
