
import React, { useState, useEffect } from "react";
import { ChevronDown, PanelRight, FileText, FileBarChart, MessageSquare, ListTodo, History, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";

interface ViewerLayoutProps {
  isForm47: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  collaborationPanel: React.ReactNode;
  taskPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  documentTitle: string;
  documentType: string;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  isForm47,
  sidebar,
  mainContent,
  collaborationPanel,
  taskPanel,
  versionPanel,
  documentTitle,
  documentType,
}) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("comments");
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(!isMobile);
  
  // Update layout when screen size changes
  useEffect(() => {
    setShowSidebar(!isMobile);
    setShowCollaborationPanel(!isMobile);
  }, [isMobile]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-background">
      {/* Document Header - With improved responsive design */}
      <div className="sticky top-0 z-10 flex justify-between items-center p-2 sm:p-3 bg-muted/30 border-b">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <div className="bg-muted/50 p-1.5 sm:p-2 rounded-md flex-shrink-0">
            {isForm47 ? (
              <FileBarChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            ) : (
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-sm sm:text-lg font-bold text-foreground truncate">{documentTitle}</h1>
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-0.5 sm:mt-1">
              {isForm47 && (
                <div className="bg-primary/10 text-primary px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                  Consumer Proposal
                </div>
              )}
              <div className="bg-muted text-muted-foreground px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                Form {documentType.includes('47') ? '47' : documentType}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile view controls */}
        {isMobile && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="h-8 px-2"
            >
              Details
            </Button>
            <Button
              variant="outline"
              size="sm" 
              onClick={() => setShowCollaborationPanel(!showCollaborationPanel)}
              className="h-8 px-2"
            >
              Comments
            </Button>
          </div>
        )}
      </div>
      
      {/* Main Content with Responsive Panel Layout */}
      {isMobile ? (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Mobile Layout - Stack panels vertically */}
          {showSidebar && (
            <div className="border-b border-border/50 overflow-auto max-h-[40vh]">
              <div className="p-3">{sidebar}</div>
            </div>
          )}
          
          <div className="flex-1 overflow-auto">
            {mainContent}
          </div>
          
          {showCollaborationPanel && (
            <div className="border-t border-border/50 max-h-[40vh] overflow-auto">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <div className="flex items-center justify-between bg-muted/30 px-2 py-1 border-b border-border/50">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="comments" className="flex items-center gap-1 text-xs">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Comments</span>
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="flex items-center gap-1 text-xs">
                      <ListTodo className="h-3.5 w-3.5" />
                      <span>Tasks</span>
                    </TabsTrigger>
                    <TabsTrigger value="versions" className="flex items-center gap-1 text-xs">
                      <History className="h-3.5 w-3.5" />
                      <span>Versions</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="overflow-auto max-h-[calc(40vh-40px)]">
                  <TabsContent value="comments" className="m-0 p-2 overflow-auto">
                    {collaborationPanel}
                  </TabsContent>
                  <TabsContent value="tasks" className="m-0 p-2 overflow-auto">
                    {taskPanel}
                  </TabsContent>
                  <TabsContent value="versions" className="m-0 p-2 overflow-auto">
                    {versionPanel}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        /* Desktop Layout - Resizable panels */
        <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          {/* Left Panel - Document Summary & Details - Now resizable */}
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
          
          {/* Main content area with document viewer and right-side collaboration panel */}
          <ResizablePanel defaultSize={75} className="flex h-full overflow-hidden">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Document Viewer */}
              <ResizablePanel defaultSize={70} minSize={50} className="overflow-auto flex flex-col">
                {mainContent}
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Right-side collaboration panel */}
              <ResizablePanel 
                defaultSize={30} 
                minSize={20} 
                maxSize={40}
                className="border-l border-border/50"
              >
                <Tabs 
                  value={selectedTab} 
                  onValueChange={setSelectedTab}
                  className="w-full h-full flex flex-col"
                >
                  <div className="flex items-center justify-between bg-muted/30 px-2 py-1 border-b border-border/50">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="comments" className="flex items-center gap-1 text-xs">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Comments</span>
                      </TabsTrigger>
                      <TabsTrigger value="tasks" className="flex items-center gap-1 text-xs">
                        <ListTodo className="h-3.5 w-3.5" />
                        <span>Tasks</span>
                      </TabsTrigger>
                      <TabsTrigger value="versions" className="flex items-center gap-1 text-xs">
                        <History className="h-3.5 w-3.5" />
                        <span>Versions</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="comments" className="m-0 p-2 h-full overflow-auto">
                      {collaborationPanel}
                    </TabsContent>
                    <TabsContent value="tasks" className="m-0 p-2 h-full overflow-auto">
                      {taskPanel}
                    </TabsContent>
                    <TabsContent value="versions" className="m-0 p-2 h-full overflow-auto">
                      {versionPanel}
                    </TabsContent>
                  </div>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};
