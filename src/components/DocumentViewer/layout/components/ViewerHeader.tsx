
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Download, PanelRightClose, PanelRight, FileBarChart, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ViewerHeaderProps {
  documentTitle: string;
  documentType: string;
  toggleSidebar: () => void;
  toggleCollaborationPanel: () => void;
  isForm47?: boolean;
  isTablet?: boolean;
  isMobile?: boolean;
  showSidebar?: boolean;
  showCollaborationPanel?: boolean;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  documentTitle,
  documentType,
  toggleSidebar,
  toggleCollaborationPanel,
  isForm47 = false,
  isTablet = false,
  isMobile = false,
  showSidebar = true,
  showCollaborationPanel = true
}) => {
  return (
    <div className="flex items-center justify-between border-b p-3 bg-card/20">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center">
          <div className={cn(
            "w-2 h-2 rounded-full mr-2",
            isForm47 ? "bg-yellow-400" : "bg-green-400"
          )} />
          <div>
            <h2 className="text-base font-semibold leading-tight">{documentTitle}</h2>
            <p className="text-xs text-muted-foreground">{documentType}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {showCollaborationPanel ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRight className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Panel</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={toggleSidebar}
        >
          {showSidebar ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={toggleCollaborationPanel}
        >
          {showCollaborationPanel ? (
            <FileBarChart className="h-4 w-4" />
          ) : (
            <Calendar className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Collaboration Panel</span>
        </Button>
      </div>
    </div>
  );
};
