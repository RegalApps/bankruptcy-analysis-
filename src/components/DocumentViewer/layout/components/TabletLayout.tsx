import React from "react";
import { TabsContainer } from "./TabsContainer";

interface TabletLayoutProps {
  showSidebar: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  showCollaborationPanel: boolean;
  collaborationPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

export const TabletLayout: React.FC<TabletLayoutProps> = ({
  showSidebar,
  sidebar,
  mainContent,
  showCollaborationPanel,
  collaborationPanel,
  versionPanel,
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <div className="w-72 border-r border-border/50 overflow-auto">
            <div className="p-3">{sidebar}</div>
          </div>
        )}
        
        <div className="flex-1 overflow-auto">
          {mainContent}
        </div>
        
        {showCollaborationPanel && (
          <div className="w-80 border-l border-border/50 overflow-auto">
            <TabsContainer
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              collaborationPanel={collaborationPanel}
              versionPanel={versionPanel}
            />
          </div>
        )}
      </div>
    </div>
  );
};
