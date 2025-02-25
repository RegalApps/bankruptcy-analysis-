
import { Card } from "@/components/ui/card";
import { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <Card 
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
  );
};
