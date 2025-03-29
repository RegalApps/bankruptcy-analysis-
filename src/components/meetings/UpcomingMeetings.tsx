
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Video, Clock, Clipboard, ArrowRight, Link, User, MoreHorizontal } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface MeetingProps {
  id: string;
  title: string;
  time: string;
  date: Date;
  duration: string;
  attendees: string[];
  type: string;
  isExternal?: boolean;
  platform?: string;
  link?: string;
}

export const UpcomingMeetings = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [activeDialog, setActiveDialog] = useState<MeetingProps | null>(null);
  const { toast } = useToast();
  
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  // Mock data for meetings
  const meetings: MeetingProps[] = [
    {
      id: "1",
      title: "Client Intake: Josh Hart",
      time: "10:00 AM",
      date: today,
      duration: "45 minutes",
      attendees: ["Josh Hart", "Sarah Johnson"],
      type: "Initial Consultation",
      platform: "Google Meet"
    },
    {
      id: "2",
      title: "Document Review: Form 47",
      time: "1:30 PM",
      date: today,
      duration: "30 minutes",
      attendees: ["Josh Hart", "John Smith", "Maria Garcia"],
      type: "Document Review"
    },
    {
      id: "3",
      title: "Weekly Team Sync",
      time: "9:00 AM",
      date: tomorrow,
      duration: "60 minutes",
      attendees: ["All Staff"],
      type: "Internal Meeting"
    },
    {
      id: "4",
      title: "Financial Planning Session",
      time: "11:00 AM",
      date: tomorrow,
      duration: "60 minutes",
      attendees: ["Maria Garcia", "Sarah Johnson"],
      type: "Client Meeting",
      isExternal: true,
      platform: "Zoom",
      link: "https://zoom.us/j/123456789"
    }
  ];
  
  const todayMeetings = meetings.filter(meeting => isSameDay(meeting.date, today));
  const tomorrowMeetings = meetings.filter(meeting => isSameDay(meeting.date, tomorrow));
  const upcomingMeetings = meetings.filter(meeting => !isSameDay(meeting.date, today) && !isSameDay(meeting.date, tomorrow));
  
  const handleJoinMeeting = (meeting: MeetingProps) => {
    // In a real app, this would open the appropriate meeting link
    const meetingUrl = meeting.link || "https://meet.google.com";
    window.open(meetingUrl, "_blank");
    
    toast({
      title: "Joining meeting",
      description: `Opening ${meeting.title} in a new window`,
    });
  };
  
  const handleCopyMeetingDetails = (meeting: MeetingProps) => {
    const details = `
Meeting: ${meeting.title}
Date: ${format(meeting.date, "PPP")}
Time: ${meeting.time}
Duration: ${meeting.duration}
Type: ${meeting.type}
Platform: ${meeting.platform || "Internal Meeting System"}
Attendees: ${meeting.attendees.join(", ")}
    `;
    
    navigator.clipboard.writeText(details.trim());
    
    toast({
      title: "Meeting details copied",
      description: "Meeting information has been copied to clipboard",
    });
  };
  
  const renderMeetingCard = (meeting: MeetingProps) => (
    <Card key={meeting.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{meeting.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {meeting.time} • {meeting.duration}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Meeting Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveDialog(meeting)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyMeetingDetails(meeting)}>
                Copy Meeting Info
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleJoinMeeting(meeting)}>
                Join Meeting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mt-1">
          {meeting.attendees.map((attendee, index) => (
            <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
              <User className="h-3 w-3" />
              {attendee}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-1 justify-between">
        <span className="text-xs text-muted-foreground flex items-center">
          {meeting.isExternal ? (
            <>
              <Link className="h-3 w-3 mr-1" />
              {meeting.platform}
            </>
          ) : (
            <>
              <Video className="h-3 w-3 mr-1" />
              {meeting.type}
            </>
          )}
        </span>
        <Button 
          size="sm" 
          className="h-8"
          onClick={() => handleJoinMeeting(meeting)}
        >
          Join
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Upcoming Meetings</h2>
          <p className="text-sm text-muted-foreground">
            View and join your scheduled meetings
          </p>
        </div>
        
        <Button onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/eventedit", "_blank")}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">
            Today <span className="ml-1 text-xs bg-primary/20 px-1.5 rounded-full">{todayMeetings.length}</span>
          </TabsTrigger>
          <TabsTrigger value="tomorrow">
            Tomorrow <span className="ml-1 text-xs bg-primary/20 px-1.5 rounded-full">{tomorrowMeetings.length}</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-4">
          {todayMeetings.length > 0 ? (
            todayMeetings.map(renderMeetingCard)
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No meetings scheduled for today</p>
                <Button className="mt-4" variant="outline" onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/eventedit", "_blank")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="tomorrow" className="space-y-4">
          {tomorrowMeetings.length > 0 ? (
            tomorrowMeetings.map(renderMeetingCard)
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No meetings scheduled for tomorrow</p>
                <Button className="mt-4" variant="outline" onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/eventedit", "_blank")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map(renderMeetingCard)
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No upcoming meetings scheduled</p>
                <Button className="mt-4" variant="outline" onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/eventedit", "_blank")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!activeDialog} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md">
          {activeDialog && (
            <>
              <DialogHeader>
                <DialogTitle>{activeDialog.title}</DialogTitle>
                <DialogDescription>
                  {format(activeDialog.date, "PPPP")} at {activeDialog.time}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">Duration</h4>
                    <p className="text-sm text-muted-foreground">{activeDialog.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <h4 className="text-sm font-medium">Attendees</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activeDialog.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {attendee.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{attendee}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {activeDialog.isExternal && (
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <h4 className="text-sm font-medium">Platform</h4>
                      <p className="text-sm text-muted-foreground">{activeDialog.platform}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">Meeting Type</h4>
                    <p className="text-sm text-muted-foreground">{activeDialog.type}</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex sm:justify-between sm:space-x-0">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => handleCopyMeetingDetails(activeDialog)}
                >
                  <Clipboard className="h-4 w-4" />
                  Copy Details
                </Button>
                <Button 
                  className="flex items-center gap-1"
                  onClick={() => {
                    handleJoinMeeting(activeDialog);
                    setActiveDialog(null);
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                  Join Meeting
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
