
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Video, FileText, ClipboardList, BarChart2 } from "lucide-react";
import { useHotkeys } from "@/hooks/useHotkeys";

interface MeetingsTabsProps {
  activeTab: "upcoming" | "join" | "notes" | "agenda" | "analytics";
  setActiveTab: (tab: "upcoming" | "join" | "notes" | "agenda" | "analytics") => void;
}

export const MeetingsTabs = ({ activeTab, setActiveTab }: MeetingsTabsProps) => {
  const handleTabChange = (value: string) => {
    setActiveTab(value as "upcoming" | "join" | "notes" | "agenda" | "analytics");
  };

  // Register keyboard shortcuts for tab navigation
  useHotkeys("1", () => setActiveTab("upcoming"), []);
  useHotkeys("2", () => setActiveTab("join"), []);
  useHotkeys("3", () => setActiveTab("notes"), []);
  useHotkeys("4", () => setActiveTab("agenda"), []);
  useHotkeys("5", () => setActiveTab("analytics"), []);

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl">
          <TabsTrigger 
            value="upcoming" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            title="Upcoming meetings (Press 1)"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Upcoming</span>
          </TabsTrigger>
          <TabsTrigger 
            value="join" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            title="Join meeting (Press 2)"
          >
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Join</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notes" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            title="Meeting notes (Press 3)"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="agenda" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            title="Meeting agenda (Press 4)"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Agenda</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            title="Meeting analytics (Press 5)"
          >
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="text-xs text-muted-foreground text-center mt-1">
        Press <kbd className="px-1 rounded border mx-1">1-5</kbd> to switch tabs
      </div>
    </>
  );
};
