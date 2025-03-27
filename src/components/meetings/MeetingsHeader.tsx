
import { Button } from "@/components/ui/button";
import { Video, Plus, FileText, ClipboardList } from "lucide-react";

interface MeetingsHeaderProps {
  activeTab: "upcoming" | "join" | "notes" | "analytics" | "agenda";
  setActiveTab: (tab: "upcoming" | "join" | "notes" | "analytics" | "agenda") => void;
  isActiveCall?: boolean;
}

export const MeetingsHeader = ({ activeTab, setActiveTab, isActiveCall = false }: MeetingsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div className="flex items-center">
        <Video className="h-6 w-6 text-primary mr-2" />
        <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
        {isActiveCall && (
          <div className="flex items-center ml-3 bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-sm font-medium">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-1.5"></div>
            <span>Active Meeting</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {activeTab !== "join" && (
          <Button 
            size="sm" 
            onClick={() => setActiveTab("join")}
            className="flex items-center space-x-1"
          >
            <Video className="h-4 w-4" />
            <span>Join Meeting</span>
          </Button>
        )}
        
        {activeTab !== "notes" && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setActiveTab("notes")}
            className="flex items-center space-x-1"
          >
            <FileText className="h-4 w-4" />
            <span>Meeting Notes</span>
          </Button>
        )}
        
        {activeTab !== "agenda" && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setActiveTab("agenda")}
            className="flex items-center space-x-1"
          >
            <ClipboardList className="h-4 w-4" />
            <span>Agenda</span>
          </Button>
        )}
        
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
