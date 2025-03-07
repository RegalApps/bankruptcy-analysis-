
import { Button } from "@/components/ui/button";
import { MessageSquare, History } from "lucide-react";

interface ClientActionsProps {
  onStartConversation: () => void;
  onViewHistory: () => void;
  isLoading: boolean;
}

export const ClientActions = ({ onStartConversation, onViewHistory, isLoading }: ClientActionsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Button 
        size="lg" 
        className="w-full"
        onClick={onStartConversation}
        disabled={isLoading}
      >
        <MessageSquare className="mr-2 h-5 w-5" />
        {isLoading ? "Starting..." : "Start Conversation"}
      </Button>
      
      <Button 
        variant="outline" 
        size="lg" 
        className="w-full"
        onClick={onViewHistory}
        disabled={isLoading}
      >
        <History className="mr-2 h-5 w-5" />
        {isLoading ? "Loading..." : "View Conversation History"}
      </Button>
    </div>
  );
};
