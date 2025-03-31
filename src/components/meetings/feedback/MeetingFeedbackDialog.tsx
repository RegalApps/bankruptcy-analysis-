
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { MeetingFeedbackForm } from "./MeetingFeedbackForm";
import { Send, Copy, Mail, Pencil } from "lucide-react";
import { 
  shareFeedbackFormViaEmail, 
  copyFeedbackFormLink 
} from "../utils/sharingUtils";

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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  
  const handleComplete = () => {
    onOpenChange(false);
  };

  const handleSendToClient = () => {
    setShowShareOptions(true);
  };

  const handleSendViaEmail = () => {
    if (!clientEmail.trim()) return;
    
    shareFeedbackFormViaEmail(
      meetingId,
      meetingTitle,
      clientName || "Client",
      clientEmail
    );
    
    setShowShareOptions(false);
  };

  const handleCopyLink = () => {
    copyFeedbackFormLink(meetingId, meetingTitle, clientName);
    setShowShareOptions(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Meeting Feedback</DialogTitle>
            {!showShareOptions && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleEditMode}
                      className={editMode ? "bg-muted" : ""}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{editMode ? "Exit edit mode" : "Edit feedback questions"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <DialogDescription>
            {showShareOptions 
              ? "Share this form with your client to collect their feedback" 
              : editMode 
                ? "Customize the feedback questions for your client"
                : "Your feedback helps us improve our services"}
          </DialogDescription>
        </DialogHeader>
        
        {showShareOptions ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client-email">Client Email</Label>
              <div className="flex gap-2">
                <Input 
                  id="client-email" 
                  placeholder="client@example.com" 
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleSendViaEmail} 
                        disabled={!clientEmail.trim()}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send feedback form via email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Or share the form link directly
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy feedback form link to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button variant="ghost" onClick={() => setShowShareOptions(false)}>
                Back to Feedback Form
              </Button>
            </div>
          </div>
        ) : (
          <>
            <MeetingFeedbackForm
              meetingId={meetingId}
              meetingTitle={meetingTitle}
              clientName={clientName}
              onComplete={handleComplete}
              editMode={editMode}
            />
            
            <DialogFooter className="sm:justify-between">
              <Button 
                variant="outline" 
                className="hidden sm:flex" 
                onClick={handleSendToClient}
              >
                <Send className="h-4 w-4 mr-2" />
                Share with Client
              </Button>
              
              <Button 
                variant="outline" 
                className="sm:hidden" 
                onClick={handleSendToClient}
              >
                <Send className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
