
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Bot, ThumbsUp, ThumbsDown, FileUp, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const SupportTicketDetail = () => {
  const [reply, setReply] = useState("");
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Mock ticket data - in a real app this would come from API/params
  const ticket = {
    id: "T-1234",
    title: "Unable to upload PDF files larger than 10MB",
    status: "open",
    category: "General Support",
    created: "May 10, 2023",
    lastActivity: "2 hours ago",
    messages: [
      {
        id: "m1",
        content: "I'm trying to upload a 12MB PDF file but keep getting an error message. The system says there's a 25MB limit, but I can't seem to get past 10MB. Has anyone else encountered this issue?",
        sender: {
          name: "John Doe",
          avatar: "",
          isUser: true,
        },
        timestamp: "May 10, 2023 - 10:23 AM",
      },
      {
        id: "m2",
        content: "Thanks for reporting this issue. Let me look into it for you. Could you please provide some additional information?\n\n1. What browser are you using?\n2. Are you using the drag and drop feature or the file picker?\n3. Have you tried uploading the same file from a different device?",
        sender: {
          name: "AI Assistant",
          avatar: "/lovable-uploads/b8620d24-fab6-4068-9af7-3e91ace7b559.png",
          isUser: false,
          isAI: true,
        },
        timestamp: "May 10, 2023 - 10:25 AM",
      },
      {
        id: "m3",
        content: "I'm using Chrome on Windows 10. I've tried both drag and drop and the file picker, both have the same issue. Haven't tried from another device yet.",
        sender: {
          name: "John Doe",
          avatar: "",
          isUser: true,
        },
        timestamp: "May 10, 2023 - 10:31 AM",
      },
      {
        id: "m4",
        content: "I've checked our system logs and found that there is indeed an issue with the upload limit for PDF files. While our system is set to accept files up to 25MB, there appears to be a configuration error causing PDFs to be limited to 10MB.\n\nOur development team has been notified and they're working on a fix, which should be deployed within the next 24 hours.\n\nIn the meantime, you could try:\n\n1. Compressing the PDF using a tool like Adobe Acrobat or online services\n2. Splitting the PDF into smaller files\n3. Using our API endpoint for larger uploads (if you have developer access)\n\nI'll keep you updated on the progress of the fix. Would any of these workarounds be helpful for your immediate needs?",
        sender: {
          name: "Support Agent",
          avatar: "",
          isUser: false,
          isStaff: true,
        },
        timestamp: "May 10, 2023 - 11:05 AM",
      },
    ],
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    alert("Reply submitted: " + reply);
    setReply("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Open</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="border-green-500 text-green-500">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Support
          </Button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{ticket.title}</h1>
                {getStatusBadge(ticket.status)}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Ticket #{ticket.id}</span>
                <span>•</span>
                <span>{ticket.category}</span>
                <span>•</span>
                <span>Created: {ticket.created}</span>
              </div>
            </div>
            
            <Button variant="outline">
              Mark as Resolved
            </Button>
          </div>
          
          {/* Messages */}
          <div className="space-y-4 mb-6">
            {ticket.messages.map((message) => (
              <Card key={message.id} className={message.sender.isUser && isDarkMode ? "border-gray-700" : ""}>
                <CardHeader className="pb-2 flex flex-row items-start gap-3">
                  <Avatar className="h-8 w-8">
                    {message.sender.avatar ? (
                      <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    ) : (
                      <AvatarFallback>
                        {message.sender.isAI ? (
                          <Bot className="h-4 w-4" />
                        ) : message.sender.isStaff ? (
                          <User className="h-4 w-4" />
                        ) : (
                          message.sender.name.charAt(0)
                        )}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.sender.name}</span>
                        {message.sender.isAI && (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-5">AI</Badge>
                        )}
                        {message.sender.isStaff && (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-5 border-primary text-primary">Staff</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  
                  {!message.sender.isUser && (
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span className="text-xs">Helpful</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          <span className="text-xs">Not helpful</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Reply form */}
          <Card className={isDarkMode ? "border-gray-700" : ""}>
            <CardHeader className="pb-0">
              <h3 className="text-sm font-medium">Add a reply</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="min-h-[120px]"
                />
                
                <div className="flex justify-between items-center">
                  <Button type="button" variant="outline" size="sm">
                    <FileUp className="h-4 w-4 mr-2" />
                    Attach Files
                  </Button>
                  
                  <Button type="submit" disabled={!reply.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SupportTicketDetail;
