
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
  deadlinesPanel?: React.ReactNode;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  selectedTab,
  setSelectedTab,
  collaborationPanel,
  taskPanel,
  versionPanel,
  analysisPanel,
  deadlinesPanel
}) => {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="h-full flex flex-col"
    >
      <div className="p-2 bg-muted/20">
        <TabsList className="w-full grid grid-cols-5 p-1">
          <TabsTrigger value="comments" className="flex items-center gap-1 py-2 text-xs">
            <MessageSquare className="h-3 w-3" />
            <span>Comments</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-1 py-2 text-xs">
            <ClipboardList className="h-3 w-3" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-1 py-2 text-xs">
            <Clock className="h-3 w-3" />
            <span>Versions</span>
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="flex items-center gap-1 py-2 text-xs">
            <Calendar className="h-3 w-3" />
            <span>Deadlines</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1 py-2 text-xs">
            <FileBarChart className="h-3 w-3" />
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

      <TabsContent value="deadlines" className="flex-1 overflow-auto m-0 p-0">
        {deadlinesPanel || (
          <div className="p-4 text-center text-muted-foreground">
            No deadlines available for this document
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="analysis" className="flex-1 overflow-auto m-0 p-0">
        {analysisPanel}
      </TabsContent>
    </Tabs>
  );
};
