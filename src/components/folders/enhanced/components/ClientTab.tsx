
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, FileText, User, X } from "lucide-react";
import { Document } from "@/components/DocumentList/types";
import { ClientViewer } from "@/components/client/ClientViewer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClientTabProps {
  clients: Array<{ id: string; name: string; }>;
  documents: Document[];
  onClientSelect?: (clientId: string) => void;
  onDocumentOpen: (documentId: string) => void;
}

export const ClientTab: React.FC<ClientTabProps> = ({
  clients,
  documents,
  onClientSelect,
  onDocumentOpen
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const getClientInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const getDocumentCount = (clientId: string) => {
    return documents.filter(
      (doc) => 
        doc.metadata?.client_id === clientId || 
        doc.metadata?.client_name === clients.find(c => c.id === clientId)?.name
    ).length;
  };
  
  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
    if (onClientSelect) {
      onClientSelect(clientId);
    }
  };
  
  const handleBackFromClient = () => {
    setSelectedClientId(null);
  };
  
  const handleError = () => {
    // Handle error (e.g., show an error message)
    setSelectedClientId(null);
  };
  
  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If a client is selected, show the client viewer
  if (selectedClientId) {
    return (
      <div className="h-full">
        <ClientViewer 
          clientId={selectedClientId} 
          onBack={handleBackFromClient}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline" size="sm" className="gap-1">
          <UserPlus className="h-4 w-4" />
          New Client
        </Button>
      </div>
      
      {filteredClients.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
          <div className="text-center p-6">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Clients Found</h3>
            <p className="text-muted-foreground max-w-md">
              {clients.length === 0
                ? "No clients have been added yet. Add your first client to get started."
                : "No clients match your search criteria. Try a different search term."}
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <Card 
                key={client.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleClientClick(client.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`} alt={client.name} />
                      <AvatarFallback>{getClientInitials(client.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{client.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        <span>{getDocumentCount(client.id)} document{getDocumentCount(client.id) !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {searchQuery && filteredClients.length > 0 && (
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-3 w-3 mr-1" />
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
};
