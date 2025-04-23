import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, History } from "lucide-react";

interface TabsContainerProps {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  collaborationPanel: React.ReactNode;
  versionPanel: React.ReactNode;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  selectedTab,
  setSelectedTab,
  collaborationPanel,
  versionPanel,
}) => {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full h-full">
      <div className="flex items-center justify-between bg-muted/30 px-2 py-1 border-b border-border/50">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="comments" className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Comments</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-1 text-xs">
            <History className="h-3.5 w-3.5" />
            <span>Versions</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="flex-1 overflow-auto">
        <TabsContent value="comments" className="m-0 p-2 h-full overflow-auto">
          {collaborationPanel}
        </TabsContent>
        <TabsContent value="versions" className="m-0 p-2 h-full overflow-auto">
          {versionPanel}
        </TabsContent>
      </div>
    </Tabs>
  );
};
