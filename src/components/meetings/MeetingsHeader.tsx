
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  ChevronDown,
  Video,
  X,
  FileText,
  ListChecks,
  MessageSquare
} from "lucide-react";

interface MeetingsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: "upcoming" | "join" | "notes" | "agenda" | "analytics") => void;
  isActiveCall: boolean;
  onRequestFeedback: () => void;
  onSubmitFeedback?: () => void;
}

export const MeetingsHeader = ({
  activeTab,
  setActiveTab,
  isActiveCall,
  onRequestFeedback,
  onSubmitFeedback
}: MeetingsHeaderProps) => {
  const [totalNotifications] = useState(3);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
        <p className="text-muted-foreground">
          Schedule, join, and manage your client meetings
        </p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {isActiveCall ? (
          <Button variant="destructive" className="gap-2" onClick={() => {}}>
            <X className="h-4 w-4" />
            End Meeting
          </Button>
        ) : (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {totalNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {totalNotifications}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="outline" onClick={() => {}}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2">
                  <Video className="h-4 w-4" />
                  Start Meeting
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setActiveTab("join")}>
                  <Video className="h-4 w-4 mr-2" />
                  Start or Join
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule for Later
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onRequestFeedback}>
                  <FileText className="h-4 w-4 mr-2" />
                  Request Client Feedback
                </DropdownMenuItem>
                {onSubmitFeedback && (
                  <DropdownMenuItem onClick={onSubmitFeedback}>
                    <ListChecks className="h-4 w-4 mr-2" />
                    Submit Your Feedback
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
};
