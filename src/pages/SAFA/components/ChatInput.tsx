
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, HelpCircle, Filter } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
}

export const ChatInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyPress,
  isProcessing
}: ChatInputProps) => {
  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Input 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about document management, OSB, BIA acts, and more..." 
          className="flex-1"
          disabled={isProcessing}
        />
        <Button 
          size="icon" 
          onClick={handleSendMessage}
          disabled={isProcessing}
        >
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
  );
};
