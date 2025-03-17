
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { Client } from "../../../types/client";

interface ConversationHeaderProps {
  client: Client;
  onBack: () => void;
}

export const ConversationHeader = ({ client, onBack }: ConversationHeaderProps) => {
  return (
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
  );
};
