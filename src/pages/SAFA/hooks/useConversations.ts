
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "../types";

type ModuleType = "document" | "legal" | "help" | "client";

const INITIAL_MESSAGES: Record<ModuleType, ChatMessage[]> = {
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
    content: "Welcome to AI Client Assistant and enhanced multimodal chatbot with voice, text, and sentiment analysis capabilities. Seamlessly integrates with CRM for real-time client updates and engagement tracking",
    type: 'assistant',
    timestamp: new Date(),
    module: 'client'
  }]
};

export const useConversations = (activeModule: ModuleType) => {
  const [categoryMessages, setCategoryMessages] = useState<Record<ModuleType, ChatMessage[]>>(INITIAL_MESSAGES);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const loadConversationHistory = async (module: ModuleType) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('module', module)
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

  const handleSendMessage = async (inputMessage: string) => {
    if (!inputMessage.trim() || isProcessing) return;

    setIsProcessing(true);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      type: 'user',
      timestamp: new Date(),
      module: activeModule
    };

    const updatedMessages = [...categoryMessages[activeModule], newMessage];
    setCategoryMessages(prev => ({
      ...prev,
      [activeModule]: updatedMessages
    }));

    try {
      const response = await supabase.functions.invoke('process-ai-request', {
        body: {
          message: inputMessage,
          module: activeModule,
          documentId: null
        }
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.data.response || "I understand. How can I assist you further?",
        type: 'assistant',
        timestamp: new Date(),
        module: activeModule
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setCategoryMessages(prev => ({
        ...prev,
        [activeModule]: finalMessages
      }));

      // Store messages in local storage instead of database for now
      localStorage.setItem(`${activeModule}_messages`, JSON.stringify(finalMessages));
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

  useEffect(() => {
    // Load messages from localStorage on module change
    const savedMessages = localStorage.getItem(`${activeModule}_messages`);
    if (savedMessages) {
      setCategoryMessages(prev => ({
        ...prev,
        [activeModule]: JSON.parse(savedMessages)
      }));
    } else {
      loadConversationHistory(activeModule);
    }
  }, [activeModule]);

  return {
    categoryMessages,
    isProcessing,
    handleSendMessage,
    loadConversationHistory
  };
};
