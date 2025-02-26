
import { ScrollText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "../../types";

interface ClientConversationProps {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
}

export const ClientConversation = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyPress,
  isProcessing,
}: ClientConversationProps) => {
  return (
    <div className="fixed inset-0 left-64 overflow-hidden">
      <div className="h-full w-full">
        <div className="flex flex-col h-full bg-background rounded-lg border">
          <div className="flex items-center gap-2 p-4 border-b">
            <ScrollText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">AI Client Assistant</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.type === 'assistant' ? 'bg-muted/30' : 'bg-primary/5'
                } p-4 rounded-lg`}
              >
                <p className="text-base">{message.content}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                size="icon"
                onClick={handleSendMessage}
                disabled={isProcessing}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
