
import React from "react";
import { TabsContainer } from "./TabsContainer";

interface TabletLayoutProps {
  showSidebar: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  showCollaborationPanel: boolean;
  collaborationPanel: React.ReactNode;
  taskPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  analysisPanel: React.ReactNode;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

export const TabletLayout: React.FC<TabletLayoutProps> = ({
  showSidebar,
  sidebar,
  mainContent,
  showCollaborationPanel,
  collaborationPanel,
  taskPanel,
  versionPanel,
  analysisPanel,
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {showSidebar && (
          <div className="w-72 border-r border-border/50 overflow-auto">
            <div className="p-4">{sidebar}</div>
          </div>
        )}
        <div className="flex-1 overflow-auto">{mainContent}</div>
      </div>
      
      {showCollaborationPanel && (
        <div className="h-96 border-t border-border/50 overflow-hidden">
          <TabsContainer
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            collaborationPanel={collaborationPanel}
            taskPanel={taskPanel}
            versionPanel={versionPanel}
            analysisPanel={analysisPanel}
          />
        </div>
      )}
    </div>
  );
};
