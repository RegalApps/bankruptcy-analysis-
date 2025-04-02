
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MeetingDetailDialog } from "./MeetingDetailDialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ClientMeetingsProps {
  clientName?: string;
}

export const ClientMeetings = ({ clientName = "Client" }: ClientMeetingsProps) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<{
    id: string;
    title: string;
    date: string;
    clientName: string;
    type?: string;
    duration?: string;
    description?: string;
    status?: string;
  } | null>(null);

  // Mock data for upcoming meetings
  const upcomingMeetings = [
    {
      id: "meet-1",
      title: "Initial Consultation",
      date: "2025-07-15T10:00:00",
      time: "10:00 AM",
      duration: "45 minutes",
      clientName: clientName,
      type: "video",
      status: "confirmed",
      participants: ["Jane Smith (Trustee)", clientName],
      description: "Initial consultation to discuss financial situation and explore available options. Will need to gather basic information about debts, income, and assets."
    },
    {
      id: "meet-2",
      title: "Document Review Session",
      date: "2025-07-18T14:30:00",
      time: "2:30 PM",
      duration: "60 minutes",
      clientName: clientName,
      type: "in-person",
      status: "tentative",
      participants: ["John Doe (Legal Advisor)", "Jane Smith (Trustee)", clientName],
      description: "Review all required documentation including income verification, asset statements, and credit reports. Explain next steps in the process."
    }
  ];

  // Mock data for past meetings
  const pastMeetings = [
    {
      id: "past-1",
      title: "Initial Contact",
      date: "2025-03-01T11:00:00",
      time: "11:00 AM",
      duration: "30 minutes",
      clientName: clientName,
      type: "phone",
      status: "completed",
      hasNotes: true,
      hasRecording: false,
      description: "First contact with client to briefly discuss their financial situation and schedule an in-depth consultation."
    },
    {
      id: "past-2",
      title: "Financial Assessment",
      date: "2025-03-05T15:00:00",
      time: "3:00 PM",
      duration: "45 minutes",
      clientName: clientName,
      type: "video",
      status: "completed",
      hasNotes: true,
      hasRecording: true,
      hasFeedback: false,
      description: "Detailed financial assessment covering income sources, debt obligations, and potential consumer proposal options."
    }
  ];

  const handleJoinMeeting = (meetingId: string) => {
    const meeting = upcomingMeetings.find(m => m.id === meetingId);
    if (meeting) {
      setSelectedMeeting({
        id: meeting.id,
        title: meeting.title,
        date: meeting.date,
        clientName: meeting.clientName,
        type: meeting.type,
        duration: meeting.duration,
        description: meeting.description
      });
      setIsJoinDialogOpen(true);
    }
  };

  const handleViewDetails = (meetingId: string, isPast: boolean = false) => {
    const meetingList = isPast ? pastMeetings : upcomingMeetings;
    const meeting = meetingList.find(m => m.id === meetingId);
    if (meeting) {
      setSelectedMeeting({
        id: meeting.id,
        title: meeting.title,
        date: meeting.date,
        clientName: meeting.clientName,
        type: meeting.type,
        duration: meeting.duration,
        description: meeting.description,
        status: meeting.status
      });
      setIsDetailDialogOpen(true);
    }
  };

  const joinMeeting = () => {
    // In a real app, this would connect to a meeting service
    toast.success("Joining meeting...");
    setIsJoinDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Meetings</h2>
          <p className="text-muted-foreground">Schedule and manage meetings with {clientName}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingMeetings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMeetings.map((meeting) => (
                <Card key={meeting.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant={meeting.status === "confirmed" ? "default" : "outline"} className="mb-2">
                        {meeting.status === "confirmed" ? "Confirmed" : "Tentative"}
                      </Badge>
                      <Badge variant="outline" className="bg-primary/5">
                        {meeting.type === "video" ? "Video" : meeting.type === "in-person" ? "In-person" : "Phone"}
                      </Badge>
                    </div>
                    <CardTitle>{meeting.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>
                          {new Date(meeting.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{meeting.time} ({meeting.duration})</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
                      <Label>Participants</Label>
                      <div className="text-sm space-y-1">
                        {meeting.participants.map((participant, i) => (
                          <div key={i} className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span>{participant}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(meeting.id)}
                    >
                      Details
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleJoinMeeting(meeting.id)}
                      disabled={new Date(meeting.date).getTime() > Date.now() + 1000 * 60 * 10} // Enable 10 minutes before
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-card/50">
              <h3 className="font-medium mb-2">No upcoming meetings</h3>
              <p className="text-muted-foreground mb-4">Schedule a meeting with {clientName}</p>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastMeetings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastMeetings.map((meeting) => (
                <Card key={meeting.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2 bg-muted">
                        Completed
                      </Badge>
                      <Badge variant="outline" className="bg-primary/5">
                        {meeting.type === "video" ? "Video" : meeting.type === "in-person" ? "In-person" : "Phone"}
                      </Badge>
                    </div>
                    <CardTitle>{meeting.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>
                          {new Date(meeting.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{meeting.time} ({meeting.duration})</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
                      <Label>Meeting resources</Label>
                      <div className="text-sm space-y-1">
                        {meeting.hasNotes && (
                          <div className="flex items-center">
                            <FileText className="h-3.5 w-3.5 mr-1 text-blue-500" />
                            <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => handleViewDetails(meeting.id, true)}>
                              Meeting notes
                            </span>
                          </div>
                        )}
                        {meeting.hasRecording && (
                          <div className="flex items-center">
                            <Video className="h-3.5 w-3.5 mr-1 text-blue-500" />
                            <span className="text-blue-500 cursor-pointer hover:underline">
                              Recording
                            </span>
                          </div>
                        )}
                        {'hasFeedback' in meeting && (
                          <div className="flex items-center">
                            {meeting.hasFeedback ? (
                              <>
                                <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                                <span>Feedback received</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3.5 w-3.5 mr-1 text-amber-500" />
                                <span className="text-amber-500">Feedback pending</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(meeting.id, true)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-card/50">
              <h3 className="font-medium mb-2">No past meetings</h3>
              <p className="text-muted-foreground">Previous meetings with {clientName} will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Join Meeting Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Meeting</DialogTitle>
            <CardDescription>
              You are about to join a meeting with {selectedMeeting?.clientName}
            </CardDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Meeting details</Label>
              <div className="text-sm space-y-1">
                <div className="font-medium">{selectedMeeting?.title}</div>
                <div className="text-muted-foreground">
                  {selectedMeeting?.date && new Date(selectedMeeting.date).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="meeting-url">Meeting URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="meeting-url" 
                  value="https://meeting.example.com/join/12345"
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline" size="sm" className="shrink-0" onClick={() => {
                  navigator.clipboard.writeText("https://meeting.example.com/join/12345");
                  toast.success("Meeting URL copied to clipboard");
                }}>
                  Copy
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>Cancel</Button>
            <Button onClick={joinMeeting}>Join Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meeting Detail Dialog */}
      <MeetingDetailDialog 
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        meeting={selectedMeeting}
      />
    </div>
  );
};
