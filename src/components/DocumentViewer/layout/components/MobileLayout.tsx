
import React from "react";
import { TabsContainer } from "./TabsContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MobileLayoutProps {
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

export const MobileLayout: React.FC<MobileLayoutProps> = ({
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
    <div className="flex-1 overflow-hidden flex flex-col">
      <Tabs defaultValue="document" className="h-full flex flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="document" className="flex-1">Document</TabsTrigger>
          {showSidebar && <TabsTrigger value="sidebar" className="flex-1">Collaboration</TabsTrigger>}
          {showRightPanel && <TabsTrigger value="info" className="flex-1">Details</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="document" className="flex-1 overflow-auto">
          {mainContent}
        </TabsContent>
        
        {showSidebar && (
          <TabsContent value="sidebar" className="flex-1 overflow-auto">
            <TabsContainer
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              collaborationPanel={collaborationPanel}
              taskPanel={taskPanel}
              versionPanel={versionPanel}
              analysisPanel={analysisPanel}
              deadlinesPanel={deadlinesPanel}
            />
          </TabsContent>
        )}
        
        {showRightPanel && (
          <TabsContent value="info" className="flex-1 overflow-auto">
            <div className="p-3">{rightPanel}</div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
