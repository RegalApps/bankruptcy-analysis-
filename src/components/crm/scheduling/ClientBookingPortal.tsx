
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Copy, Send, Settings, Users } from "lucide-react";
import { toast } from "sonner";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { BookingTemplateEditor } from "./booking/BookingTemplateEditor";
import { BookingSettingsPanel } from "./booking/BookingSettingsPanel";
import { BookingRequestList } from "./booking/BookingRequestList";
import logger from "@/utils/logger";

export const ClientBookingPortal = () => {
  const [currentTab, setCurrentTab] = useState("generate-link");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [caseType, setCaseType] = useState("Consumer Proposal");
  const [caseNumber, setCaseNumber] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // Generate a booking request link with unique token 
  const generateBookingLink = () => {
    // Create a unique token or ID for this booking request
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // In a real implementation, this should be stored in the database
    const link = `${window.location.origin}/booking-request/${token}`;
    setGeneratedLink(link);
    
    logger.info("Generated booking link:", link);
  };
  
  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard");
  };
  
  // Send booking email to client
  const sendBookingEmail = async () => {
    if (!clientEmail || !clientName) {
      toast.error("Please enter client email and name");
      return;
    }
    
    try {
      setIsSending(true);
      
      // In a real implementation, this would call an Edge Function to send the email
      // For now, we'll simulate sending the email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Booking email sent to client", {
        description: `An email with booking instructions has been sent to ${clientName} at ${clientEmail}`
      });
      
      logger.info("Sent booking email to:", clientEmail, "for case:", caseNumber);
      
      // Reset form
      setClientEmail("");
      setClientName("");
      setCaseNumber("");
      setAdditionalNotes("");
      setGeneratedLink("");
      
    } catch (error) {
      logger.error("Error sending booking email:", error);
      toast.error("Failed to send booking email");
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Self-Booking Portal</CardTitle>
          <CardDescription>
            Allow clients to book their own appointments with AI-recommended time slots based on case priority and trustee availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="generate-link">Generate Booking Link</TabsTrigger>
              <TabsTrigger value="requests">Booking Requests</TabsTrigger>
              <TabsTrigger value="templates">Email Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate-link" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Client Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Client Name</label>
                        <Input 
                          placeholder="Enter client name" 
                          value={clientName} 
                          onChange={(e) => setClientName(e.target.value)} 
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Client Email</label>
                        <Input 
                          type="email" 
                          placeholder="client@example.com" 
                          value={clientEmail} 
                          onChange={(e) => setClientEmail(e.target.value)} 
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Case Type</label>
                        <select 
                          className="w-full p-2 border rounded-md" 
                          value={caseType}
                          onChange={(e) => setCaseType(e.target.value)}
                        >
                          <option value="Consumer Proposal">Consumer Proposal</option>
                          <option value="Bankruptcy">Bankruptcy</option>
                          <option value="Debt Counseling">Debt Counseling</option>
                          <option value="Financial Assessment">Financial Assessment</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Case Number (optional)</label>
                        <Input 
                          placeholder="Enter case number if available" 
                          value={caseNumber} 
                          onChange={(e) => setCaseNumber(e.target.value)} 
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Additional Notes</label>
                        <Textarea 
                          placeholder="Add any special instructions or notes for this booking" 
                          rows={3}
                          value={additionalNotes} 
                          onChange={(e) => setAdditionalNotes(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={generateBookingLink} className="flex-1">
                      Generate Booking Link
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {generatedLink ? (
                    <div className="border rounded-md p-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Booking Link Generated</h3>
                        <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
                          <span className="text-sm truncate flex-1">{generatedLink}</span>
                          <Button variant="outline" size="sm" onClick={copyLinkToClipboard}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Next Steps</h3>
                        <p className="text-sm text-muted-foreground">
                          Send this booking link to the client via email, or use our automated email system below.
                        </p>
                        
                        <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
                          <div className="flex items-start space-x-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-green-800">AI Recommendation</h4>
                              <p className="text-xs text-green-700 mt-1">
                                Based on the case type "{caseType}", we recommend scheduling this appointment with {caseType === "Bankruptcy" ? "John Smith" : "Sarah Johnson"}, who specializes in this area.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full mt-2" 
                          onClick={sendBookingEmail}
                          disabled={isSending}
                        >
                          {isSending ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Booking Email to Client
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center h-full">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Client Self-Booking</h3>
                      <p className="text-sm text-center text-muted-foreground mb-4">
                        Generate a unique booking link for your client. The system will automatically recommend appointment slots based on case priority and trustee availability.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Enter client details on the left to begin
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="requests">
              <BookingRequestList />
            </TabsContent>
            
            <TabsContent value="templates">
              <BookingTemplateEditor />
            </TabsContent>
            
            <TabsContent value="settings">
              <BookingSettingsPanel />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
