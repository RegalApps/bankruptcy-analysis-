
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Video, Link } from "lucide-react";

interface MeetingsTabsProps {
  activeTab: "upcoming" | "integrations" | "join";
  setActiveTab: (tab: "upcoming" | "integrations" | "join") => void;
}

export const MeetingsTabs = ({ activeTab, setActiveTab }: MeetingsTabsProps) => {
  const handleTabChange = (value: string) => {
    setActiveTab(value as "upcoming" | "integrations" | "join");
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-md">
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Upcoming</span>
        </TabsTrigger>
        <TabsTrigger value="integrations" className="flex items-center gap-2">
          <Link className="h-4 w-4" />
          <span className="hidden sm:inline">Integrations</span>
        </TabsTrigger>
        <TabsTrigger value="join" className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          <span className="hidden sm:inline">Join</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
