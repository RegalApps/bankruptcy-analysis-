
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
    window.open('/meetings/notes-standalone', 'meetingNotes', features);
  };

  const openAgendaWindow = () => {
    const features = 'width=500,height=700,resizable=yes,scrollbars=yes';
    window.open('/meetings/agenda-standalone', 'meetingAgenda', features);
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
        <MeetingsHeader activeTab={activeTab} setActiveTab={handleTabChange} />
        
        <MeetingsTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        
        <div className="mt-6">
          {activeTab === "upcoming" && <UpcomingMeetings />}
          {activeTab === "join" && <JoinMeetingPanel />}
          {activeTab === "notes" && <MeetingNotes />}
          {activeTab === "agenda" && <MeetingAgenda />}
          {activeTab === "analytics" && <MeetingAnalytics />}
        </div>

        {/* Quick access floating button for active calls */}
        {!isActiveCall ? (
          <div className="fixed bottom-8 right-8">
            <Button 
              onClick={startActiveCallMode}
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
              title="Start meeting mode (Alt+M)"
            >
              <Video className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          <div className="fixed bottom-8 right-8">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="default"
                  size="lg"
                  className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center relative"
                >
                  <div className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                  <Video className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" side="top">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Meeting Tools</h4>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={endActiveCallMode}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={openNotesWindow} 
                      className="w-full flex items-center justify-start gap-2"
                    >
                      <Clipboard className="h-4 w-4" />
                      <span>Notes</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={openAgendaWindow} 
                      className="w-full flex items-center justify-start gap-2"
                    >
                      <ListChecks className="h-4 w-4" />
                      <span>Agenda</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setActiveTab("analytics");
                        analytics.trackInteraction("MeetingTools", "Opened Analytics", "Click");
                      }}
                      className="w-full flex items-center justify-start gap-2 col-span-2"
                    >
                      <BarChart2 className="h-4 w-4" />
                      <span>View Analytics</span>
                    </Button>

                    <Button 
                      variant="destructive" 
                      onClick={endActiveCallMode} 
                      className="w-full col-span-2"
                    >
                      End Meeting
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

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
