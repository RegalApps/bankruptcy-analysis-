
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Link, UserPlus, Link2 } from "lucide-react";

export const JoinMeetingPanel = () => {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [meetingPassword, setMeetingPassword] = useState("");
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const { toast } = useToast();
  
  const handleJoinWithUrl = () => {
    if (!meetingUrl) {
      toast({
        title: "Missing Information",
        description: "Please enter a meeting URL",
        variant: "destructive"
      });
      return;
    }
    
    // Validate URL format
    try {
      new URL(meetingUrl);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid meeting URL",
        variant: "destructive"
      });
      return;
    }
    
    // Open the meeting URL in a new tab
    window.open(meetingUrl, "_blank");
    
    toast({
      title: "Joining Meeting",
      description: "Opening the meeting link in a new tab",
    });
  };
  
  const handleJoinWithId = () => {
    if (!meetingId) {
      toast({
        title: "Missing Information",
        description: "Please enter a meeting ID",
        variant: "destructive"
      });
      return;
    }
    
    if (!name) {
      toast({
        title: "Missing Information",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    
    let url: string;
    
    // Detect meeting service based on ID format
    if (meetingId.includes("-")) {
      // Likely Google Meet
      url = `https://meet.google.com/${meetingId}`;
    } else if (meetingId.length >= 9 && meetingId.length <= 11 && /^\d+$/.test(meetingId)) {
      // Likely Zoom
      url = `https://zoom.us/j/${meetingId}${meetingPassword ? `?pwd=${meetingPassword}` : ''}`;
    } else {
      // Generic format
      url = `https://zoom.us/j/${meetingId}${meetingPassword ? `?pwd=${meetingPassword}` : ''}`;
    }
    
    window.open(url, "_blank");
    
    toast({
      title: "Joining Meeting",
      description: "Opening the meeting in a new tab",
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold leading-tight">Join a Meeting</h2>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-primary" />
            <CardTitle>Join Meeting</CardTitle>
          </div>
          <CardDescription>
            Enter a meeting URL or ID to join an existing meeting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span>Join with URL</span>
              </TabsTrigger>
              <TabsTrigger value="id" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Join with ID</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-url">Meeting URL</Label>
                <Input
                  id="meeting-url"
                  placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-xyz-123"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="id" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meeting-id">Meeting ID</Label>
                <Input
                  id="meeting-id"
                  placeholder="123 456 7890 or abc-defg-hij"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meeting-password">Password (Optional)</Label>
                <Input
                  id="meeting-password"
                  placeholder="Enter meeting password if required"
                  value={meetingPassword}
                  onChange={(e) => setMeetingPassword(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={activeTab === "url" ? handleJoinWithUrl : handleJoinWithId} className="w-full sm:w-auto">
            Join Meeting
          </Button>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                <Link2 className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-center text-base">Join Zoom</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open("https://zoom.us/join", "_blank")}
            >
              Open Zoom
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center">
              <div className="p-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <Video className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-center text-base">Google Meet</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open("https://meet.google.com", "_blank")}
            >
              Open Meet
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center">
              <div className="p-2 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                <Link2 className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-center text-base">TeamViewer</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open("https://www.teamviewer.com/en-us/download/", "_blank")}
            >
              Open TeamViewer
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
