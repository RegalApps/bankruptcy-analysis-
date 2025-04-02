
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, AlertCircle } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

export type ClientStatus = "active" | "pending" | "flagged" | "inactive";

interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  location: string;
  lastActivity: string;
  needsAttention?: boolean;
}

interface ClientListProps {
  clients: Client[];
  onClientSelect?: (clientId: string) => void;
  selectedClientId?: string | null;
}

export const ClientList = ({ clients, onClientSelect, selectedClientId }: ClientListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleClientClick = (clientId: string) => {
    if (onClientSelect) {
      onClientSelect(clientId);
    } else {
      // Navigate directly to client page for direct client viewers
      if (clientId === "jane-smith") {
        navigate("/clients/jane-smith");
      } else if (clientId === "robert-johnson") {
        navigate("/clients/robert-johnson");
      } else if (clientId === "maria-garcia") {
        navigate("/clients/maria-garcia");
      } else {
        navigate(`/client-viewer/${clientId}`);
      }
    }
  };
  
  const getStatusClasses = (status: ClientStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Clients</h3>
        <Button size="sm" variant="ghost">
          <UserPlus className="h-4 w-4" />
          <span className="sr-only">Add Client</span>
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {filteredClients.map(client => (
            <div 
              key={client.id}
              className={cn(
                "p-4 cursor-pointer hover:bg-accent/10 transition-colors",
                selectedClientId === client.id && "bg-accent/20"
              )}
              onClick={() => handleClientClick(client.id)}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{client.name}</h4>
                {client.needsAttention && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              <div className="flex justify-between mt-1 items-center">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  getStatusClasses(client.status)
                )}>
                  {client.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(client.lastActivity)}
                </span>
              </div>
              
              <div className="mt-1 text-xs text-muted-foreground">
                {client.location}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Fix the useState import
import { useState } from "react";
