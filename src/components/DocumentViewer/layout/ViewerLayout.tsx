
import React, { useState, useEffect } from "react";
import { DesktopLayout } from "./components/DesktopLayout";
import { TabletLayout } from "./components/TabletLayout";
import { MobileLayout } from "./components/MobileLayout";
import { ViewerHeader } from "./components/ViewerHeader";

interface ViewerLayoutProps {
  isForm47?: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel: React.ReactNode;
  collaborationPanel: React.ReactNode;
  taskPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  analysisPanel?: React.ReactNode;
  deadlinesPanel?: React.ReactNode;
  documentTitle?: string;
  documentType?: string;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  isForm47 = false,
  sidebar,
  mainContent,
  rightPanel,
  collaborationPanel,
  taskPanel,
  versionPanel,
  analysisPanel,
  deadlinesPanel,
  documentTitle = "Document",
  documentType = "Document",
}) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [selectedTab, setSelectedTab] = useState("comments");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleRightPanel = () => {
    setShowRightPanel(!showRightPanel);
  };

  // Update layout based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1280);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      <ViewerHeader
        documentTitle={documentTitle}
        documentType={documentType}
        toggleSidebar={toggleSidebar}
        toggleRightPanel={toggleRightPanel}
        isForm47={isForm47}
        isTablet={isTablet}
        isMobile={isMobile}
        showSidebar={showSidebar}
        showRightPanel={showRightPanel}
      />
      
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <MobileLayout
            showSidebar={showSidebar}
            sidebar={sidebar}
            mainContent={mainContent}
            rightPanel={rightPanel}
            showRightPanel={showRightPanel}
            collaborationPanel={collaborationPanel}
            taskPanel={taskPanel}
            versionPanel={versionPanel}
            analysisPanel={analysisPanel || <div>No analysis available</div>}
            deadlinesPanel={deadlinesPanel || <div>No deadlines available</div>}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ) : isTablet ? (
          <TabletLayout
            showSidebar={showSidebar}
            sidebar={sidebar}
            mainContent={mainContent}
            rightPanel={rightPanel}
            showRightPanel={showRightPanel}
            collaborationPanel={collaborationPanel}
            taskPanel={taskPanel}
            versionPanel={versionPanel}
            analysisPanel={analysisPanel || <div>No analysis available</div>}
            deadlinesPanel={deadlinesPanel || <div>No deadlines available</div>}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ) : (
          <DesktopLayout
            showSidebar={showSidebar}
            sidebar={sidebar}
            mainContent={mainContent}
            rightPanel={rightPanel}
            showRightPanel={showRightPanel}
            collaborationPanel={collaborationPanel}
            taskPanel={taskPanel}
            versionPanel={versionPanel}
            analysisPanel={analysisPanel || <div>No analysis available</div>}
            deadlinesPanel={deadlinesPanel || <div>No deadlines available</div>}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}
      </div>
    </div>
  );
};
