
import React, { useState } from "react";
import { ChevronDown, PanelRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ViewerLayoutProps {
  isForm47: boolean;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  collaborationPanel: React.ReactNode;
  documentTitle: string;
  documentType: string;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  isForm47,
  sidebar,
  mainContent,
  collaborationPanel,
  documentTitle,
  documentType,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-background">
      {/* Document Header - Centered at the top */}
      <div className="flex justify-center items-center p-4 bg-muted/30 border-b">
        <div className="flex items-center gap-4 max-w-3xl">
          <div className="bg-muted/50 p-4 rounded-md">
            <FileText className="h-8 w-8 text-primary" />
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
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Document Summary & Details */}
        <div 
          className={`${
            isSidebarCollapsed ? 'w-0' : 'w-72'
          } h-full overflow-auto border-r border-border/50 transition-all duration-300 bg-white dark:bg-background shadow-sm`}
        >
          {!isSidebarCollapsed && (
            <div className="p-3 h-full overflow-auto">
              {sidebar}
            </div>
          )}
        </div>
        
        {/* Toggle button for sidebar */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="fixed top-24 left-0 bg-primary text-primary-foreground p-2 rounded-r-md shadow-md z-20 flex items-center gap-1"
        >
          <PanelRight className="h-4 w-4" />
        </button>
        
        {/* Main content area with tabs at the bottom */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Document Viewer */}
          <div className="flex-1 overflow-auto">
            {mainContent}
          </div>
          
          {/* Tabbed interface at the bottom */}
          <div className="border-t border-border/50">
            <Tabs defaultValue="comments" className="w-full">
              <div className="flex items-center justify-center border-b border-border/50">
                <TabsList className="my-1">
                  <TabsTrigger value="comments" className="text-xs">Comments</TabsTrigger>
                  <TabsTrigger value="tasks" className="text-xs">Tasks</TabsTrigger>
                  <TabsTrigger value="versions" className="text-xs">Versions</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="h-48 overflow-auto">
                <TabsContent value="comments" className="m-0 p-3">
                  {collaborationPanel}
                </TabsContent>
                <TabsContent value="tasks" className="m-0 p-3">
                  {collaborationPanel}
                </TabsContent>
                <TabsContent value="versions" className="m-0 p-3">
                  {collaborationPanel}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
