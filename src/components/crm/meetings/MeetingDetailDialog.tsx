
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingTranscriptionPanel } from "./MeetingTranscriptionPanel";
import { RequestFeedbackDialog } from "../feedback/RequestFeedbackDialog";
import { toast } from "sonner";
import { MessageSquare, FileText, Clock } from "lucide-react";

interface MeetingDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: {
    id: string;
    title: string;
    date: string;
    clientName: string;
    type?: string;
    duration?: string;
    description?: string;
    status?: string;
  } | null;
}

export const MeetingDetailDialog = ({
  open,
  onOpenChange,
  meeting
}: MeetingDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isRequestFeedbackOpen, setIsRequestFeedbackOpen] = useState(false);

  const handleRequestFeedback = () => {
    setIsRequestFeedbackOpen(true);
  };

  const handleSendFeedback = (email: string) => {
    toast.success(`Feedback request sent to ${email}`);
    setIsRequestFeedbackOpen(false);
  };

  if (!meeting) return null;

  const meetingDate = new Date(meeting.date);
  const formattedDate = meetingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  
  const formattedTime = meetingDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{meeting.title}</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">
                <Clock className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="transcription">
                <FileText className="h-4 w-4 mr-2" />
                Transcription
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Date & Time</h3>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{formattedTime}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Client</h3>
                    <p className="text-sm text-muted-foreground">{meeting.clientName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Meeting Type</h3>
                    <p className="text-sm text-muted-foreground capitalize">{meeting.type || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Duration</h3>
                    <p className="text-sm text-muted-foreground">{meeting.duration || "Not specified"}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {meeting.description || "No description provided for this meeting."}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="transcription">
              <MeetingTranscriptionPanel
                meetingId={meeting.id}
                clientName={meeting.clientName}
                meetingTitle={meeting.title}
              />
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="space-y-4 py-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Request Client Feedback</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send a customizable feedback form to your client to gather insights about this meeting.
                  </p>
                  <Button onClick={handleRequestFeedback}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Request Feedback
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <RequestFeedbackDialog
        open={isRequestFeedbackOpen}
        onOpenChange={setIsRequestFeedbackOpen}
        meeting={meeting}
        onSubmit={handleSendFeedback}
      />
    </>
  );
};
