
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ClientTabs = ({ activeTab, setActiveTab }: ClientTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
