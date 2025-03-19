
import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Ticket, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from "@/contexts/ThemeContext";

interface SupportChatbotProps {
  onClose: () => void;
}

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export const SupportChatbot = ({ onClose }: SupportChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm the SecureFiles AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response (would connect to an actual API in production)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple mock AI responses
  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('password') || lowerQuery.includes('reset')) {
      return "To reset your password, go to the login page and click 'Forgot Password'. You'll receive an email with instructions to set a new password. Need more help?";
    } else if (lowerQuery.includes('upload') || lowerQuery.includes('file')) {
      return "For uploading files, go to the Documents section and click the upload button. You can drag and drop files or browse your computer. We support PDF, DOCX, and Excel formats.";
    } else if (lowerQuery.includes('account') || lowerQuery.includes('profile')) {
      return "Your account settings can be accessed by clicking on your profile picture in the top-right corner, then selecting 'Profile'. There you can update your information and preferences.";
    } else {
      return "I'm not sure I understand your question. Could you provide more details or rephrase it? Alternatively, you can open a support ticket for more personalized assistance.";
    }
  };

  return (
    <Card className={`w-96 fixed bottom-4 right-4 shadow-lg flex flex-col ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} style={{ height: '550px' }}>
      {/* Header */}
      <div className={`p-3 border-b flex items-center justify-between ${isDarkMode ? 'bg-background border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/lovable-uploads/b8620d24-fab6-4068-9af7-3e91ace7b559.png" />
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">AI Support Assistant</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : isDarkMode ? 'bg-accent' : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] rounded-lg p-3 ${isDarkMode ? 'bg-accent' : 'bg-muted'}`}>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-b">
        <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
          <Button variant="outline" size="sm" className="whitespace-nowrap text-xs">
            Reset Password
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap text-xs">
            Upload Issues
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap text-xs">
            Account Settings
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap text-xs">
            Billing Questions
          </Button>
        </div>
      </div>
      
      {/* Input */}
      <div className="p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Footer */}
      <div className="p-2 flex justify-between items-center border-t bg-muted/50 text-xs text-muted-foreground">
        <Button variant="ghost" size="sm" className="h-auto p-1 text-xs flex gap-1 items-center">
          <Ticket className="h-3 w-3" />
          Open Ticket
        </Button>
        <Button variant="ghost" size="sm" className="h-auto p-1 text-xs flex gap-1 items-center">
          <RefreshCw className="h-3 w-3" />
          New Conversation
        </Button>
      </div>
    </Card>
  );
};
