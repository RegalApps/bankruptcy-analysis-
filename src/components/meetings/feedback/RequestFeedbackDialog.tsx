
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { 
  generateFeedbackFormLink, 
  shareFeedbackFormViaEmail, 
  copyFeedbackFormLink 
} from "../utils/sharingUtils";

interface RequestFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  meetingTitle: string;
  clientName: string;
}

export const RequestFeedbackDialog = ({
  open,
  onOpenChange,
  meetingId,
  meetingTitle,
  clientName
}: RequestFeedbackDialogProps) => {
  const [clientEmail, setClientEmail] = useState("");
  const [customMessage, setCustomMessage] = useState(
    `Dear ${clientName},\n\nThank you for participating in our recent meeting. Your feedback is valuable to us and helps us improve our services.\n\nWe would appreciate if you could take a few minutes to share your thoughts.`
  );

  const handleSendViaEmail = () => {
    if (!clientEmail) {
      toast("Please enter the client email address");
      return;
    }
    
    shareFeedbackFormViaEmail(
      meetingId,
      meetingTitle,
      clientName,
      clientEmail,
      customMessage
    );
    
    toast("Email client opened with feedback request");
  };

  const handleCopyLink = () => {
    copyFeedbackFormLink(meetingId, meetingTitle, clientName);
    toast("Feedback form link copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Client Feedback</DialogTitle>
          <DialogDescription>
            Send a feedback request to {clientName} regarding your meeting.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client-email">Client Email</Label>
            <Input 
              id="client-email" 
              placeholder="client@example.com" 
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Textarea 
              id="custom-message" 
              placeholder="Add a personal message to your feedback request..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-sm font-medium mb-2">Preview Link:</div>
            <div className="text-sm text-muted-foreground truncate">
              {generateFeedbackFormLink(meetingId, meetingTitle, clientName)}
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            <ClipboardCopy className="h-4 w-4" />
            Copy Link
          </Button>
          
          <Button 
            onClick={handleSendViaEmail}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
