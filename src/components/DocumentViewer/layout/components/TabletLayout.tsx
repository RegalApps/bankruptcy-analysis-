
import React from "react";
import { TabsContainer } from "./TabsContainer";

interface TabletLayoutProps {
  showSidebar: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel: React.ReactNode;
  showRightPanel: boolean;
  collaborationPanel: React.ReactNode;
  taskPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  analysisPanel: React.ReactNode;
  deadlinesPanel: React.ReactNode;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

export const TabletLayout: React.FC<TabletLayoutProps> = ({
  showSidebar,
  sidebar,
  mainContent,
  rightPanel,
  showRightPanel,
  collaborationPanel,
  taskPanel,
  versionPanel,
  analysisPanel,
  deadlinesPanel,
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Top area with sidebar and main content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Panel - Contains Tabs for Comments, Tasks, Versions */}
        {showSidebar && (
          <div className="w-64 border-r border-border/50 overflow-hidden flex-shrink-0">
            <TabsContainer
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              collaborationPanel={collaborationPanel}
              taskPanel={taskPanel}
              versionPanel={versionPanel}
              analysisPanel={analysisPanel}
              deadlinesPanel={deadlinesPanel}
            />
          </div>
        )}
        
        {/* Center Panel - Document Preview */}
        <div className="flex-1 overflow-auto bg-white">
          {mainContent}
        </div>
      </div>
      
      {/* Bottom area for right panel content */}
      {showRightPanel && (
        <div className="h-96 border-t border-border/50 overflow-auto">
          <div className="p-4 h-full">
            {rightPanel}
          </div>
        </div>
      )}
    </div>
  );
};
