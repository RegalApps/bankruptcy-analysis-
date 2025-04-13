
import React from "react";
import { TabsContainer } from "./TabsContainer";

interface DesktopLayoutProps {
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

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
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
    <div className="flex h-full">
      {/* Left Panel - Contains Tabs for Comments, Tasks, Versions */}
      {showSidebar && (
        <div className="w-72 border-r border-border/50 h-full overflow-hidden flex-shrink-0">
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
      <div className="flex-1 min-w-0 overflow-auto h-full bg-white">
        {mainContent}
      </div>
      
      {/* Right Panel - Client Info, Document Summary, Risk Assessment */}
      {showRightPanel && (
        <div className="w-80 border-l border-border/50 h-full overflow-auto flex-shrink-0">
          <div className="p-4 h-full">{rightPanel}</div>
        </div>
      )}
    </div>
  );
};
