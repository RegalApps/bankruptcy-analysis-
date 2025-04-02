
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  Plus, 
  Video, 
  FileText, 
  Mic, 
  MicOff, 
  Download, 
  Save, 
  Copy,
  Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Mock interfaces for type safety
interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: string;
  hasNotes?: boolean;
}

interface ClientMeetingsProps {
  clientName: string;
}

export const ClientMeetings = ({ clientName }: ClientMeetingsProps) => {
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [activeTranscriptionTab, setActiveTranscriptionTab] = useState("transcription");
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showAgendaDialog, setShowAgendaDialog] = useState(false);
  const [agendaItems, setAgendaItems] = useState([
    { id: '1', text: 'Introduction and status update', completed: false, timeEstimate: '5 min' },
    { id: '2', text: 'Review of financial documents', completed: false, timeEstimate: '15 min' },
    { id: '3', text: 'Discussion of options and next steps', completed: false, timeEstimate: '20 min' },
    { id: '4', text: 'Questions and closing', completed: false, timeEstimate: '10 min' },
  ]);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const { toast } = useToast();
  
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
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate generating summary and action items
      generateSummary();
      toast({
        title: "Recording stopped",
        description: "Transcription complete. Summary and action items generated.",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Meeting transcription is now in progress.",
      });
      // Simulate real-time transcription
      simulateTranscription();
    }
  };
  
  const simulateTranscription = () => {
    // This is a simulation - in a real app, this would connect to a transcription API
    const transcripts = [
      `${clientName}: I'm considering the different options we discussed last time.`,
      "You: That's great. Have you had a chance to review the documents I sent?",
      `${clientName}: Yes, I have some questions about the form requirements.`,
      "You: Let's go through them one by one. Which section was unclear?",
      `${clientName}: The section about assets and liabilities was confusing.`,
      "You: I can explain that in more detail. Let me walk you through how to complete it properly.",
      `${clientName}: That would be helpful. Also, what's the timeline once I submit everything?`,
      "You: Once all documents are submitted, we typically process within 7-10 business days.",
    ];
    
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < transcripts.length && isRecording) {
        setTranscription(prev => prev + transcripts[currentIndex] + "\n\n");
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 3000);
  };
  
  const generateSummary = () => {
    // Simulate AI processing delay
    setTimeout(() => {
      setSummary(
        `Meeting with ${clientName} focused on reviewing previously discussed options and clarifying documentation requirements, particularly the assets and liabilities section. Client is preparing to submit forms and inquired about processing timeline (7-10 business days after submission).`
      );
      
      setActionItems([
        "Send simplified guide for completing the assets and liabilities section",
        "Follow up with timeline confirmation email",
        "Schedule check-in call in 5 days to verify document submission progress",
        "Prepare for processing in approximately 7-10 business days"
      ]);
    }, 1500);
  };

  const handleSaveTranscription = () => {
    // In a real app, this would save to a database
    toast({
      title: "Transcription saved",
      description: "Meeting transcription has been saved to client records.",
    });
  };

  const handleCopyTranscription = () => {
    navigator.clipboard.writeText(transcription);
    toast({
      description: "Transcription copied to clipboard.",
    });
  };

  const handleDownloadTranscription = () => {
    // Create a text file with the transcription
    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-with-${clientName.replace(/\s+/g, '-').toLowerCase()}-transcription.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      description: "Transcription downloaded as text file.",
    });
  };

  const handleToggleAgendaItem = (id: string) => {
    setAgendaItems(
      agendaItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleRequestFeedback = () => {
    setShowFeedbackDialog(true);
  };

  const handleSubmitFeedback = () => {
    toast({
      title: "Feedback submitted",
      description: "Thank you for providing your feedback.",
    });
    setShowFeedbackDialog(false);
  };

  const handleViewAgenda = () => {
    setShowAgendaDialog(true);
  };

  const calculateAgendaProgress = () => {
    const completedCount = agendaItems.filter(item => item.completed).length;
    return agendaItems.length > 0 ? Math.round((completedCount / agendaItems.length) * 100) : 0;
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
                            <Calendar className="h-4 w-4" />
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
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={handleViewAgenda}
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
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(meeting.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{meeting.time} ({meeting.duration})</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
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
                            onClick={() => handleViewNotes(meeting.id)}
                          >
                            <FileText className="h-4 w-4" />
                            Add Notes
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={handleRequestFeedback}
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

      {/* Transcription and Recording Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Meeting Transcription</span>
            <Button 
              variant={isRecording ? "destructive" : "default"}
              size="sm"
              onClick={toggleRecording}
              className="flex items-center gap-1"
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRecording && (
            <div className="bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
              Recording in progress...
            </div>
          )}
          
          <Tabs value={activeTranscriptionTab} onValueChange={setActiveTranscriptionTab}>
            <TabsList>
              <TabsTrigger value="transcription">Transcription</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="action-items">Action Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transcription" className="mt-4">
              <div className="border rounded-md p-4 min-h-[200px] max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {transcription ? transcription : (
                  <span className="text-muted-foreground">
                    {isRecording ? "Recording in progress. Transcription will appear here..." : 
                      "Click 'Start Recording' to begin transcribing the meeting."}
                  </span>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="summary" className="mt-4">
              <div className="border rounded-md p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
                {summary ? summary : (
                  <span className="text-muted-foreground">
                    {isRecording ? "Summary will be generated when recording stops." : 
                      "Record a meeting to generate an AI summary."}
                  </span>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="action-items" className="mt-4">
              <div className="border rounded-md p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
                {actionItems.length > 0 ? (
                  <ul className="space-y-2">
                    {actionItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                          {index + 1}
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground">
                    {isRecording ? "Action items will be identified when recording stops." : 
                      "Record a meeting to generate action items."}
                  </span>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {(transcription || summary || actionItems.length > 0) && (
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyTranscription}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadTranscription}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button 
                size="sm"
                onClick={handleSaveTranscription}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
            <Button onClick={() => {
              toast({
                description: "Notes saved successfully.",
              });
              setIsNotesDialogOpen(false);
            }}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Meeting Agenda Dialog */}
      <Dialog open={showAgendaDialog} onOpenChange={setShowAgendaDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Meeting Agenda</DialogTitle>
            <DialogDescription>
              Agenda for your upcoming meeting with {clientName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="text-sm font-medium mb-3">Meeting Items ({calculateAgendaProgress()}% complete)</h4>
            <div className="w-full h-2 bg-muted rounded-full mb-4">
              <div 
                className="h-2 bg-primary rounded-full" 
                style={{ width: `${calculateAgendaProgress()}%` }}
              ></div>
            </div>
            
            <div className="space-y-2">
              {agendaItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-3 p-3 border rounded-md"
                >
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleAgendaItem(item.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.timeEstimate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAgendaDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast({
                description: "Agenda has been shared with the client.",
              });
              setShowAgendaDialog(false);
            }}>
              Share with Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Client Feedback</DialogTitle>
            <DialogDescription>
              Send a feedback request to {clientName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Preview Feedback Form</h4>
                
                <div className="border rounded-md p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">How would you rate the meeting?</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedbackRating(rating)}
                          className={`w-8 h-8 rounded-full ${
                            feedbackRating >= rating 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comments or suggestions</label>
                    <Textarea
                      placeholder="Share your thoughts about the meeting..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="h-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => {
                toast({
                  description: "Feedback form copied to clipboard.",
                });
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              className="sm:flex-1"
              onClick={() => {
                toast({
                  description: "Feedback request sent to client.",
                });
                setShowFeedbackDialog(false);
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
