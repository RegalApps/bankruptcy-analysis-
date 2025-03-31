
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, Share2, Send } from "lucide-react";

interface MeetingsHeaderProps {
  activeTab: "upcoming" | "join" | "notes" | "agenda" | "analytics";
  setActiveTab: (tab: "upcoming" | "join" | "notes" | "agenda" | "analytics") => void;
  isActiveCall?: boolean;
  onRequestFeedback?: () => void;
}

export const MeetingsHeader = ({ 
  activeTab, 
  setActiveTab, 
  isActiveCall = false,
  onRequestFeedback
}: MeetingsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isActiveCall ? "Active Meeting" : "Meetings"}</h1>
        <p className="text-muted-foreground mt-1">
          {isActiveCall 
            ? "Tools and resources for your current meeting" 
            : "Schedule, join, and manage your client meetings"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onRequestFeedback && (
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={onRequestFeedback}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Request Feedback</span>
          </Button>
        )}
        <Button className="flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">New Meeting</span>
        </Button>
      </div>
    </div>
  );
};
