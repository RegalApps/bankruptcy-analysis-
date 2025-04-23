import React from "react";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";
import { TabsContainer } from "./TabsContainer";

interface DesktopLayoutProps {
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  collaborationPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  sidebar,
  mainContent,
  collaborationPanel,
  versionPanel,
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
      <ResizablePanel 
        defaultSize={25} 
        minSize={15}
        maxSize={40}
        className="h-full overflow-auto border-r border-border/50 bg-white dark:bg-background"
      >
        <div className="p-3 h-full overflow-auto">
          {sidebar}
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={75} className="flex h-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={70} minSize={50} className="overflow-auto flex flex-col">
            {mainContent}
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel 
            defaultSize={30} 
            minSize={20} 
            maxSize={40}
            className="border-l border-border/50"
          >
            <TabsContainer
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              collaborationPanel={collaborationPanel}
              versionPanel={versionPanel}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
