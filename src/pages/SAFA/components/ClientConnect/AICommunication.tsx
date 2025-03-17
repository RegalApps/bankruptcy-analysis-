
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AICommunication = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
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
    }
  };

  const handleGenerateContent = async (type) => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll use predefined templates
      const template = templates[type];
      setTimeout(() => {
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

  const handleSendMessage = async () => {
    try {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully"
      });
      setGeneratedContent("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Communication Generator</CardTitle>
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
                  <span className="font-semibold">Missing Document Reminder</span>
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
                  <span className="font-semibold">Payment Reminder</span>
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
                  <span className="font-semibold">General Follow-up</span>
                  <span className="text-xs text-muted-foreground text-left">
                    Follow-up on case progress or outstanding items
                  </span>
                </Button>
              </div>

              {isGenerating && (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}

              {generatedContent && !isGenerating && (
                <div className="space-y-4">
                  <textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="w-full h-48 p-4 border rounded-md"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setGeneratedContent("")}>
                      Discard
                    </Button>
                    <Button onClick={handleSendMessage}>Send Message</Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chat">
              <div className="p-8 text-center">
                <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Chat Template Generator</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Generate AI-suggested chat messages based on client status and case requirements.
                </p>
                <Button className="mt-4">Generate Chat Templates</Button>
              </div>
            </TabsContent>

            <TabsContent value="call">
              <div className="p-8 text-center">
                <Phone className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Call Script Generator</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Generate AI-suggested call scripts for client follow-ups and updates.
                </p>
                <Button className="mt-4">Generate Call Scripts</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
