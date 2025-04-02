
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface RequestFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: {
    id: string;
    title: string;
    date: string;
    clientName: string;
  } | null;
  onSubmit: (email: string) => void;
}

export const RequestFeedbackDialog = ({
  open,
  onOpenChange,
  meeting,
  onSubmit
}: RequestFeedbackDialogProps) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendReminder, setSendReminder] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    onSubmit(email);
    // Reset form
    setEmail("");
    setMessage("");
    setSendReminder(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Meeting Feedback</DialogTitle>
          <DialogDescription>
            Send a feedback request for the meeting: {meeting?.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient-email">Recipient Email</Label>
            <Input
              id="recipient-email"
              placeholder="client@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <p className="text-xs text-muted-foreground">
              This is usually the client's email address
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="feedback-message">Message (Optional)</Label>
            <Textarea
              id="feedback-message"
              placeholder="We'd love to hear your thoughts on our recent meeting..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="send-reminder" 
              checked={sendReminder}
              onCheckedChange={(checked) => setSendReminder(checked as boolean)}
            />
            <Label htmlFor="send-reminder" className="text-sm font-normal cursor-pointer">
              Send a reminder in 2 days if no response
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
