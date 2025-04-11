
import React, { useState, useEffect } from "react";
import { DesktopLayout } from "./components/DesktopLayout";
import { TabletLayout } from "./components/TabletLayout";
import { MobileLayout } from "./components/MobileLayout";
import { ViewerHeader } from "./components/ViewerHeader";

interface ViewerLayoutProps {
  isForm47?: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  collaborationPanel: React.ReactNode;
  taskPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  analysisPanel?: React.ReactNode;
  documentTitle?: string;
  documentType?: string;
  clientDetails?: React.ReactNode;
  documentSummary?: React.ReactNode;
  riskAssessment?: React.ReactNode;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  isForm47 = false,
  sidebar,
  mainContent,
  collaborationPanel,
  taskPanel,
  versionPanel,
  analysisPanel,
  documentTitle = "Document",
  documentType = "Document",
  clientDetails,
  documentSummary,
  riskAssessment
}) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(true);
  const [selectedTab, setSelectedTab] = useState("comments");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleCollaborationPanel = () => {
    setShowCollaborationPanel(!showCollaborationPanel);
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

  // Create the right panel content that combines client details, document summary and risk assessment
  const rightPanelContent = (
    <div className="flex flex-col h-full overflow-auto">
      {clientDetails}
      {documentSummary}
      {riskAssessment}
    </div>
  );

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      <ViewerHeader
        documentTitle={documentTitle}
        documentType={documentType}
        toggleSidebar={toggleSidebar}
        toggleCollaborationPanel={toggleCollaborationPanel}
        isForm47={isForm47}
        isTablet={isTablet}
        isMobile={isMobile}
        showSidebar={showSidebar}
        showCollaborationPanel={showCollaborationPanel}
      />
      
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <MobileLayout
            showSidebar={showSidebar}
            sidebar={rightPanelContent}
            mainContent={mainContent}
            showCollaborationPanel={showCollaborationPanel}
            collaborationPanel={collaborationPanel}
            taskPanel={taskPanel}
            versionPanel={versionPanel}
            analysisPanel={analysisPanel || <div>No analysis available</div>}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ) : isTablet ? (
          <TabletLayout
            showSidebar={showSidebar}
            sidebar={rightPanelContent}
            mainContent={mainContent}
            showCollaborationPanel={showCollaborationPanel}
            collaborationPanel={collaborationPanel}
            taskPanel={taskPanel}
            versionPanel={versionPanel}
            analysisPanel={analysisPanel || <div>No analysis available</div>}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ) : (
          <DesktopLayout
            showSidebar={showSidebar}
            sidebar={rightPanelContent}
            mainContent={mainContent}
            showCollaborationPanel={showCollaborationPanel}
            collaborationPanel={collaborationPanel}
            taskPanel={taskPanel}
            versionPanel={versionPanel}
            analysisPanel={analysisPanel || <div>No analysis available</div>}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}
      </div>
    </div>
  );
};
