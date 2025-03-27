
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Users, Calendar, Clock, ExternalLink, Search, Filter, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { HotkeysProvider, useHotkeys } from "@/hooks/useHotkeys";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  provider: "zoom" | "google-meet" | "teamviewer" | "other";
  url: string;
  participants: string[];
  description?: string;
  organizer?: string;
}

export const UpcomingMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);
  const { toast } = useToast();
  
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
            participants: ["Jane Smith", "John Doe", "Alex Johnson"],
            description: "Introduction call with new client to discuss their needs and set expectations.",
            organizer: "Jane Smith"
          },
          {
            id: "2",
            title: "Weekly Team Sync",
            date: new Date(Date.now() + 86400000), // 1 day from now
            startTime: "9:00 AM",
            endTime: "10:00 AM",
            provider: "google-meet",
            url: "https://meet.google.com/abc-defg-hij",
            participants: ["Team Alpha", "Team Beta"],
            description: "Regular team synchronization meeting to discuss progress and blockers.",
            organizer: "Team Lead"
          },
          {
            id: "3",
            title: "Technical Support Session",
            date: new Date(Date.now() + 172800000), // 2 days from now
            startTime: "2:00 PM",
            endTime: "3:30 PM",
            provider: "teamviewer",
            url: "https://teamviewer.com/s/123456789",
            participants: ["Support Team", "Client: ACME Corp"],
            description: "Technical support session to resolve client's issues with our software.",
            organizer: "Support Manager"
          },
          {
            id: "4",
            title: "Product Demo",
            date: new Date(Date.now() + 259200000), // 3 days from now
            startTime: "11:00 AM",
            endTime: "12:00 PM",
            provider: "zoom",
            url: "https://zoom.us/j/987654321",
            participants: ["Sales Team", "Potential Client", "Product Manager"],
            description: "Product demonstration for a potential client showcasing our latest features.",
            organizer: "Sales Director"
          },
          {
            id: "5",
            title: "Strategic Planning",
            date: new Date(Date.now() + 345600000), // 4 days from now
            startTime: "1:00 PM",
            endTime: "3:00 PM",
            provider: "google-meet",
            url: "https://meet.google.com/jkl-mnop-qrs",
            participants: ["Executive Team", "Department Heads"],
            description: "Strategic planning session to align on quarterly objectives and key results.",
            organizer: "CEO"
          }
        ];
        
        setMeetings(mockMeetings);
        setFilteredMeetings(mockMeetings);
        setIsLoading(false);
      }, 1000);
    };
    
    loadMeetings();
  }, []);
  
  // Filter meetings based on search query and selected provider
  useEffect(() => {
    let result = meetings;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(meeting => 
        meeting.title.toLowerCase().includes(query) || 
        meeting.participants.some(p => p.toLowerCase().includes(query))
      );
    }
    
    if (selectedProvider) {
      result = result.filter(meeting => meeting.provider === selectedProvider);
    }
    
    setFilteredMeetings(result);
  }, [searchQuery, selectedProvider, meetings]);
  
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
  
  const joinMeeting = (meeting: Meeting) => {
    toast({
      title: "Joining Meeting",
      description: `Opening ${getProviderLabel(meeting.provider)} meeting...`,
    });
    window.open(meeting.url, '_blank');
  };

  const copyMeetingLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Meeting link copied to clipboard.",
    });
  };

  const shareMeeting = (meeting: Meeting) => {
    const subject = encodeURIComponent(meeting.title);
    const body = encodeURIComponent(`Join our meeting: ${meeting.url}\n\nDate: ${formatDate(meeting.date)}\nTime: ${meeting.startTime} - ${meeting.endTime}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Keyboard shortcut handler
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const searchInput = document.getElementById('meeting-search');
      if (searchInput) {
        searchInput.focus();
      }
    }
  }, []);

  // Register hotkeys
  useHotkeys("shift+j", () => {
    if (filteredMeetings.length > 0) {
      joinMeeting(filteredMeetings[0]);
    }
  }, [filteredMeetings]);

  useHotkeys("shift+c", () => {
    if (filteredMeetings.length > 0) {
      copyMeetingLink(filteredMeetings[0].url);
    }
  }, [filteredMeetings]);

  useHotkeys("shift+s", () => {
    if (filteredMeetings.length > 0) {
      shareMeeting(filteredMeetings[0]);
    }
  }, [filteredMeetings]);
  
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
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold leading-tight">Upcoming Meetings</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="meeting-search"
              type="search"
              placeholder="Search meetings... (⌘/Ctrl + /)"
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <h4 className="font-medium mb-2">Platform</h4>
              <div className="space-y-2">
                <Button 
                  variant={selectedProvider === null ? "default" : "outline"} 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setSelectedProvider(null)}
                >
                  All platforms
                </Button>
                <Button 
                  variant={selectedProvider === "zoom" ? "default" : "outline"} 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setSelectedProvider("zoom")}
                >
                  Zoom
                </Button>
                <Button 
                  variant={selectedProvider === "google-meet" ? "default" : "outline"} 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setSelectedProvider("google-meet")}
                >
                  Google Meet
                </Button>
                <Button 
                  variant={selectedProvider === "teamviewer" ? "default" : "outline"} 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setSelectedProvider("teamviewer")}
                >
                  TeamViewer
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-muted/20 rounded-lg">
          <Search className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No meetings found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try changing your search or filter criteria.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedProvider(null);
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMeetings.map((meeting) => (
              <Card 
                key={meeting.id} 
                className="overflow-hidden group hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                      {meeting.title}
                    </CardTitle>
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
                      {meeting.participants.slice(0, 3).map((participant, index) => (
                        <Badge key={index} variant="outline" className="bg-secondary/20">
                          {participant}
                        </Badge>
                      ))}
                      {meeting.participants.length > 3 && (
                        <Badge variant="outline" className="bg-secondary/20">
                          +{meeting.participants.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs flex items-center gap-1"
                      onClick={() => copyMeetingLink(meeting.url)}
                      title="Copy link (Shift+C)"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs flex items-center gap-1"
                      onClick={() => shareMeeting(meeting)}
                      title="Share (Shift+S)"
                    >
                      Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs flex items-center gap-1"
                      onClick={() => setOpenDetailsId(meeting.id)}
                    >
                      Details
                    </Button>
                  </div>
                  <Button 
                    size="sm"
                    className="flex items-center space-x-1"
                    onClick={() => joinMeeting(meeting)}
                    title="Join meeting (Shift+J)"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Join</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-4 p-2 bg-muted/30 rounded text-sm text-muted-foreground">
            <p className="font-medium">Keyboard shortcuts:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-1">
              <li><kbd className="px-1 rounded border">⌘ /</kbd> or <kbd className="px-1 rounded border">Ctrl /</kbd> - Focus search</li>
              <li><kbd className="px-1 rounded border">Shift + J</kbd> - Join first meeting</li>
              <li><kbd className="px-1 rounded border">Shift + C</kbd> - Copy first meeting link</li>
              <li><kbd className="px-1 rounded border">Shift + S</kbd> - Share first meeting</li>
            </ul>
          </div>
        </>
      )}

      {/* Meeting details dialog */}
      {filteredMeetings.map(meeting => (
        <Dialog 
          key={`dialog-${meeting.id}`}
          open={openDetailsId === meeting.id} 
          onOpenChange={(open) => {
            if (!open) setOpenDetailsId(null);
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{meeting.title}</DialogTitle>
              <DialogDescription>
                <Badge className={`mt-2 ${getProviderColorClass(meeting.provider)}`}>
                  {getProviderLabel(meeting.provider)}
                </Badge>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {meeting.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{meeting.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Date</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(meeting.date)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Time</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {meeting.startTime} - {meeting.endTime}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Participants</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {meeting.participants.map((participant, index) => (
                    <Badge key={index} variant="outline" className="bg-secondary/20">
                      {participant}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {meeting.organizer && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Organizer</h4>
                  <p className="text-sm text-muted-foreground">{meeting.organizer}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-1">Meeting Link</h4>
                <div className="flex items-center mt-1">
                  <Input value={meeting.url} readOnly />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => copyMeetingLink(meeting.url)}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={() => shareMeeting(meeting)}
              >
                Share
              </Button>
              <Button 
                onClick={() => {
                  joinMeeting(meeting);
                  setOpenDetailsId(null);
                }}
              >
                <Video className="h-4 w-4 mr-2" />
                Join Meeting
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};
