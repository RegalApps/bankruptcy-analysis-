
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { ChatMessage } from "../types";

interface ConversationViewProps {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
}

export const ConversationView = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyPress,
  isProcessing
}: ConversationViewProps) => {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <Card 
              key={message.id}
              className={`p-4 ${
                message.type === 'assistant' 
                  ? 'bg-muted/30' 
                  : 'bg-primary/5'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </Card>
          ))}
          {isProcessing && (
            <Card className="p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">AI is thinking...</p>
            </Card>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            size="icon"
            onClick={handleSendMessage}
            disabled={isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
