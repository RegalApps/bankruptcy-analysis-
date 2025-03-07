
import React, { useState } from "react";
import { ChevronDown, PanelRight, FileText, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("comments");
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-background">
      {/* Document Header - Centered at the top */}
      <div className="flex justify-center items-center p-4 bg-muted/30 border-b">
        <div className="flex items-center gap-4 max-w-3xl">
          <div className="bg-muted/50 p-3 rounded-md">
            {isForm47 ? (
              <FileBarChart className="h-7 w-7 text-primary" />
            ) : (
              <FileText className="h-7 w-7 text-primary" />
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">{documentTitle}</h1>
            <div className="flex gap-2 mt-1">
              {isForm47 && (
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Consumer Proposal
                </div>
              )}
              <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
                Form {documentType.includes('47') ? '47' : documentType}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Document Summary & Details */}
        <ResizablePanel 
          defaultSize={20} 
          minSize={15}
          maxSize={40}
          collapsible={true}
          collapsedSize={0}
          onCollapse={() => setIsSidebarCollapsed(true)}
          onExpand={() => setIsSidebarCollapsed(false)}
          className={`${
            isSidebarCollapsed ? 'w-0' : ''
          } h-full overflow-auto border-r border-border/50 transition-all duration-300 bg-white dark:bg-background shadow-sm`}
        >
          <div className="p-3 h-full overflow-auto">
            {sidebar}
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Main content area with tabs at the bottom */}
        <ResizablePanel defaultSize={80} className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Document Viewer */}
          <div className={`flex-1 overflow-auto ${isPanelExpanded ? 'h-1/2' : ''}`}>
            {mainContent}
          </div>
          
          {/* Tabbed interface */}
          <div className="border-t border-border/50">
            <Tabs 
              value={selectedTab} 
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <div className="flex items-center justify-between border-b border-border/50 bg-muted/30">
                <TabsList className="my-1 ml-2">
                  <TabsTrigger value="comments" className="text-sm">Comments</TabsTrigger>
                  <TabsTrigger value="tasks" className="text-sm">Tasks</TabsTrigger>
                  <TabsTrigger value="versions" className="text-sm">Versions</TabsTrigger>
                </TabsList>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                  className="mr-2"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${isPanelExpanded ? 'rotate-180' : ''}`} />
                  <span className="ml-1 text-xs">{isPanelExpanded ? 'Collapse' : 'Expand'}</span>
                </Button>
              </div>
              
              <div className={`overflow-auto transition-height duration-300 ${isPanelExpanded ? 'h-1/2' : 'h-40'}`}>
                <TabsContent value="comments" className="m-0 p-3 h-full">
                  {collaborationPanel}
                </TabsContent>
                <TabsContent value="tasks" className="m-0 p-3 h-full">
                  {taskPanel}
                </TabsContent>
                <TabsContent value="versions" className="m-0 p-3 h-full">
                  {versionPanel}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
