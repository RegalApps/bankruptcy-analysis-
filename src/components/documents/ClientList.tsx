import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending" | "flagged";
  location?: string;
  lastActivity?: string;
  needsAttention?: boolean;
}

interface ClientListProps {
  clients: Client[];
  selectedClientId?: string;
  onClientSelect?: (clientId: string) => void;
}

export const ClientList = ({ clients, selectedClientId, onClientSelect }: ClientListProps) => {
  const navigate = useNavigate();
  
  const handleSelectClient = (clientId: string) => {
    console.log("ClientList: Selected client ID:", clientId);
    toast.info(`Loading client: ${clientId}`);
    
    if (onClientSelect) {
      onClientSelect(clientId);
    } else {
      console.log("Navigating to client viewer:", `/client-viewer/${clientId}`);
      navigate(`/client-viewer/${clientId}`);
    }
  };
  
  return (
    <div className="h-full border-r flex flex-col">
      <div className="px-4 py-2 border-b bg-muted/30">
        <h2 className="text-lg font-semibold">Clients</h2>
        <p className="text-xs text-muted-foreground">Select a client to view their documents</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {clients.map(client => (
            <Card 
              key={client.id}
              className={cn(
                "p-3 cursor-pointer hover:border-primary/50 transition-colors",
                selectedClientId === client.id && "bg-muted border-primary"
              )}
              onClick={() => handleSelectClient(client.id)}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{client.name}</div>
                  {client.status && (
                    <Badge 
                      variant={
                        client.status === "active" ? "default" : 
                        client.status === "pending" ? "outline" :
                        client.status === "flagged" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {client.status}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{client.location || "Unknown location"}</span>
                  {client.lastActivity && (
                    <span className="flex items-center text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {client.lastActivity}
                    </span>
                  )}
                </div>
                
                {client.needsAttention && (
                  <div className="flex items-center gap-1 text-amber-600 text-xs mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Needs attention</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
          
          {clients.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No clients found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
