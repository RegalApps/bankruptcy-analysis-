
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { MeetingFeedbackForm } from "./MeetingFeedbackForm";

interface MeetingFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  meetingTitle: string;
  clientName?: string;
}

export const MeetingFeedbackDialog = ({
  open,
  onOpenChange,
  meetingId,
  meetingTitle,
  clientName
}: MeetingFeedbackDialogProps) => {
  const handleComplete = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Meeting Feedback</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our services
          </DialogDescription>
        </DialogHeader>
        <MeetingFeedbackForm
          meetingId={meetingId}
          meetingTitle={meetingTitle}
          clientName={clientName}
          onComplete={handleComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
