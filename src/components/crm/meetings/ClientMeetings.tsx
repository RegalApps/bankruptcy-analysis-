
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Calendar as CalendarIcon, Video, FileText, MessageSquare, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";

interface ClientMeetingsProps {
  clientName: string;
}

export const ClientMeetings = ({ clientName }: ClientMeetingsProps) => {
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState("");
  
  // Mock meetings data
  const upcomingMeetings = [
    { 
      id: "1", 
      title: "Initial Consultation", 
      date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      time: "10:00 AM", 
      duration: "45 minutes",
      type: "video",
      status: "confirmed"
    },
    { 
      id: "2", 
      title: "Financial Review", 
      date: new Date(Date.now() + 345600000).toISOString(), // 4 days later
      time: "2:30 PM", 
      duration: "60 minutes",
      type: "in-person",
      status: "pending"
    }
  ];

  const pastMeetings = [
    { 
      id: "3", 
      title: "Document Review", 
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      time: "11:15 AM", 
      duration: "30 minutes",
      type: "video",
      status: "completed",
      hasNotes: true
    },
    { 
      id: "4", 
      title: "Introductory Call", 
      date: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      time: "3:00 PM", 
      duration: "15 minutes",
      type: "phone",
      status: "completed",
      hasNotes: false
    }
  ];

  const handleJoinMeeting = (meetingId: string) => {
    setIsJoinDialogOpen(true);
    // In a real app, this would prepare the meeting join URL or connection
  };

  const handleViewNotes = (meetingId: string) => {
    // In a real app, fetch notes for this meeting ID
    setMeetingNotes("Client expressed interest in debt consolidation options. Need to prepare Form 47 and review at next meeting. Follow up with documentation request by email.");
    setIsNotesDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meetings with {clientName}</h2>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMeetings.length === 0 ? (
            <Card className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No Upcoming Meetings</h3>
              <p className="text-muted-foreground">Schedule a meeting with {clientName}.</p>
              <Button className="mt-4">Schedule Now</Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingMeetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">{meeting.title}</h3>
                          <Badge variant={meeting.status === "confirmed" ? "default" : "outline"}>
                            {meeting.status === "confirmed" ? "Confirmed" : "Pending"}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatDate(meeting.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{meeting.time} ({meeting.duration})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            <span>{meeting.type === "video" ? "Video Call" : meeting.type === "phone" ? "Phone Call" : "In-Person"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          Agenda
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleJoinMeeting(meeting.id)}
                        >
                          <Video className="h-4 w-4" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastMeetings.length === 0 ? (
            <Card className="p-6 text-center">
              <h3 className="text-lg font-medium">No Past Meetings</h3>
              <p className="text-muted-foreground">You haven't had any meetings with {clientName} yet.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pastMeetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">{meeting.title}</h3>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                        <div className="text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatDate(meeting.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{meeting.time} ({meeting.duration})</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {meeting.hasNotes ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleViewNotes(meeting.id)}
                          >
                            <FileText className="h-4 w-4" />
                            View Notes
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            Add Notes
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Feedback
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-1">Total Meetings</h3>
                  <p className="text-2xl font-bold">{pastMeetings.length + upcomingMeetings.length}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-1">Avg. Duration</h3>
                  <p className="text-2xl font-bold">37.5 min</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-1">Completion Rate</h3>
                  <p className="text-2xl font-bold">100%</p>
                </div>
              </div>
              
              <div className="mt-6 text-center p-6 border rounded-lg">
                <p className="text-muted-foreground">Detailed analytics visualization will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Join Meeting Dialog */}
      <Sheet open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Join Meeting</SheetTitle>
            <SheetDescription>
              You're about to join a meeting with {clientName}.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-6">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Initial Consultation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Scheduled for today at 10:00 AM (45 minutes)
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Meeting Options</h4>
              <div className="flex flex-col gap-3">
                <Button className="justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Join with Video
                </Button>
                <Button variant="outline" className="justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Join with Audio Only
                </Button>
              </div>
            </div>
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
              Cancel
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Meeting Notes Dialog */}
      <Sheet open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Meeting Notes</SheetTitle>
            <SheetDescription>
              Notes from your meeting with {clientName}.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-6">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Document Review</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(pastMeetings[0].date)} at {pastMeetings[0].time}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Notes</h4>
              <div className="border rounded-md p-4">
                <p className="whitespace-pre-wrap">{meetingNotes}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Edit Notes</h4>
              <Textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                className="h-32"
              />
            </div>
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
              Close
            </Button>
            <Button>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
