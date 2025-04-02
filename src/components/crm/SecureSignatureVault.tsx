
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileSignature, 
  UserCheck, 
  Send, 
  Lock, 
  Shield, 
  AlertTriangle, 
  Clock,
  CheckCircle
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface Document {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

export const SecureSignatureVault = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pendingSignatures, setPendingSignatures] = useState<Document[]>([]);
  const [signedDocuments, setSignedDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
    subscribeToDocumentUpdates();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Separate documents by status
      const allDocs = data || [];
      setDocuments(allDocs);
      setPendingSignatures(allDocs.filter(doc => doc.status === 'pending_signature'));
      setSignedDocuments(allDocs.filter(doc => doc.status === 'signed'));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch documents"
      });
    }
  };

  const subscribeToDocumentUpdates = () => {
    const channel = supabase
      .channel('document_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        (payload) => {
          console.log('Document update:', payload);
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendSignatureRequest = async () => {
    if (!selectedDocument || !recipientEmail) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a document and enter recipient email"
      });
      return;
    }

    try {
      // First, send the OTP to the client's email for verification
      const { error } = await supabase.functions.invoke('send-signature-request', {
        body: {
          documentId: selectedDocument,
          recipientEmail: recipientEmail,
          action: 'send_verification_code'
        },
      });

      if (error) throw error;

      toast({
        title: "Verification Code Sent",
        description: `A verification code has been sent to ${recipientEmail}`
      });
      
      setShowOtpVerification(true);
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send verification code"
      });
    }
  };

  const verifyOtpAndSendSignatureRequest = async () => {
    if (otpValue.length !== 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 6-digit verification code"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-signature-request', {
        body: {
          documentId: selectedDocument,
          recipientEmail: recipientEmail,
          verificationCode: otpValue,
          action: 'verify_and_send_request'
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Signature request sent to ${recipientEmail}`
      });
      
      // Reset states after successful verification
      setShowOtpVerification(false);
      setOtpValue("");
      setSelectedDocument("");
      setRecipientEmail("");
      
      // Update document status in the local state
      const updatedDocs = documents.map(doc => 
        doc.id === selectedDocument 
          ? { ...doc, status: 'pending_signature' } 
          : doc
      );
      setDocuments(updatedDocs);
      setPendingSignatures(updatedDocs.filter(doc => doc.status === 'pending_signature'));
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify code. Please try again."
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-100 text-green-800">Signed</Badge>;
      case 'pending_signature':
        return <Badge className="bg-yellow-100 text-yellow-800">Awaiting Signature</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Secure Signature Vault
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="request">Request Signatures</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingSignatures.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({signedDocuments.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="space-y-4 mt-4">
              <Card className="p-4 bg-muted/30">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Select Document for Signature</h3>
                    <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a document" />
                      </SelectTrigger>
                      <SelectContent>
                        {documents.filter(doc => doc.status !== 'signed').map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Recipient's Email</h3>
                    <Input
                      type="email"
                      placeholder="Enter recipient's email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                  
                  {!showOtpVerification ? (
                    <Button 
                      onClick={sendSignatureRequest} 
                      className="w-full"
                      disabled={!selectedDocument || !recipientEmail}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Send Secure Signature Request
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md bg-yellow-50">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800">Verification Required</h4>
                            <p className="text-xs text-yellow-700 mt-1">
                              A 6-digit verification code has been sent to {recipientEmail}.
                              Ask the recipient to check their email and provide the code to continue.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Enter Verification Code</h3>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={otpValue}
                            onChange={setOtpValue}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowOtpVerification(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={verifyOtpAndSendSignatureRequest}
                          disabled={otpValue.length !== 6 || isVerifying}
                        >
                          {isVerifying ? (
                            <>Verifying...</>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Verify & Send
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Security Information</h3>
                <div className="text-xs text-muted-foreground space-y-2">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-primary/70" />
                    <span>Multi-factor authentication ensures secure document signing</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary/70" />
                    <span>All signature requests are encrypted and verified</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-4">
              {pendingSignatures.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p>No pending signatures</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSignatures.map((doc) => (
                    <Card key={doc.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-muted rounded-full mr-3">
                            <FileSignature className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{doc.title}</h4>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Sent on {new Date(doc.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {getDocumentStatusBadge(doc.status)}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              {signedDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p>No completed signatures yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {signedDocuments.map((doc) => (
                    <Card key={doc.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-50 rounded-full mr-3">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{doc.title}</h4>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Signed on {new Date(doc.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Document
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
