import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Mic, MicOff, FileText, ListChecks, PenTool, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export const MeetingNotes = ({ isStandalone = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("transcription");
  const { toast } = useToast();
  
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
      "John: Hi everyone, thanks for joining today's call about the new client onboarding process.",
      "Sarah: Thanks for setting this up. I think we need to streamline our document verification steps.",
      "John: I agree. The current 7-step process is too cumbersome for clients.",
      "Mark: What if we reduce it to 3 key steps and automate the background verification?",
      "Sarah: That sounds promising. We could use our existing AI tools for that.",
      "John: Great point. Let's outline these 3 steps and create a plan to implement by end of month.",
      "Mark: I can draft the technical requirements for the automation part.",
      "Sarah: And I'll work on updating the client-facing instructions.",
      "John: Perfect. Let's meet again next week to review progress."
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
        "The team discussed streamlining the client onboarding process from 7 steps to 3 key steps with automated background verification. The goal is to implement these changes by the end of the month to improve client experience and operational efficiency."
      );
      
      setActionItems([
        "Mark to draft technical requirements for verification automation",
        "Sarah to update client-facing documentation",
        "Team to reconvene next week to review progress",
        "John to prepare implementation timeline"
      ]);
    }, 1500);
  };
  
  const openInNewWindow = () => {
    const features = 'width=800,height=700,resizable=yes,scrollbars=yes';
    const notesWindow = window.open('/meetings/notes-standalone', 'meetingNotes', features);
    
    if (notesWindow) {
      notesWindow.focus();
    } else {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups for this site to open the notes in a new window.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-tight">Meeting Notes & Summaries</h2>
        
        {!isStandalone && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={openInNewWindow}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open in New Window</span>
          </Button>
        )}
      </div>
      
      {!transcription && !isRecording && (
        <Alert className="bg-muted/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No active transcription</AlertTitle>
          <AlertDescription>
            Start recording your meeting to generate transcriptions, summaries, and action items automatically.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between">
        <Button 
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "default"}
          className="flex items-center gap-2"
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        
        {transcription && (
          <Button 
            variant="outline" 
            onClick={() => {
              toast({
                title: "Notes exported",
                description: "Meeting notes have been exported successfully.",
              });
            }}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export Notes
          </Button>
        )}
      </div>
      
      {(transcription || isRecording) && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>Meeting Intelligence</CardTitle>
            <CardDescription>
              Real-time transcription with AI-generated insights
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="transcription" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transcription" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Transcription</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                <span>Summary</span>
              </TabsTrigger>
              <TabsTrigger value="action-items" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span>Action Items</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="transcription" className="border-none p-0">
              <CardContent className="pt-4">
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <div className="space-y-2 whitespace-pre-wrap font-mono text-sm">
                    {transcription || "Waiting for speech..."}
                    {isRecording && <span className="animate-pulse">▋</span>}
                  </div>
                </ScrollArea>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="summary" className="border-none p-0">
              <CardContent className="pt-4">
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  {summary ? (
                    <div className="space-y-4">
                      <p>{summary}</p>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {isRecording ? 
                        "Summary will be generated when recording stops" : 
                        "Record a meeting to generate a summary"}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="action-items" className="border-none p-0">
              <CardContent className="pt-4">
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  {actionItems.length > 0 ? (
                    <ul className="space-y-2">
                      {actionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 h-5 w-5 rounded-full border flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {isRecording ? 
                        "Action items will be identified when recording stops" : 
                        "Record a meeting to generate action items"}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-between pt-3">
            {isRecording && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Recording in progress</span>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
