
import React, { useState } from "react";
import { ChevronDown, ChevronUp, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewerLayoutProps {
  isForm47: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  collaborationPanel: React.ReactNode;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  isForm47,
  sidebar,
  mainContent,
  collaborationPanel,
}) => {
  const [isCollabExpanded, setIsCollabExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  return (
    <div className="h-full flex flex-col md:grid md:grid-cols-12 overflow-hidden">
      {/* Left Panel - Document Summary & Details */}
      <div className={`${isSidebarCollapsed ? 'md:col-span-0 hidden' : isForm47 ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-3 lg:col-span-2'} h-full overflow-auto border-r border-border/50 bg-white dark:bg-background shadow-sm transition-all duration-300`}>
        <div className="p-2 h-full">
          {sidebar}
        </div>
      </div>
      
      {/* Toggle button for sidebar */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="fixed top-20 left-0 bg-primary text-primary-foreground p-2 rounded-r-md shadow-md z-20 flex items-center gap-1"
      >
        <PanelRight className="h-4 w-4" />
      </button>
      
      {/* Center Panel - Document Viewer */}
      <div className={`${
        isCollabExpanded 
          ? 'md:col-span-12' 
          : isSidebarCollapsed
            ? 'md:col-span-12'
            : isForm47 
              ? 'md:col-span-9 lg:col-span-9' 
              : 'md:col-span-9 lg:col-span-10'
        } h-full overflow-auto bg-white dark:bg-muted/10 transition-all duration-300`}>
        <div className="h-full flex flex-col">
          {mainContent}
        </div>
      </div>
      
      {/* Bottom Panel - Collaboration (When expanded) */}
      {isCollabExpanded && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background border-t border-border/50 h-64 overflow-auto z-10 shadow-lg">
          <div className="flex justify-between items-center px-4 py-2 bg-muted/30 border-b">
            <h3 className="text-sm font-medium">Collaboration Panel</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsCollabExpanded(false)}
              className="p-1 hover:bg-muted rounded-full"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-3 max-h-[calc(100%-40px)] overflow-auto">
            {collaborationPanel}
          </div>
        </div>
      )}

      {/* Toggle button for collaboration panel (Only visible when not expanded) */}
      {!isCollabExpanded && (
        <Button 
          onClick={() => setIsCollabExpanded(true)}
          className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-2 rounded-full shadow-md z-20 flex items-center gap-1"
        >
          <ChevronUp className="h-4 w-4 mr-1" />
          <span className="text-xs">Comments & Tasks</span>
        </Button>
      )}
    </div>
  );
};
