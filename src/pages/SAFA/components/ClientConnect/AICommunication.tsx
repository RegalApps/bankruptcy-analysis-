
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Phone, Clock, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const AICommunication = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const templates = {
    urgent: {
      subject: "URGENT: Missing Form 3 – Proof of Claim",
      body: "Hi [Client Name],\n\nWe noticed that Form 3 (Proof of Claim) is missing from your case file. This is required by [Deadline Date].\n\nClick below to upload it now:\n[Secure Upload Link]\n\nLet us know if you need assistance. Your assigned trustee, [Trustee Name], is available for a call."
    },
    payment: {
      subject: "Reminder: Payment Due for Your Consumer Proposal",
      body: "Hi [Client Name],\n\nThis is a friendly reminder that your next payment of $500 is due on [Due Date] as part of your Consumer Proposal.\n\nIf you need assistance, please reach out or schedule a call here: [Meeting Link]."
    },
    follow_up: {
      subject: "Follow-up: Outstanding Documents for Your Case",
      body: "Hi [Client Name],\n\nWe're following up regarding the documents we discussed during our last meeting. Please submit the following at your earliest convenience:\n\n- [Document 1]\n- [Document 2]\n\nYour prompt attention will help us proceed with your case efficiently.\n\nRegards,\n[Trustee Name]"
    },
    second_reminder: {
      subject: "SECOND NOTICE: Action Required for Your Insolvency Case",
      body: "Hi [Client Name],\n\nThis is our second attempt to reach you regarding your case. We still need your immediate attention on the following items:\n\n- [Outstanding Item]\n\nIf we don't hear from you within 24 hours, our system will automatically schedule a call with your trustee.\n\nPlease respond or upload the required documents here: [Secure Link]"
    },
    call_schedule: {
      subject: "Important: Call Scheduled with Your Trustee",
      body: "Hi [Client Name],\n\nDue to outstanding items requiring your attention, we've scheduled a call with your trustee for [Date/Time].\n\nIf this time doesn't work for you, please reschedule here: [Scheduling Link]\n\nThis call is important to ensure your case proceeds without further delays."
    }
  };

  const chatTemplates = {
    payment_issue: "I understand you're having trouble with your payment. Your Licensed Insolvency Trustee may be able to adjust your payment schedule. Let's schedule a quick call to discuss your options: [Schedule Call Button].",
    document_request: "Hi [Client Name], we're still missing your Form 1 – Statement of Affairs. Please upload it here: [Upload Link].",
    meeting_followup: "Thanks for our meeting today. As discussed, please submit the following documents by [Date]: \n\n1. [Document 1]\n2. [Document 2]\n\nLet me know if you have any questions.",
    payment_confirmation: "We've received your payment of $[Amount] dated [Date]. Thank you for keeping your proposal on track. Your next payment of $[Amount] is due on [Next Date]."
  };

  const callScripts = {
    initial_consultation: "Hello [Client Name], this is [Trustee Name] from [Firm Name]. I'm calling to discuss your insolvency case and answer any questions you might have about the process.\n\nKey points to cover:\n1. Confirm current financial situation\n2. Explain consumer proposal vs. bankruptcy options\n3. Outline required documents\n4. Discuss next steps",
    missed_payment: "Hello [Client Name], I'm calling about a missed payment in your consumer proposal. Your payment of $[Amount] was due on [Date]. I'd like to discuss how we can get your proposal back on track and address any financial concerns you're experiencing.",
    document_follow_up: "Hello [Client Name], I'm following up on some documents we still need for your case. Specifically, we're missing [Documents]. These are required by [Deadline] to proceed with your case. Can we review what's needed and address any questions you have?",
    discharge_preparation: "Hello [Client Name], I'm calling to discuss your upcoming discharge from [bankruptcy/consumer proposal]. We need to complete a few final steps, including [Steps]. I also want to review what happens after discharge and how to rebuild your credit."
  };

  const handleGenerateContent = async (type: string) => {
    setIsGenerating(true);
    setSelectedTemplate(type);
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll use predefined templates
      const template = templates[type as keyof typeof templates];
      setTimeout(() => {
        setSubject(template.subject);
        setGeneratedContent(template.body);
        setIsGenerating(false);
        toast({
          title: "Content generated",
          description: "AI has suggested content based on the template"
        });
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate content. Please try again."
      });
      setIsGenerating(false);
    }
  };

  const handleGenerateChatContent = async (type: string) => {
    setIsGenerating(true);
    setSelectedTemplate(type);
    try {
      const template = chatTemplates[type as keyof typeof chatTemplates];
      setTimeout(() => {
        setGeneratedContent(template);
        setIsGenerating(false);
        toast({
          title: "Chat template generated",
          description: "AI has suggested content for your message"
        });
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate content. Please try again."
      });
      setIsGenerating(false);
    }
  };

  const handleGenerateCallScript = async (type: string) => {
    setIsGenerating(true);
    setSelectedTemplate(type);
    try {
      const template = callScripts[type as keyof typeof callScripts];
      setTimeout(() => {
        setGeneratedContent(template);
        setIsGenerating(false);
        toast({
          title: "Call script generated",
          description: "AI has suggested a script for your call"
        });
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate content. Please try again."
      });
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
      setGeneratedContent("");
      setSubject("");
      setSelectedTemplate(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    }
  };

  const handleScheduleFollowUp = () => {
    toast({
      title: "Follow-up scheduled",
      description: "AI will automatically follow up if no response is received within 48 hours"
    });
  };

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'payment':
        return <Badge variant="outline">Payment</Badge>;
      case 'follow_up':
        return <Badge variant="secondary">Follow-up</Badge>;
      case 'second_reminder':
        return <Badge variant="destructive">Second Notice</Badge>;
      case 'call_schedule':
        return <Badge variant="default">Call</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Communication Hub</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                Email Templates
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat Messages
              </TabsTrigger>
              <TabsTrigger value="call">
                <Phone className="mr-2 h-4 w-4" />
                Call Scripts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateContent("urgent")}
                  disabled={isGenerating}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-semibold">Missing Document Reminder</span>
                    <Badge variant="destructive">Urgent</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    Automated reminder for clients with missing required documents
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateContent("payment")}
                  disabled={isGenerating}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-semibold">Payment Reminder</span>
                    <Badge variant="outline">Payment</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    Reminder for upcoming or overdue proposal payments
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateContent("follow_up")}
                  disabled={isGenerating}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-semibold">General Follow-up</span>
                    <Badge variant="secondary">Follow-up</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    Follow-up on case progress or outstanding items
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateContent("second_reminder")}
                  disabled={isGenerating}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-semibold">Second Reminder</span>
                    <Badge variant="destructive">Second Notice</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    Escalated follow-up after 48 hours of no response
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateContent("call_schedule")}
                  disabled={isGenerating}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-semibold">Schedule Call</span>
                    <Badge variant="default">Call</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    Automatically schedule a call after 72 hours of no response
                  </span>
                </Button>
              </div>

              {isGenerating && (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}

              {generatedContent && !isGenerating && (
                <div className="space-y-4 border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Email Preview</h3>
                    {selectedTemplate && getTemplateTypeLabel(selectedTemplate)}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Body</label>
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={handleScheduleFollowUp}>
                        <Clock className="mr-1.5 h-4 w-4" />
                        Auto-follow up in 48h
                      </Button>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setGeneratedContent("")}>
                        Discard
                      </Button>
                      <Button onClick={handleSendMessage}>Send Message</Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chat">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateChatContent("payment_issue")}
                >
                  <span className="font-semibold">Payment Issue Response</span>
                  <span className="text-xs text-muted-foreground text-left">
                    Response to client inquiries about payment difficulties
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateChatContent("document_request")}
                >
                  <span className="font-semibold">Document Request</span>
                  <span className="text-xs text-muted-foreground text-left">
                    Request missing documents from client
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateChatContent("meeting_followup")}
                >
                  <span className="font-semibold">Meeting Follow-up</span>
                  <span className="text-xs text-muted-foreground text-left">
                    Summary of action items after client meeting
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateChatContent("payment_confirmation")}
                >
                  <span className="font-semibold">Payment Confirmation</span>
                  <span className="text-xs text-muted-foreground text-left">
                    Confirm receipt of client payment
                  </span>
                </Button>
              </div>

              {generatedContent && !isGenerating ? (
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Chat Message Preview</h3>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{generatedContent}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setGeneratedContent("")}>
                      Edit Message
                    </Button>
                    <Button onClick={handleSendMessage}>Send Message</Button>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Chat Template Generator</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Generate AI-suggested chat messages based on client status and case requirements.
                  </p>
                  <p className="text-sm text-primary mt-4">Select a template from above to get started</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="call">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateCallScript("initial_consultation")}
                >
                  <span className="font-semibold">Initial Consultation</span>
                  <span className="text-xs text-muted-foreground text-left">
                    Script for first call with new clients
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateCallScript("missed_payment")}
                >
                  <span className="font-semibold">Missed Payment</span>
                  <span className="text-xs text-muted-foreground text-left">
                    Script for discussing missed proposal payments
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateCallScript("document_follow_up")}
                >
                  <span className="font-semibold">Document Follow-up</span>
                  <span className="text-xs text-muted-foreground text-left">
                    Script for requesting outstanding documents
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-start h-auto p-4 space-y-2"
                  onClick={() => handleGenerateCallScript("discharge_preparation")}
                >
                  <span className="font-semibold">Discharge Preparation</span>
                  <span className="text-xs text-muted-foreground text-left">
                    Script for final steps before discharge
                  </span>
                </Button>
              </div>

              {generatedContent && !isGenerating ? (
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Call Script</h3>
                    <Badge variant="outline">AI Generated</Badge>
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Call Script</span>
                      </div>
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        className="min-h-[200px] mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Printer className="mr-1.5 h-4 w-4" />
                      Print Script
                    </Button>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setGeneratedContent("")}>
                        Discard
                      </Button>
                      <Button>Save Script</Button>
                    </div>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Phone className="mx-auto h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Call Script Generator</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Generate AI-suggested call scripts for client follow-ups and updates.
                  </p>
                  <p className="text-sm text-primary mt-4">Select a template from above to get started</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
