
import React from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ClipboardList, Clock, FileText, Calendar } from "lucide-react";

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
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
      <div className="border-b sticky top-0 bg-background z-10">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="comments" className="flex flex-col items-center py-2">
            <MessageSquare className="h-4 w-4 mb-1" />
            <span className="text-xs">Comments</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex flex-col items-center py-2">
            <ClipboardList className="h-4 w-4 mb-1" />
            <span className="text-xs">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex flex-col items-center py-2">
            <Clock className="h-4 w-4 mb-1" />
            <span className="text-xs">Versions</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex flex-col items-center py-2">
            <FileText className="h-4 w-4 mb-1" />
            <span className="text-xs">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="flex flex-col items-center py-2">
            <Calendar className="h-4 w-4 mb-1" />
            <span className="text-xs">Deadlines</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="comments" className="p-0 m-0 h-[calc(100%-41px)] overflow-hidden">
        {collaborationPanel}
      </TabsContent>
      
      <TabsContent value="tasks" className="p-3 m-0 h-[calc(100%-41px)] overflow-auto">
        {taskPanel}
      </TabsContent>
      
      <TabsContent value="versions" className="p-3 m-0 h-[calc(100%-41px)] overflow-auto">
        {versionPanel}
      </TabsContent>
      
      <TabsContent value="analysis" className="p-3 m-0 h-[calc(100%-41px)] overflow-auto">
        {analysisPanel}
      </TabsContent>
      
      <TabsContent value="deadlines" className="p-3 m-0 h-[calc(100%-41px)] overflow-auto">
        {deadlinesPanel}
      </TabsContent>
    </Tabs>
  );
};
