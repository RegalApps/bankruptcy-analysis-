
import { useState, useCallback } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ChatMessage as ChatMessageType } from "./SAFA/types";
import { ChatMessage } from "./SAFA/components/ChatMessage";
import { ChatInput } from "./SAFA/components/ChatInput";
import { Sidebar } from "./SAFA/components/Sidebar";

export const ConBrandingPage = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([{
    id: '1',
    content: "Welcome to Secure Files Adaptive Future-forward Assistant. I can help you with document management, OSB regulations, BIA acts, client engagement, and more. How can I assist you today?",
    type: 'assistant',
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeModule, setActiveModule] = useState<'document' | 'legal' | 'help' | 'client'>('document');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: inputMessage,
      type: 'user',
      timestamp: new Date(),
      module: activeModule
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsProcessing(true);

    try {
      const response = await supabase.functions.invoke('process-ai-request', {
        body: {
          message: inputMessage,
          module: activeModule,
          documentId: null
        }
      });

      const assistantMessage: ChatMessageType = {
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUploadComplete = useCallback(async (documentId: string) => {
    const assistantMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: "I've received your document. Would you like me to analyze it for you?",
      type: 'assistant',
      timestamp: new Date(),
      module: 'document'
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await supabase.functions.invoke('process-ai-request', {
        body: {
          message: "Please analyze this document and provide a summary.",
          module: 'document',
          documentId: documentId
        }
      });

      const analysisMessage: ChatMessageType = {
        id: Date.now().toString(),
        content: response.data.response,
        type: 'assistant',
        timestamp: new Date(),
        module: 'document'
      };

      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze the document. Please try again."
      });
    }
  }, [toast]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <Sidebar 
              activeModule={activeModule}
              setActiveModule={setActiveModule}
              onUploadComplete={handleFileUploadComplete}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
              </ScrollArea>
              <ChatInput 
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                handleKeyPress={handleKeyPress}
                isProcessing={isProcessing}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
