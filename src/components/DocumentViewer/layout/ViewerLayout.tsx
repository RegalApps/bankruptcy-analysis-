
import React from "react";

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
  return (
    <div className="h-full flex flex-col md:grid md:grid-cols-12 overflow-hidden">
      {/* Left Panel - Document Summary & Details */}
      <div className={`${isForm47 ? 'md:col-span-4 lg:col-span-3' : 'md:col-span-3 lg:col-span-2'} h-full overflow-auto border-r border-border/50 bg-white dark:bg-background`}>
        {sidebar}
      </div>
      
      {/* Center Panel - Document Viewer */}
      <div className={`${isForm47 ? 'md:col-span-8 lg:col-span-6' : 'md:col-span-9 lg:col-span-7'} h-full overflow-auto border-r border-border/50 bg-white dark:bg-muted/10`}>
        <div className="h-full flex flex-col">
          {mainContent}
        </div>
      </div>
      
      {/* Right Panel - Collaboration */}
      <div className="md:col-span-12 lg:col-span-3 h-full overflow-auto bg-white dark:bg-background">
        {collaborationPanel}
      </div>
    </div>
  );
};
