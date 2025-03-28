
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, FileText, Clock } from "lucide-react";

interface ClientTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ClientTabs = ({ activeTab, setActiveTab }: ClientTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="info" className="flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Info
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Documents
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Activity
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
