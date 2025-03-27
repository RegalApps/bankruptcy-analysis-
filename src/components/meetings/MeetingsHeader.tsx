
import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";

interface MeetingsHeaderProps {
  activeTab: "upcoming" | "integrations" | "join";
  setActiveTab: (tab: "upcoming" | "integrations" | "join") => void;
}

export const MeetingsHeader = ({ activeTab, setActiveTab }: MeetingsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-2">
        <Video className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          size="sm" 
          onClick={() => setActiveTab("join")}
          className="flex items-center space-x-1"
        >
          <Video className="h-4 w-4" />
          <span>Join Meeting</span>
        </Button>
        
        <Button 
          size="sm" 
          onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/eventedit", "_blank")}
          variant="outline"
          className="flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule</span>
        </Button>
      </div>
    </div>
  );
};
