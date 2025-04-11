
import React from "react";
import { TabsContainer } from "./TabsContainer";

interface DesktopLayoutProps {
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

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
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
    <div className="flex h-full">
      <div className={`flex-1 min-w-0 ${showCollaborationPanel ? 'flex' : ''}`}>
        <div className={`flex-1 overflow-auto ${showSidebar ? 'flex' : ''}`}>
          {showSidebar && (
            <div className="w-80 min-w-[20rem] border-r border-border/50 overflow-auto">
              <div className="p-4">{sidebar}</div>
            </div>
          )}
          <div className="flex-1 overflow-auto min-w-0">{mainContent}</div>
        </div>
        
        {showCollaborationPanel && (
          <div className="w-80 min-w-[20rem] border-l border-border/50 overflow-auto">
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
    </div>
  );
};
