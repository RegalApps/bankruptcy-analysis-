
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Client } from "../../types/client";
import { ClientOverview } from "./ClientOverview";
import { useConversations } from "../../hooks/useConversations";
import { ClientDetails } from "./components/ClientDetails";
import { ClientActions } from "./components/ClientActions";
import { ClientActivitySection } from "./components/ClientActivitySection";
import { ClientConversationView } from "./components/ClientConversationView";

interface ClientAssistantPanelProps {
  onStartConversation: () => void;
  onViewHistory: () => void;
}

export const ClientAssistantPanel = ({
  onStartConversation,
  onViewHistory
}: ClientAssistantPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();
  
  const {
    categoryMessages,
    isProcessing,
    handleSendMessage,
    loadConversationHistory
  } = useConversations("client");

  const handleStartConversation = async () => {
    if (!selectedClient) {
      toast({
        title: "No Client Selected",
        description: "Please select a client to start a conversation.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Initialize conversation in database
      const { error } = await supabase
        .from('conversations')
        .insert([{ 
          type: 'client_connect',
          status: 'active',
          created_at: new Date().toISOString(),
          metadata: { client_id: selectedClient.id }
        }]);

      if (error) throw error;
      
      // Update client's last interaction
      await supabase
        .from('clients')
        .update({ last_interaction: new Date().toISOString() })
        .eq('id', selectedClient.id);

      setShowConversation(true);
      onStartConversation();
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start conversation. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistory = async () => {
    if (!selectedClient) {
      toast({
        title: "No Client Selected",
        description: "Please select a client to view history.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const [conversationsResponse, interactionsResponse] = await Promise.all([
        supabase
          .from('conversations')
          .select('*')
          .eq('type', 'client_connect')
          .contains('metadata', { client_id: selectedClient.id })
          .order('created_at', { ascending: false }),
        supabase
          .from('client_interactions')
          .select('*')
          .eq('client_id', selectedClient.id)
          .order('created_at', { ascending: false })
      ]);

      if (conversationsResponse.error) throw conversationsResponse.error;
      if (interactionsResponse.error) throw interactionsResponse.error;

      onViewHistory();
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversation history. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleSend = () => {
    handleSendMessage(inputMessage);
    setInputMessage("");
  };

  if (!selectedClient) {
    return <ClientOverview onSelectClient={setSelectedClient} />;
  }

  if (showConversation) {
    return (
      <ClientConversationView
        client={selectedClient}
        messages={categoryMessages.client}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSend}
        handleKeyPress={handleKeyPress}
        isProcessing={isProcessing}
        onBack={() => setShowConversation(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Client Assistant</h2>
        </div>
        <Button variant="outline" onClick={() => setSelectedClient(null)}>
          Back to Clients
        </Button>
      </div>
      
      <ClientDetails client={selectedClient} status={selectedClient.status} />
      
      <ClientActions 
        onStartConversation={handleStartConversation}
        onViewHistory={handleViewHistory}
        isLoading={isLoading}
      />

      <ClientActivitySection />
    </div>
  );
};
