
import { BookOpen, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "../../../types";

interface HelpModuleContentProps {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleMessageSend: () => void;
  isProcessing: boolean;
}

export const HelpModuleContent = ({
  messages,
  inputMessage,
  setInputMessage,
  handleKeyPress,
  handleMessageSend,
  isProcessing
}: HelpModuleContentProps) => {
  return (
    <div className="flex-1">
      <div className="h-full p-6">
        <div className="flex flex-col h-full bg-background rounded-lg border">
          <div className="flex items-center gap-2 p-4 border-b">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Training & Help</h2>
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
                placeholder="Ask for help or guidance..."
                className="flex-1"
              />
              <Button 
                size="icon"
                onClick={handleMessageSend}
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
