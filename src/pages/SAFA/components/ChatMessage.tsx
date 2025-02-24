
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <Card 
      className={`p-4 ${
        message.type === 'assistant' ? 'bg-muted/30' : 'bg-primary/5'
      }`}
    >
      <div className="flex gap-3">
        <div className={`w-8 h-8 rounded-full ${
          message.type === 'assistant' ? 'bg-primary/10' : 'bg-secondary/10'
        } flex items-center justify-center`}>
          <MessageCircle className={`h-4 w-4 ${
            message.type === 'assistant' ? 'text-primary' : 'text-secondary'
          }`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {message.content}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </Card>
  );
};
