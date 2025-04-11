
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, ClipboardList, Clock } from "lucide-react";

interface TabsContainerProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  collaborationPanel: React.ReactNode;
  taskPanel: React.ReactNode;
  versionPanel: React.ReactNode;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  selectedTab,
  setSelectedTab,
  collaborationPanel,
  taskPanel,
  versionPanel
}) => {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="h-full flex flex-col"
    >
      <div className="border-b px-2 py-1 bg-muted/30">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comments" className="text-xs flex gap-1 items-center py-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Comments</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs flex gap-1 items-center py-1">
            <ClipboardList className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="text-xs flex gap-1 items-center py-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Versions</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="comments" className="flex-1 overflow-auto m-0 p-0">
        {collaborationPanel}
      </TabsContent>
      
      <TabsContent value="tasks" className="flex-1 overflow-auto m-0 p-0">
        {taskPanel}
      </TabsContent>
      
      <TabsContent value="versions" className="flex-1 overflow-auto m-0 p-0">
        {versionPanel}
      </TabsContent>
    </Tabs>
  );
};
