
import React from "react";
import { DocumentDetails } from "../types";

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
    <div className="h-full max-h-[calc(100vh-10rem)] bg-background/50 rounded-lg shadow-sm overflow-hidden border border-border/20">
      <div className="grid grid-cols-12 h-full">
        {/* Left Panel - Document Summary & Details */}
        <div className={`${isForm47 ? 'col-span-12 md:col-span-4 lg:col-span-3' : 'col-span-12 md:col-span-3 lg:col-span-2'} h-full overflow-auto border-r border-border/50`}>
          {sidebar}
        </div>
        
        {/* Center Panel - Document Viewer */}
        <div className={`${isForm47 ? 'col-span-12 md:col-span-8 lg:col-span-6' : 'col-span-12 md:col-span-9 lg:col-span-7'} h-full overflow-auto border-r border-border/50`}>
          <div className="h-full flex flex-col">
            {mainContent}
          </div>
        </div>
        
        {/* Right Panel - Collaboration */}
        <div className="col-span-12 lg:col-span-3 h-full overflow-auto">
          {collaborationPanel}
        </div>
      </div>
    </div>
  );
};
