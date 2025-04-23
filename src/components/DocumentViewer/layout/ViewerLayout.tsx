import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";
import { ViewerHeader } from "./components/ViewerHeader";
import { MobileLayout } from "./components/MobileLayout";
import { TabletLayout } from "./components/TabletLayout";
import { DesktopLayout } from "./components/DesktopLayout";

interface ViewerLayoutProps {
  isForm47: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  collaborationPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  documentTitle: string;
  documentType: string;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  isForm47,
  sidebar,
  mainContent,
  collaborationPanel,
  versionPanel,
  documentTitle,
  documentType,
}) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("comments");
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(!isMobile);
  
  useEffect(() => {
    setShowSidebar(!isMobile);
    setShowCollaborationPanel(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleCollaborationPanel = () => setShowCollaborationPanel(!showCollaborationPanel);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-background">
      <ViewerHeader 
        documentTitle={documentTitle}
        documentType={documentType}
        isForm47={isForm47}
        isTablet={isTablet}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        toggleCollaborationPanel={toggleCollaborationPanel}
      />
      
      {isMobile ? (
        <MobileLayout 
          showSidebar={showSidebar}
          sidebar={sidebar}
          mainContent={mainContent}
          showCollaborationPanel={showCollaborationPanel}
          collaborationPanel={collaborationPanel}
          versionPanel={versionPanel}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      ) : isTablet ? (
        <TabletLayout 
          showSidebar={showSidebar}
          sidebar={sidebar}
          mainContent={mainContent}
          showCollaborationPanel={showCollaborationPanel}
          collaborationPanel={collaborationPanel}
          versionPanel={versionPanel}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      ) : (
        <DesktopLayout 
          sidebar={sidebar}
          mainContent={mainContent}
          collaborationPanel={collaborationPanel}
          versionPanel={versionPanel}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
    </div>
  );
};
