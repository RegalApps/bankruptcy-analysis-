
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Video, Link, Calendar, Users, ArrowRight, Check, Clipboard, Settings } from "lucide-react";

export const JoinMeetingPanel = () => {
  const [meetingCode, setMeetingCode] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [activeTab, setActiveTab] = useState("code");
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleJoinWithCode = () => {
    if (!meetingCode.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a meeting code to continue",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedMeeting(`Meeting #${meetingCode}`);
    setShowJoinDialog(true);
  };

  const handleJoinWithLink = () => {
    if (!meetingLink.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a meeting link to continue",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Basic URL validation
      new URL(meetingLink);
      setSelectedMeeting("External meeting");
      setShowJoinDialog(true);
    } catch (e) {
      toast({
        title: "Invalid link",
        description: "Please enter a valid meeting URL",
        variant: "destructive",
      });
    }
  };

  const handleJoinMeeting = () => {
    setShowJoinDialog(false);
    
    // Open a simulated meeting URL
    window.open("https://meet.google.com", "_blank");
    
    toast({
      title: "Joining meeting",
      description: "Opening meeting in a new window",
    });
  };

  const handleCopyInvite = () => {
    const inviteText = `Join our meeting using code: ${meetingCode || "12345"}
Meeting link: https://meet.example.com/${meetingCode || "abcde"}
Date & Time: ${new Date().toLocaleString()}`;

    navigator.clipboard.writeText(inviteText);
    
    toast({
      title: "Invite copied",
      description: "Meeting invite details copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="code" className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            Join with Code
          </TabsTrigger>
          <TabsTrigger value="link" className="flex items-center gap-1">
            <Link className="h-4 w-4" />
            Join with Link
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Schedule Meeting
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Join with Meeting Code</CardTitle>
              <CardDescription>
                Enter the meeting code provided by the meeting organizer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Enter meeting code (e.g., 123-456-789)"
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                  />
                </div>
                <Button onClick={handleJoinWithCode} className="w-full">
                  Join Meeting
                </Button>
              </div>
              
              <Card className="bg-muted/40">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-2">Recent Meetings</h3>
                  <div className="space-y-2">
                    {["Weekly Team Sync", "Client Consultation: Josh Hart", "Financial Review"].map((meeting, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 bg-background rounded cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => {
                          setSelectedMeeting(meeting);
                          setShowJoinDialog(true);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-primary" />
                          <span>{meeting}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCopyInvite} className="flex items-center gap-1">
                <Clipboard className="h-4 w-4" />
                Copy Invite
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Meeting Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="link" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Join with Meeting Link</CardTitle>
              <CardDescription>
                Enter a meeting URL from any video conferencing service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Enter meeting URL (e.g., https://meet.example.com/abcde)"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>
                <Button onClick={handleJoinWithLink} className="w-full">
                  Join Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule a Meeting</CardTitle>
              <CardDescription>
                Create a new meeting and invite participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button 
                  onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/eventedit", "_blank")}
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule in Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join {selectedMeeting}</DialogTitle>
            <DialogDescription>
              Choose how you want to join this meeting
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <h3 className="text-sm font-medium">Video and Audio</h3>
                <p className="text-xs text-muted-foreground">Join with camera and microphone</p>
              </div>
              <Button size="sm" onClick={handleJoinMeeting}>Join</Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <h3 className="text-sm font-medium">Audio Only</h3>
                <p className="text-xs text-muted-foreground">Join with microphone only</p>
              </div>
              <Button size="sm" variant="outline" onClick={handleJoinMeeting}>Join</Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
