
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, FileCheck, Clock, LineChart, HistoryIcon } from "lucide-react";

interface TabsContainerProps {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  collaborationPanel: React.ReactNode;
  taskPanel: React.ReactNode;
  versionPanel: React.ReactNode;
  analysisPanel: React.ReactNode;
  deadlinesPanel: React.ReactNode;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  selectedTab,
  setSelectedTab,
  collaborationPanel,
  taskPanel,
  versionPanel,
  analysisPanel,
  deadlinesPanel,
}) => {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
      <TabsList className="w-full grid grid-cols-5 p-0">
        <TabsTrigger value="comments" className="flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Comments</span>
        </TabsTrigger>
        <TabsTrigger value="tasks" className="flex items-center gap-1.5">
          <FileCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Tasks</span>
        </TabsTrigger>
        <TabsTrigger value="versions" className="flex items-center gap-1.5">
          <HistoryIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Versions</span>
        </TabsTrigger>
        <TabsTrigger value="deadlines" className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Deadlines</span>
        </TabsTrigger>
        <TabsTrigger value="analysis" className="flex items-center gap-1.5">
          <LineChart className="h-4 w-4" />
          <span className="hidden sm:inline">Analysis</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="comments" className="flex-1 overflow-y-auto p-4">
        {collaborationPanel}
      </TabsContent>
      
      <TabsContent value="tasks" className="flex-1 overflow-y-auto p-4">
        {taskPanel}
      </TabsContent>
      
      <TabsContent value="versions" className="flex-1 overflow-y-auto p-4">
        {versionPanel}
      </TabsContent>
      
      <TabsContent value="deadlines" className="flex-1 overflow-y-auto p-4">
        {deadlinesPanel}
      </TabsContent>
      
      <TabsContent value="analysis" className="flex-1 overflow-y-auto p-4">
        {analysisPanel}
      </TabsContent>
    </Tabs>
  );
};
