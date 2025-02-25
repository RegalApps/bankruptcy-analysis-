
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, MessageSquare, History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ClientAssistantPanelProps {
  onStartConversation: () => void;
  onViewHistory: () => void;
}

export const ClientAssistantPanel = ({
  onStartConversation,
  onViewHistory
}: ClientAssistantPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartConversation = async () => {
    setIsLoading(true);
    try {
      // Initialize conversation in database
      const { error } = await supabase
        .from('conversations')
        .insert([
          { 
            type: 'client_connect',
            status: 'active',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
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
    setIsLoading(true);
    try {
      // Fetch conversation history
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('type', 'client_connect')
        .order('created_at', { ascending: false });

      if (error) throw error;

      onViewHistory();
      
      // Store the conversation history in the application state
      // This will be handled by the parent component through onViewHistory
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversation history. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">AI Client Assistant</h2>
      </div>
      
      <Card className="p-6">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Enhanced multimodal chatbot with voice, text, and sentiment analysis capabilities. 
            Seamlessly integrates with CRM for real-time client updates and engagement tracking.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleStartConversation}
              disabled={isLoading}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              {isLoading ? "Starting..." : "Start Conversation"}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={handleViewHistory}
              disabled={isLoading}
            >
              <History className="mr-2 h-5 w-5" />
              {isLoading ? "Loading..." : "View Conversation History"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex-1">
        <h3 className="text-lg font-medium mb-4">Recent Client Stats</h3>
        <ScrollArea className="h-[calc(100vh-400px)]">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              Client engagement statistics and recent activity will appear here.
            </p>
          </Card>
        </ScrollArea>
      </div>
    </div>
  );
};
