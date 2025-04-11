
import React from "react";
import { TabsContainer } from "./TabsContainer";

interface MobileLayoutProps {
  showSidebar: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  showCollaborationPanel: boolean;
  collaborationPanel: React.ReactNode;
  taskPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  showSidebar,
  sidebar,
  mainContent,
  showCollaborationPanel,
  collaborationPanel,
  taskPanel,
  versionPanel,
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {showCollaborationPanel && (
        <div className="border-b border-border/50 overflow-auto max-h-[40vh]">
          <TabsContainer
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            collaborationPanel={collaborationPanel}
            taskPanel={taskPanel}
            versionPanel={versionPanel}
          />
        </div>
      )}
      
      <div className="flex-1 overflow-auto">
        {mainContent}
      </div>
      
      {showSidebar && (
        <div className="border-t border-border/50 max-h-[40vh] overflow-auto">
          <div className="p-3">{sidebar}</div>
        </div>
      )}
    </div>
  );
};
