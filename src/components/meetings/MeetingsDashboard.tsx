
import { useState } from "react";
import { MeetingsHeader } from "./MeetingsHeader";
import { MeetingsTabs } from "./MeetingsTabs";
import { UpcomingMeetings } from "./UpcomingMeetings";
import { JoinMeetingPanel } from "./JoinMeetingPanel";
import { MeetingNotes } from "./MeetingNotes";
import { MeetingAgenda } from "./MeetingAgenda";
import { MeetingAnalytics } from "./MeetingAnalytics";
import { MeetingReviewForm } from "./MeetingReviewForm";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedAnalytics } from "@/hooks/useEnhancedAnalytics";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExternalLink, Video, Clipboard, ListChecks, X, BarChart2 } from "lucide-react";
import { HotkeysProvider } from "@/hooks/useHotkeys";

export const MeetingsDashboard = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "join" | "notes" | "agenda" | "analytics">("upcoming");
  const [isActiveCall, setIsActiveCall] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const { toast } = useToast();
  const analytics = useEnhancedAnalytics({ pageName: "Meetings" });

  // Track tab changes
  const handleTabChange = (tab: "upcoming" | "join" | "notes" | "agenda" | "analytics") => {
    setActiveTab(tab);
    analytics.trackInteraction("MeetingsTabs", `Changed to ${tab} tab`);
  };

  const openNotesWindow = () => {
    const features = 'width=800,height=700,resizable=yes,scrollbars=yes';
    const notesWindow = window.open('/meetings/notes-standalone', 'meetingNotes', features);
    
    if (notesWindow) {
      notesWindow.focus();
      // Store current notes in localStorage to make them available in the new window
      const currentNotes = localStorage.getItem('meeting-notes');
      if (currentNotes) {
        localStorage.setItem('standalone-notes', currentNotes);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Popup Blocked",
        description: "Please allow popups for this site to open the notes in a new window.",
      });
    }
  };

  const openAgendaWindow = () => {
    const features = 'width=500,height=700,resizable=yes,scrollbars=yes';
    const agendaWindow = window.open('/meetings/agenda-standalone', 'meetingAgenda', features);
    
    if (agendaWindow) {
      agendaWindow.focus();
    } else {
      toast({
        variant: "destructive",
        title: "Popup Blocked",
        description: "Please allow popups for this site to open the agenda in a new window.",
      });
    }
  };

  const startActiveCallMode = () => {
    setIsActiveCall(true);
    openNotesWindow();
    openAgendaWindow();
    
    toast({
      title: "Meeting Mode Activated",
      description: "Meeting tools opened in separate windows for easy access during your call.",
    });
  };

  const endActiveCallMode = () => {
    setIsActiveCall(false);
    setShowReviewDialog(true);
  };

  const handleReviewComplete = () => {
    setShowReviewDialog(false);
    
    // After review completion, show a toast about analytics updates
    toast({
      title: "Analytics Updated",
      description: "Meeting data has been processed. View the Analytics tab to see insights.",
    });
    
    // Switch to analytics tab to show the updated information
    setActiveTab("analytics");
  };

  return (
    <HotkeysProvider>
      <div className="space-y-6 relative">
        <MeetingsHeader activeTab={activeTab} setActiveTab={handleTabChange} isActiveCall={isActiveCall} />
        
        <MeetingsTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        
        <div className="mt-6">
          {activeTab === "upcoming" && <UpcomingMeetings />}
          {activeTab === "join" && <JoinMeetingPanel />}
          {activeTab === "notes" && <MeetingNotes />}
          {activeTab === "agenda" && <MeetingAgenda />}
          {activeTab === "analytics" && <MeetingAnalytics />}
        </div>

        {/* Meeting Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="sm:max-w-xl">
            <MeetingReviewForm 
              meetingId="recent-meeting-123"
              meetingTitle="Weekly Team Sync"
              onComplete={handleReviewComplete}
            />
          </DialogContent>
        </Dialog>
      </div>
    </HotkeysProvider>
  );
};
