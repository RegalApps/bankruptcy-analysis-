
import React, { useState } from "react";
import { Search, User, MapPin, Clock, ArrowUpDown, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  status?: string;
  location?: string;
  lastActivity?: string;
}

interface ClientListProps {
  clients: Client[];
  onClientSelect: (clientId: string) => void;
  selectedClientId?: string | null;
}

export const ClientList = ({ clients, onClientSelect, selectedClientId }: ClientListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'activity'>('name');

  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort clients based on the selected sort criteria
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      // Sort by lastActivity (newest first)
      const dateA = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
      const dateB = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
      return dateB - dateA;
    }
  });

  // Helper function to get status badge color
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-200 text-gray-700";
    
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'flagged':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex flex-col space-y-3">
        <h3 className="font-medium flex items-center">
          <User className="h-4 w-4 mr-2" />
          Client Directory
        </h3>
        
        <div className="relative">
          <Search className="h-4 w-4 absolute top-2.5 left-2.5 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {filteredClients.length} clients found
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8"
            onClick={() => setSortBy(sortBy === 'name' ? 'activity' : 'name')}
          >
            <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
            Sort: {sortBy === 'name' ? 'Name' : 'Recent'}
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-1">
          {sortedClients.length > 0 ? (
            <div className="space-y-1">
              {sortedClients.map(client => (
                <div
                  key={client.id}
                  className={cn(
                    "p-3 rounded-md cursor-pointer hover:bg-accent/50 transition-colors",
                    selectedClientId === client.id && "bg-accent"
                  )}
                  onClick={() => onClientSelect(client.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{client.name}</div>
                      
                      <div className="flex items-center mt-1 text-xs text-muted-foreground space-x-3">
                        {client.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {client.location}
                          </div>
                        )}
                        
                        {client.lastActivity && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(client.lastActivity).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {client.status && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={cn("ml-2", getStatusColor(client.status))}>
                              {client.status}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <div className="flex items-center">
                              <Info className="h-3.5 w-3.5 mr-1.5" />
                              Client status: {client.status}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 p-4">
              <User className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
              <p className="text-sm text-muted-foreground text-center">
                {searchQuery ? "No clients match your search" : "No clients available"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
