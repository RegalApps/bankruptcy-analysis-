
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DocumentStats } from "./DocumentStats";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentList } from "./DocumentList";
import { Button } from "@/components/ui/button";
import { Filter, Search, Mail, ShieldCheck, FileText, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

export const DocumentVault = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const { toast } = useToast();

  // Mock documents for demonstration
  const mockDocuments = [
    { id: "doc1", title: "Form 47 - Consumer Proposal", status: "draft", created_at: "2024-06-15" },
    { id: "doc2", title: "Form 76 - Debt Assessment", status: "completed", created_at: "2024-06-10" },
    { id: "doc3", title: "Client Contract", status: "pending-signature", created_at: "2024-06-08" },
  ];

  // Mock signature requests for demonstration
  const signatureRequests = [
    { id: "sig1", document: "Client Contract", recipient: "john.doe@example.com", status: "pending", sent_at: "2024-06-08" },
    { id: "sig2", document: "Form 32 - Agreement", recipient: "jane.smith@example.com", status: "completed", sent_at: "2024-06-01" },
  ];

  const handleSendVerificationCode = async () => {
    if (!selectedDocument) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a document to send for signature"
      });
      return;
    }

    if (!recipientEmail) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter recipient email"
      });
      return;
    }

    setIsSendingOtp(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-signature-request', {
        body: {
          documentId: selectedDocument,
          recipientEmail,
          action: 'send_verification_code'
        }
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "Verification Code Sent",
        description: "A verification code has been sent to the recipient's email"
      });
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send verification code"
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndSendRequest = async () => {
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the verification code"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-signature-request', {
        body: {
          documentId: selectedDocument,
          recipientEmail,
          verificationCode,
          action: 'verify_and_send_request'
        }
      });

      if (error) throw error;

      toast({
        title: "Signature Request Sent",
        description: "The document has been sent for signature"
      });
      
      // Reset form and close dialog
      setSelectedDocument("");
      setRecipientEmail("");
      setVerificationCode("");
      setOtpSent(false);
      setIsSignatureDialogOpen(false);
    } catch (error) {
      console.error('Error sending signature request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify code or send signature request"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Secure Document Signature Vault</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="signatures">Signature Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              <div className="flex items-center justify-between">
                <DocumentStats pendingCount={mockDocuments.filter(d => d.status === 'pending-signature').length} />
                <Button onClick={() => setIsSignatureDialogOpen(true)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Request Signature
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {mockDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary/70" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        doc.status === 'draft' ? 'outline' : 
                        doc.status === 'pending-signature' ? 'secondary' : 
                        'default'
                      }>
                        {doc.status === 'draft' ? 'Draft' : 
                        doc.status === 'pending-signature' ? 'Pending Signature' : 
                        'Completed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signatures" className="space-y-6">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  All signature requests are secured with email verification.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                {signatureRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary/70" />
                      <div>
                        <p className="font-medium">{request.document}</p>
                        <p className="text-xs text-muted-foreground">
                          Sent to: {request.recipient} on {new Date(request.sent_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                      {request.status === 'pending' ? 'Awaiting Signature' : 'Signed'}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <Button onClick={() => setIsSignatureDialogOpen(true)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send New Request
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Secure Signature Request Dialog */}
      <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Secure Signature Request</DialogTitle>
            <DialogDescription>
              Send a secure signature request with two-factor authentication.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="document">Select Document</Label>
              <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                <SelectTrigger id="document">
                  <SelectValue placeholder="Select a document" />
                </SelectTrigger>
                <SelectContent>
                  {mockDocuments.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>{doc.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@example.com"
              />
            </div>
            
            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter the 6-digit code"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  A verification code was sent to {recipientEmail}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            {!otpSent ? (
              <Button
                type="submit"
                onClick={handleSendVerificationCode}
                disabled={isSendingOtp || !selectedDocument || !recipientEmail}
              >
                {isSendingOtp ? "Sending..." : "Send Verification Code"}
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleVerifyAndSendRequest}
                disabled={isVerifying || !verificationCode}
              >
                {isVerifying ? "Verifying..." : "Send Document for Signature"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
