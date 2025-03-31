
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share, Copy, Mail, Link2, Users } from "lucide-react";
import { copyMeetingLink, shareMeetingViaEmail } from "../utils/sharingUtils";

interface ShareMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
  meetingTitle: string;
}

export const ShareMeetingDialog = ({ 
  isOpen, 
  onClose, 
  meetingId, 
  meetingTitle 
}: ShareMeetingDialogProps) => {
  const [emails, setEmails] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("link");
  
  const handleShareViaEmail = () => {
    const emailList = emails.split(',').map(email => email.trim()).filter(Boolean);
    if (emailList.length === 0) return;
    
    shareMeetingViaEmail(meetingId, meetingTitle, emailList);
    setEmails("");
  };
  
  const handleCopyLink = () => {
    copyMeetingLink(meetingId, meetingTitle);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Meeting
          </DialogTitle>
          <DialogDescription>
            Share meeting notes, agenda and recording with others
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link" className="flex items-center gap-1">
              <Link2 className="h-4 w-4" />
              Copy Link
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">Anyone with the link can access this meeting's details:</p>
                <div className="flex items-center space-x-2">
                  <Input 
                    readOnly 
                    value={window.location.origin + `/meetings/notes-standalone?meeting=${meetingId}`}
                  />
                  <Button type="button" size="sm" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">What attendees will see</p>
                    <p className="text-xs text-muted-foreground">
                      Meeting notes, agenda, and any documents attached to this meeting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emails">Recipient Emails</Label>
                <Input
                  id="emails"
                  placeholder="email1@example.com, email2@example.com"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple email addresses with commas
                </p>
              </div>
              
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium">Email will include:</p>
                <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                  <li>• Meeting title: {meetingTitle}</li>
                  <li>• A link to access meeting resources</li>
                  <li>• Standard template text (customizable in the future)</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="gap-2 sm:gap-0">
          {activeTab === "email" && (
            <Button type="button" onClick={handleShareViaEmail} disabled={!emails.trim()}>
              Send Email
            </Button>
          )}
          
          {activeTab === "link" && (
            <Button type="button" onClick={handleCopyLink}>
              Copy Link
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
