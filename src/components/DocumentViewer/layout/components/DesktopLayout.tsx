
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
      {showSidebar && (
        <div className="w-80 min-w-[20rem] border-r border-border/50 overflow-auto">
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
      
      <div className="flex-1 min-w-0 overflow-auto">
        {mainContent}
      </div>
      
      {showRightPanel && (
        <div className="w-80 min-w-[20rem] border-l border-border/50 overflow-auto">
          <div className="p-4">{rightPanel}</div>
        </div>
      )}
    </div>
  );
};
