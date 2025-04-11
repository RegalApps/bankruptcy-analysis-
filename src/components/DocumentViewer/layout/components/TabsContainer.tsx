
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, ClipboardList, Clock, Calendar, FileBarChart } from "lucide-react";

interface TabsContainerProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  collaborationPanel: React.ReactNode;
  taskPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  analysisPanel?: React.ReactNode;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  selectedTab,
  setSelectedTab,
  collaborationPanel,
  taskPanel,
  versionPanel,
  analysisPanel
}) => {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="h-full flex flex-col"
    >
      <div className="p-2 bg-muted/20">
        <TabsList className="w-full grid grid-cols-4 p-1">
          <TabsTrigger value="comments" className="flex items-center gap-2 py-2">
            <MessageSquare className="h-4 w-4" />
            <span>Comments</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2 py-2">
            <ClipboardList className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2 py-2">
            <Clock className="h-4 w-4" />
            <span>Versions</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 py-2">
            <FileBarChart className="h-4 w-4" />
            <span>Analysis</span>
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

      <TabsContent value="analysis" className="flex-1 overflow-auto m-0 p-0">
        {analysisPanel}
      </TabsContent>
    </Tabs>
  );
};
