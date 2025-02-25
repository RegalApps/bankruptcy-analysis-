
import { useState, useCallback, useEffect } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ChatMessage as ChatMessageType } from "./SAFA/types";
import { ChatMessage } from "./SAFA/components/ChatMessage";
import { ChatInput } from "./SAFA/components/ChatInput";
import { Sidebar } from "./SAFA/components/Sidebar";
import { ClientAssistantPanel } from "./SAFA/components/ClientConnect/ClientAssistantPanel";

const INITIAL_MESSAGES: Record<string, ChatMessageType[]> = {
  document: [{
    id: '1',
    content: "Welcome to Document Management. I can help you analyze, organize, and manage your documents. How can I assist you today?",
    type: 'assistant',
    timestamp: new Date(),
    module: 'document'
  }],
  legal: [{
    id: '1',
    content: "Welcome to Legal Advisory. I can help you with OSB regulations, BIA acts, and legal compliance. How can I assist you?",
    type: 'assistant',
    timestamp: new Date(),
    module: 'legal'
  }],
  help: [{
    id: '1',
    content: "Welcome to Training & Help. I can provide guidance on using the system and best practices. What would you like to learn about?",
    type: 'assistant',
    timestamp: new Date(),
    module: 'help'
  }],
  client: [{
    id: '1',
    content: "Welcome to Client Connect. I can help you with client engagement and management. How can I assist you today?",
    type: 'assistant',
    timestamp: new Date(),
    module: 'client'
  }]
};

export const ConBrandingPage = () => {
  const [categoryMessages, setCategoryMessages] = useState<Record<string, ChatMessageType[]>>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [activeModule, setActiveModule] = useState<'document' | 'legal' | 'help' | 'client'>('document');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing conversations for the active module when it changes
    loadConversationHistory(activeModule);
  }, [activeModule]);

  const loadConversationHistory = async (module: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('type', module)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0 && data[0].messages) {
        setCategoryMessages(prev => ({
          ...prev,
          [module]: data[0].messages
        }));
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const saveConversation = async (module: string, messages: ChatMessageType[]) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .insert([
          {
            type: module,
            messages: messages,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: inputMessage,
      type: 'user',
      timestamp: new Date(),
      module: activeModule
    };

    const updatedMessages = [...(categoryMessages[activeModule] || []), newMessage];
    setCategoryMessages(prev => ({
      ...prev,
      [activeModule]: updatedMessages
    }));
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

      const finalMessages = [...updatedMessages, assistantMessage];
      setCategoryMessages(prev => ({
        ...prev,
        [activeModule]: finalMessages
      }));

      // Save the updated conversation
      await saveConversation(activeModule, finalMessages);
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

  const handleStartConversation = () => {
    setShowChat(true);
    loadConversationHistory('client');
  };

  const handleViewHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('type', activeModule)
        .order('created_at', { ascending: false });

      if (error) throw error;

      toast({
        title: "Conversation History",
        description: `Found ${data.length} previous conversations for ${activeModule} module.`,
      });

      if (data && data.length > 0) {
        setCategoryMessages(prev => ({
          ...prev,
          [activeModule]: data[0].messages || INITIAL_MESSAGES[activeModule]
        }));
        setShowChat(true);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversation history."
      });
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

    const updatedMessages = [...(categoryMessages.document || []), assistantMessage];
    setCategoryMessages(prev => ({
      ...prev,
      document: updatedMessages
    }));

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

      const finalMessages = [...updatedMessages, analysisMessage];
      setCategoryMessages(prev => ({
        ...prev,
        document: finalMessages
      }));

      await saveConversation('document', finalMessages);
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze the document. Please try again."
      });
    }
  }, [categoryMessages, toast]);

  const renderMainContent = () => {
    if (activeModule === 'client' && !showChat) {
      return (
        <ClientAssistantPanel 
          onStartConversation={handleStartConversation}
          onViewHistory={handleViewHistory}
        />
      );
    }

    return (
      <>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {(categoryMessages[activeModule] || []).map((message) => (
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
      </>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <Sidebar 
              activeModule={activeModule}
              setActiveModule={(module) => {
                setActiveModule(module);
                setShowChat(module !== 'client');
              }}
              onUploadComplete={handleFileUploadComplete}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
              {renderMainContent()}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
