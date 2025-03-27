
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Users, Calendar, Clock, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  provider: "zoom" | "google-meet" | "teamviewer" | "other";
  url: string;
  participants: string[];
}

export const UpcomingMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulating data fetching
  useEffect(() => {
    const loadMeetings = () => {
      setIsLoading(true);
      
      // Mock meetings data
      setTimeout(() => {
        const mockMeetings: Meeting[] = [
          {
            id: "1",
            title: "Client Onboarding Call",
            date: new Date(Date.now() + 3600000), // 1 hour from now
            startTime: "10:00 AM",
            endTime: "11:00 AM",
            provider: "zoom",
            url: "https://zoom.us/j/123456789",
            participants: ["Jane Smith", "John Doe", "Alex Johnson"]
          },
          {
            id: "2",
            title: "Weekly Team Sync",
            date: new Date(Date.now() + 86400000), // 1 day from now
            startTime: "9:00 AM",
            endTime: "10:00 AM",
            provider: "google-meet",
            url: "https://meet.google.com/abc-defg-hij",
            participants: ["Team Alpha", "Team Beta"]
          },
          {
            id: "3",
            title: "Technical Support Session",
            date: new Date(Date.now() + 172800000), // 2 days from now
            startTime: "2:00 PM",
            endTime: "3:30 PM",
            provider: "teamviewer",
            url: "https://teamviewer.com/s/123456789",
            participants: ["Support Team", "Client: ACME Corp"]
          }
        ];
        
        setMeetings(mockMeetings);
        setIsLoading(false);
      }, 1000);
    };
    
    loadMeetings();
  }, []);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getProviderLabel = (provider: Meeting['provider']) => {
    switch(provider) {
      case 'zoom': return 'Zoom';
      case 'google-meet': return 'Google Meet';
      case 'teamviewer': return 'TeamViewer';
      default: return 'Other';
    }
  };
  
  const getProviderColorClass = (provider: Meeting['provider']) => {
    switch(provider) {
      case 'zoom': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'google-meet': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'teamviewer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const joinMeeting = (url: string) => {
    window.open(url, '_blank');
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading meetings...</p>
      </div>
    );
  }
  
  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No upcoming meetings</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          You don't have any scheduled meetings coming up.
        </p>
        <Button onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/eventedit", "_blank")}>
          Schedule a Meeting
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold leading-tight">Upcoming Meetings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{meeting.title}</CardTitle>
                <Badge className={getProviderColorClass(meeting.provider)}>
                  {getProviderLabel(meeting.provider)}
                </Badge>
              </div>
              <CardDescription className="flex items-center mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(meeting.date)}
              </CardDescription>
              <CardDescription className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />
                {meeting.startTime} - {meeting.endTime}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-start mt-1">
                <Users className="h-4 w-4 mr-2 mt-1" />
                <div className="flex flex-wrap gap-1">
                  {meeting.participants.map((participant, index) => (
                    <Badge key={index} variant="outline" className="bg-secondary/20">
                      {participant}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => window.open(`mailto:?subject=${encodeURIComponent(meeting.title)}&body=${encodeURIComponent(`Join our meeting: ${meeting.url}`)}`)}
              >
                Share
              </Button>
              <Button 
                size="sm"
                className="flex items-center space-x-1"
                onClick={() => joinMeeting(meeting.url)}
              >
                <Video className="h-3.5 w-3.5" />
                <span>Join Meeting</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
