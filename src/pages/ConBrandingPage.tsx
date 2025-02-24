import { useState } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  MessageCircle, 
  Search, 
  Send,
  BookOpen,
  Scale,
  HelpCircle,
  Filter
} from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  module?: 'document' | 'legal' | 'help';
}

export const ConBrandingPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    content: "Welcome to Secure Files AI Assistant. I can help you with document management, OSB regulations, BIA acts, and more. How can I assist you today?",
    type: 'assistant',
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeModule, setActiveModule] = useState<'document' | 'legal' | 'help'>('document');
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      type: 'user',
      timestamp: new Date(),
      module: activeModule
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");

    try {
      const response = await supabase.functions.invoke('process-ai-request', {
        body: {
          message: inputMessage,
          module: activeModule,
          documentId: null // We'll add document context handling later
        }
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        type: 'assistant',
        timestamp: new Date(),
        module: activeModule
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again."
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <MainSidebar />
      <div className="pl-16">
        <MainHeader />
        <div className="flex h-[calc(100vh-64px)]">
          {/* Sidebar Navigation */}
          <aside className="w-64 border-r bg-muted/30 p-4 space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Categories</h2>
              <Tabs value={activeModule} onValueChange={(value: any) => setActiveModule(value)} className="w-full">
                <TabsList className="grid w-full grid-cols-1 h-auto">
                  <TabsTrigger value="document" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Document Analysis
                  </TabsTrigger>
                  <TabsTrigger value="legal" className="w-full justify-start">
                    <Scale className="mr-2 h-4 w-4" />
                    Legal & Regulatory
                  </TabsTrigger>
                  <TabsTrigger value="help" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Training & Help
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Recent Conversations</h2>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-8" placeholder="Search conversations..." />
              </div>
            </div>
          </aside>

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col">
            <div className="flex-1 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card 
                      key={message.id} 
                      className={`p-4 ${
                        message.type === 'assistant' ? 'bg-muted/30' : 'bg-primary/5'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full ${
                          message.type === 'assistant' ? 'bg-primary/10' : 'bg-secondary/10'
                        } flex items-center justify-center`}>
                          <MessageCircle className={`h-4 w-4 ${
                            message.type === 'assistant' ? 'text-primary' : 'text-secondary'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {message.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about document management, OSB, BIA acts, and more..." 
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help Topics
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
