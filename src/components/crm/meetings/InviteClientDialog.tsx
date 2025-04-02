
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Copy, Check } from "lucide-react";
import { toast } from "sonner";

// Form schema for email invitation
const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

// Form schema for SMS invitation
const smsFormSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }).max(160, { message: "SMS messages must be under 160 characters" }),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type SmsFormValues = z.infer<typeof smsFormSchema>;

interface InviteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  meetingTitle?: string;
  meetingId?: string;
  meetingDate?: string;
}

export const InviteClientDialog = ({
  open,
  onOpenChange,
  clientName = "Client",
  clientEmail = "",
  clientPhone = "",
  meetingTitle = "Upcoming Meeting",
  meetingId = "123",
  meetingDate = "soon"
}: InviteClientDialogProps) => {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  const [isCopied, setIsCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Generate a meeting link
  const meetingLink = `https://example.com/join/${meetingId}`;
  
  // Default email message template
  const defaultEmailMessage = `
Dear ${clientName},

You are invited to join our upcoming meeting: "${meetingTitle}" scheduled for ${meetingDate}.

To join the meeting, please click on the following link:
${meetingLink}

If you have any questions or need to reschedule, please don't hesitate to contact us.

Best regards,
Your Financial Advisory Team
`;

  // Default SMS message template (shorter due to SMS limitations)
  const defaultSmsMessage = `Hi ${clientName}, you're invited to join our "${meetingTitle}" meeting. Join here: ${meetingLink}`;
  
  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: clientEmail,
      subject: `Invitation to "${meetingTitle}" meeting`,
      message: defaultEmailMessage.trim(),
    },
  });
  
  // SMS form
  const smsForm = useForm<SmsFormValues>({
    resolver: zodResolver(smsFormSchema),
    defaultValues: {
      phone: clientPhone,
      message: defaultSmsMessage,
    },
  });
  
  // Handle copy meeting link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setIsCopied(true);
    toast.success("Meeting link copied to clipboard");
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  // Handle email submission
  const onEmailSubmit = (data: EmailFormValues) => {
    setIsSending(true);
    
    // In a real application, you would send the email here
    console.log("Sending email invitation:", data);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Invitation email sent to ${data.email}`);
      onOpenChange(false);
    }, 1000);
  };
  
  // Handle SMS submission
  const onSmsSubmit = (data: SmsFormValues) => {
    setIsSending(true);
    
    // In a real application, you would send the SMS here
    console.log("Sending SMS invitation:", data);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Invitation SMS sent to ${data.phone}`);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Client to Meeting</DialogTitle>
          <DialogDescription>
            Send your client a meeting invitation via email or SMS.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "email" | "sms")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>SMS</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="mt-4">
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="client@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={emailForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={emailForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={8} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include any specific instructions for joining the meeting.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <div className="w-full flex justify-between items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCopyLink}
                      className="gap-2"
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy Link
                    </Button>
                    <Button type="submit" disabled={isSending}>
                      {isSending ? "Sending..." : "Send Invitation"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="sms" className="mt-4">
            <Form {...smsForm}>
              <form onSubmit={smsForm.handleSubmit(onSmsSubmit)} className="space-y-4">
                <FormField
                  control={smsForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={smsForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4} 
                          {...field} 
                          maxLength={160}
                        />
                      </FormControl>
                      <FormDescription>
                        Keep your message under 160 characters for SMS.
                        <div className="text-right">
                          <span className={field.value.length > 150 ? "text-orange-500" : ""}>
                            {field.value.length}/160
                          </span>
                        </div>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <div className="w-full flex justify-between items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCopyLink}
                      className="gap-2"
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy Link
                    </Button>
                    <Button type="submit" disabled={isSending}>
                      {isSending ? "Sending..." : "Send Invitation"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
