
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Save, FileText, Download, Copy, Check, Share } from "lucide-react";
import { toast } from "sonner";

interface MeetingTranscriptionPanelProps {
  meetingId?: string;
  clientName?: string;
  meetingTitle?: string;
  onSaveTranscription?: (data: MeetingTranscriptionData) => void;
}

export interface MeetingTranscriptionData {
  transcription: string;
  summary: string;
  actionItems: string[];
}

export const MeetingTranscriptionPanel = ({
  meetingId,
  clientName = "Client",
  meetingTitle = "Meeting",
  onSaveTranscription
}: MeetingTranscriptionPanelProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("transcription");
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Load saved data if available
  useEffect(() => {
    if (meetingId) {
      const savedData = localStorage.getItem(`meeting-transcription-${meetingId}`);
      if (savedData) {
        const data = JSON.parse(savedData) as MeetingTranscriptionData;
        setTranscription(data.transcription || "");
        setSummary(data.summary || "");
        setActionItems(data.actionItems || []);
      }
    }
  }, [meetingId]);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      toast.success("Recording stopped");
      
      // In a real app, this would process actual recording data
      // For demo, we'll simulate generating a summary and action items
      if (transcription) {
        generateSummaryAndActionItems();
      }
    } else {
      // Start recording
      setIsRecording(true);
      toast.success("Recording started");
      
      // For demo, simulate transcription with a timeout
      simulateTranscription();
    }
  };

  const simulateTranscription = () => {
    // This is a simulation - in a real app, this would connect to a transcription API
    const demoTranscripts = [
      `Advisor: Hello ${clientName}, thank you for joining our meeting today to discuss your financial situation.`,
      `${clientName}: Thank you for having me. I'm really concerned about my current debt and looking for a way forward.`,
      `Advisor: I understand your concerns. Let's start by going over your current financial statements to get a complete picture.`,
      `${clientName}: That sounds good. I've brought all the documents you requested.`,
      `Advisor: Excellent. I see from your statements that you have approximately $45,000 in unsecured debt spread across credit cards and a personal loan. Is that correct?`,
      `${clientName}: Yes, that's right. It's been difficult keeping up with the minimum payments lately.`,
      `Advisor: I can see that. Your debt-to-income ratio is currently at 52%, which is quite high. Have you considered a consumer proposal as an option?`,
      `${clientName}: I've heard about it but don't fully understand how it works or if it's right for me.`,
      `Advisor: A consumer proposal could allow you to settle your debts for less than the full amount, with a single monthly payment over a set period, usually up to 5 years.`
    ];
    
    if (!isRecording) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < demoTranscripts.length && isRecording) {
        setTranscription(prev => prev + demoTranscripts[currentIndex] + "\n\n");
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  };

  const generateSummaryAndActionItems = () => {
    setIsGeneratingSummary(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Generate summary
      setSummary(
        `In this meeting with ${clientName}, we discussed their financial situation involving approximately $45,000 in unsecured debt. The client expressed concerns about keeping up with minimum payments, and their debt-to-income ratio was identified as 52%. We introduced the consumer proposal option as a potential solution that would allow them to settle debts for less than the full amount with a structured monthly payment plan over up to 5 years. The client was interested but needed more information about the process.`
      );
      
      // Generate action items
      setActionItems([
        `Prepare a detailed consumer proposal analysis for ${clientName}`,
        "Send information package about consumer proposals vs. other debt relief options",
        "Schedule follow-up meeting in one week to review proposal options",
        "Request additional documentation: proof of income, recent credit report"
      ]);
      
      setIsGeneratingSummary(false);
      setActiveTab("summary");
      
      toast.success("Summary and action items generated");
    }, 2000);
  };

  const saveTranscription = () => {
    const data: MeetingTranscriptionData = {
      transcription,
      summary,
      actionItems
    };
    
    // Save to localStorage
    if (meetingId) {
      localStorage.setItem(`meeting-transcription-${meetingId}`, JSON.stringify(data));
    }
    
    // Call the callback if provided
    if (onSaveTranscription) {
      onSaveTranscription(data);
    }
    
    toast.success("Meeting transcription saved");
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  const downloadTranscription = () => {
    // Create a text file
    const element = document.createElement("a");
    const file = new Blob([
      `${meetingTitle} - Meeting with ${clientName}\n\n`,
      `Date: ${new Date().toLocaleDateString()}\n\n`,
      "--- TRANSCRIPTION ---\n\n",
      transcription,
      "\n\n--- SUMMARY ---\n\n",
      summary,
      "\n\n--- ACTION ITEMS ---\n\n",
      actionItems.map((item, i) => `${i + 1}. ${item}`).join("\n")
    ], {type: 'text/plain'});
    
    element.href = URL.createObjectURL(file);
    element.download = `${meetingTitle.replace(/\s+/g, '_')}_Transcription.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success("Transcription downloaded");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Meeting Transcription</CardTitle>
            <CardDescription>
              Record and transcribe your meeting with {clientName}
            </CardDescription>
          </div>
          <Button 
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "default"}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="action-items">Action Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transcription">
            <div className="space-y-4">
              {isRecording && (
                <div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900/20 p-2 rounded-md text-red-700 dark:text-red-400">
                  <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-sm font-medium">Recording in progress...</span>
                </div>
              )}
              
              <Textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                placeholder="Transcription will appear here as you speak..."
                className="min-h-[300px]"
                readOnly={isRecording}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="summary">
            <div className="space-y-4">
              {isGeneratingSummary ? (
                <div className="min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
                    <p className="mt-2 text-sm text-muted-foreground">Generating meeting summary...</p>
                  </div>
                </div>
              ) : (
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="AI-generated summary will appear here after recording is complete..."
                  className="min-h-[300px]"
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="action-items">
            <div className="space-y-4">
              {isGeneratingSummary ? (
                <div className="min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
                    <p className="mt-2 text-sm text-muted-foreground">Identifying action items...</p>
                  </div>
                </div>
              ) : (
                <div className="min-h-[300px]">
                  {actionItems.length > 0 ? (
                    <div className="space-y-2">
                      {actionItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 border rounded-md">
                          <div className="mt-0.5 flex-shrink-0 h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">
                            {index + 1}
                          </div>
                          <Textarea
                            value={item}
                            onChange={(e) => {
                              const newItems = [...actionItems];
                              newItems[index] = e.target.value;
                              setActionItems(newItems);
                            }}
                            className="flex-1 min-h-[60px] resize-none"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setActionItems([...actionItems, ""])}
                      >
                        Add Action Item
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                      <p className="mt-4 text-muted-foreground">
                        No action items yet. They will appear after recording is complete,
                        or you can add them manually.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setActionItems([""])}
                      >
                        Add Action Item
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyToClipboard(activeTab === "transcription" ? transcription : activeTab === "summary" ? summary : actionItems.join("\n"))}
            disabled={!transcription && !summary && actionItems.length === 0}
          >
            {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadTranscription}
            disabled={!transcription}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
        
        <Button
          onClick={saveTranscription}
          disabled={!transcription && !summary && actionItems.length === 0}
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};
