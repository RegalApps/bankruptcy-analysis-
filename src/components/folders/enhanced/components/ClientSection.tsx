
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, User } from "lucide-react";

interface ClientSectionProps {
  clients: { id: string; name: string }[];
  onClientSelect?: (clientId: string) => void;
  onClientViewerAccess?: (clientId: string) => void;
  selectedClientId?: string;
  className?: string;
}

export const ClientSection = ({ 
  clients = [], 
  onClientSelect, 
  onClientViewerAccess,
  selectedClientId,
  className
}: ClientSectionProps) => {
  if (!clients || !Array.isArray(clients) || clients.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <h3 className="text-sm font-medium mb-1">No Clients Found</h3>
        <p className="text-xs">No client data is available</p>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${className || ''}`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Clients</h2>
        <p className="text-sm text-muted-foreground">
          {clients.length} client{clients.length !== 1 ? 's' : ''} available
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {clients.map(client => (
            <div 
              key={client.id}
              className={`p-3 border rounded-md hover:bg-accent/50 transition-colors ${
                selectedClientId === client.id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{client.name}</h3>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onClientSelect?.(client.id)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
