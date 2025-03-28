
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, FileText, Activity } from "lucide-react";

interface ClientTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ClientTabs = ({ activeTab, setActiveTab }: ClientTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="info" className="flex items-center justify-center">
          <Info className="h-4 w-4 mr-2" />
          <span>Info</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center justify-center">
          <FileText className="h-4 w-4 mr-2" />
          <span>Documents</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center justify-center">
          <Activity className="h-4 w-4 mr-2" />
          <span>Activity</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
