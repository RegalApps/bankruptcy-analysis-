
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, UserCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Client type definition
interface Client {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'flagged';
  location: string;
  lastActivity?: string;
  needsAttention: boolean;
}

interface ClientListProps {
  clients: Client[];
  selectedClientId?: string;
}

export const ClientList = ({ clients, selectedClientId }: ClientListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleClientSelect = (clientId: string) => {
    navigate(`/client-viewer/${clientId}`);
  };
  
  // Get status color for badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'flagged':
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">Clients</h2>
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
        <div className="p-2">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className={cn(
                  "flex items-center justify-between p-3 my-1 rounded-md cursor-pointer transition-colors",
                  selectedClientId === client.id 
                    ? "bg-primary/10" 
                    : "hover:bg-accent/50"
                )}
                onClick={() => handleClientSelect(client.id)}
              >
                <div className="flex items-center min-w-0">
                  <div className="relative">
                    <UserCircle className="h-8 w-8 text-primary/70 mr-3" />
                    {client.needsAttention && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center">
                        <AlertCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="font-medium truncate">{client.name}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{client.location}</span>
                    </div>
                  </div>
                </div>
                
                <Badge className={cn(
                  "ml-2 capitalize",
                  getStatusColor(client.status)
                )}>
                  {client.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No clients found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
