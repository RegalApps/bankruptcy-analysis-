
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Client } from "../types";
import { NewClientIntakeDialog } from "./NewClientIntakeDialog";

interface ClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (clientId: string) => void;
  availableClients?: Client[];
}

export const ClientSelector = ({ selectedClient, onClientSelect, availableClients }: ClientSelectorProps) => {
  const [showIntakeDialog, setShowIntakeDialog] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  
  // Default available clients if none provided
  const clients = availableClients || [
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      name: "John Doe",
      status: "active",
      last_activity: "2024-03-15",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Reginald Dickerson",
      status: "active",
      last_activity: "2024-03-12",
    },
  ];

  const handleClientCreated = (newClientId: string) => {
    setShowIntakeDialog(false);
    onClientSelect(newClientId);
  };

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex-1">
        <Select
          value={selectedClient?.id}
          onValueChange={onClientSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        className="whitespace-nowrap"
        onClick={() => setShowIntakeDialog(true)}
        disabled={isCreatingClient}
      >
        {isCreatingClient ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </>
        )}
      </Button>

      <NewClientIntakeDialog 
        open={showIntakeDialog} 
        onOpenChange={setShowIntakeDialog}
        onClientCreated={handleClientCreated}
        setIsCreatingClient={setIsCreatingClient}
      />
    </div>
  );
};
