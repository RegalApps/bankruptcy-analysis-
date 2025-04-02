
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, ArrowRight, Copy, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface InviteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId?: string;
  meetingTitle?: string;
}

export const InviteClientDialog = ({
  open,
  onOpenChange,
  meetingId = "meeting-123",
  meetingTitle = "Initial Consultation"
}: InviteClientDialogProps) => {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientName, setClientName] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("standard");

  const meetingLink = `https://meeting.app/join/${meetingId}`;

  const handleSendEmail = () => {
    if (!clientEmail || !clientName) {
      toast.error("Please fill in client name and email");
      return;
    }
    
    const emailSubject = encodeURIComponent(`Join your ${meetingTitle} meeting`);
    const emailBody = encodeURIComponent(
      customMessage || 
      `Hello ${clientName},\n\nYou are invited to join our upcoming meeting: ${meetingTitle}.\n\nPlease join using this link: ${meetingLink}\n\n${meetingTime ? `Meeting time: ${meetingTime}\n\n` : ''}Thank you!`
    );
    
    window.open(`mailto:${clientEmail}?subject=${emailSubject}&body=${emailBody}`);
    toast.success("Email invitation prepared");
    onOpenChange(false);
  };

  const handleSendSMS = () => {
    if (!clientPhone || !clientName) {
      toast.error("Please fill in client name and phone number");
      return;
    }
    
    const smsBody = encodeURIComponent(
      customMessage || 
      `Hello ${clientName}, you're invited to join our ${meetingTitle} meeting. Join here: ${meetingLink} ${meetingTime ? `at ${meetingTime}` : ''}`
    );
    
    // Open SMS app if on mobile, or use SMS web service
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.open(`sms:${clientPhone}?body=${smsBody}`);
    } else {
      // For desktop, we can copy the message to clipboard
      navigator.clipboard.writeText(smsBody);
      toast.success("SMS message copied to clipboard");
    }
    onOpenChange(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    toast.success("Meeting link copied to clipboard");
  };

  const templates = {
    standard: "Hello [Client Name],\n\nYou are invited to join our upcoming meeting: [Meeting Title].\n\nPlease join using this link: [Meeting Link]\n\n[Meeting Time]\n\nThank you!",
    reminder: "Reminder: Your [Meeting Title] is coming up. Please join using this link: [Meeting Link] [Meeting Time]",
    followUp: "Following up on our previous conversation. I've scheduled a [Meeting Title] for us. Join here: [Meeting Link] [Meeting Time]"
  };

  const applyTemplate = (template: string) => {
    let message = templates[template as keyof typeof templates];
    message = message.replace("[Client Name]", clientName);
    message = message.replace("[Meeting Title]", meetingTitle);
    message = message.replace("[Meeting Link]", meetingLink);
    message = message.replace("[Meeting Time]", meetingTime ? `Meeting time: ${meetingTime}` : "");
    
    setCustomMessage(message);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Client to Meeting</DialogTitle>
          <DialogDescription>
            Send an invitation to your client to join the meeting.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input 
                id="client-name" 
                placeholder="John Doe" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meeting-time">Meeting Time (Optional)</Label>
              <Input 
                id="meeting-time" 
                placeholder="e.g., Monday, July 15 at 3:00 PM" 
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "email" | "sms")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex gap-2">
                <Phone className="h-4 w-4" />
                SMS
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="client-email">Client Email</Label>
                <Input 
                  id="client-email" 
                  placeholder="client@example.com" 
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="sms" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="client-phone">Client Phone Number</Label>
                <Input 
                  id="client-phone" 
                  placeholder="+1 (555) 123-4567" 
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="message-template">Message Template</Label>
              <Select 
                value={selectedTemplate} 
                onValueChange={(value) => {
                  setSelectedTemplate(value);
                  applyTemplate(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Invitation</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="followUp">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Textarea 
              placeholder="Add a personal message for your client..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <div className="flex items-center justify-between mt-4 p-2 bg-muted rounded-md">
            <div className="text-sm">
              <span className="font-medium">Meeting Link:</span>
              <span className="ml-2 text-muted-foreground">{meetingLink}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyLink}
              className="h-8 gap-1"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={activeTab === "email" ? handleSendEmail : handleSendSMS}
            className="gap-2"
          >
            {activeTab === "email" ? (
              <>
                <Mail className="h-4 w-4" />
                Send Email
              </>
            ) : (
              <>
                <Phone className="h-4 w-4" />
                Send SMS
              </>
            )}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
