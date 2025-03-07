
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  
  return (
    <div className="h-full flex flex-col md:grid md:grid-cols-12 overflow-hidden">
      {/* Left Panel - Document Summary & Details */}
      <div className={`${isForm47 ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-3 lg:col-span-2'} h-full overflow-auto border-r border-border/50 bg-white dark:bg-background shadow-sm`}>
        <div className="p-1 h-full">
          {sidebar}
        </div>
      </div>
      
      {/* Center Panel - Document Viewer */}
      <div className={`${isCollabExpanded 
        ? 'md:col-span-9 lg:col-span-10' 
        : isForm47 
          ? 'md:col-span-6 lg:col-span-6' 
          : 'md:col-span-6 lg:col-span-7'} 
        h-full overflow-auto border-r border-border/50 bg-white dark:bg-muted/10`}>
        <div className="h-full flex flex-col">
          {mainContent}
        </div>
      </div>
      
      {/* Right Panel - Collaboration (Only visible when not expanded) */}
      {!isCollabExpanded && (
        <div className="md:col-span-3 lg:col-span-3 h-full overflow-auto bg-white dark:bg-background">
          {collaborationPanel}
        </div>
      )}

      {/* Bottom Panel - Collaboration (When expanded) */}
      {isCollabExpanded && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background border-t border-border/50 h-48 overflow-auto z-10 shadow-lg">
          <div className="flex justify-between items-center px-4 py-2 bg-muted/30 border-b">
            <h3 className="text-sm font-medium">Collaboration Panel</h3>
            <button 
              onClick={() => setIsCollabExpanded(false)}
              className="p-1 hover:bg-muted rounded-full"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2">
            {collaborationPanel}
          </div>
        </div>
      )}

      {/* Toggle button for collaboration panel (Only visible when not expanded) */}
      {!isCollabExpanded && (
        <button 
          onClick={() => setIsCollabExpanded(true)}
          className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-2 rounded-full shadow-md z-20 flex items-center gap-1"
        >
          <ChevronUp className="h-4 w-4" />
          <span className="text-xs">Expand</span>
        </button>
      )}
    </div>
  );
};
