
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationView } from "../../ConversationView";
import { ChatMessage } from "../../../types";
import { Client } from "../../../types/client";

interface ClientConversationViewProps {
  client: Client;
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
  onBack: () => void;
}

export const ClientConversationView = ({
  client,
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyPress,
  isProcessing,
  onBack
}: ClientConversationViewProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Conversation with {client.name}</h2>
            <p className="text-sm text-muted-foreground">AI Client Assistant</p>
          </div>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Client
        </Button>
      </div>
      <ConversationView
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
        isProcessing={isProcessing}
      />
    </div>
  );
};
