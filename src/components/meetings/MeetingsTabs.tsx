
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Video, FileText, ClipboardList } from "lucide-react";

interface MeetingsTabsProps {
  activeTab: "upcoming" | "join" | "notes" | "agenda";
  setActiveTab: (tab: "upcoming" | "join" | "notes" | "agenda") => void;
}

export const MeetingsTabs = ({ activeTab, setActiveTab }: MeetingsTabsProps) => {
  const handleTabChange = (value: string) => {
    setActiveTab(value as "upcoming" | "join" | "notes" | "agenda");
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 max-w-3xl">
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Upcoming</span>
        </TabsTrigger>
        <TabsTrigger value="join" className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          <span className="hidden sm:inline">Join</span>
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Notes</span>
        </TabsTrigger>
        <TabsTrigger value="agenda" className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          <span className="hidden sm:inline">Agenda</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
