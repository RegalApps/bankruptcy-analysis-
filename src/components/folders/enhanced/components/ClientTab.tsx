
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UserRound, FileText, ArrowRight } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email?: string;
  status?: 'active' | 'inactive';
}

interface ClientTabProps {
  clients: Client[];
  documents: any[];
  onClientSelect?: (clientId: string) => void;
  onDocumentOpen?: (documentId: string) => void;
}

export const ClientTab = ({
  clients,
  documents,
  onClientSelect,
  onDocumentOpen
}: ClientTabProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Count documents per client
  const clientDocumentCounts = documents.reduce((acc, doc) => {
    const clientId = doc.metadata?.client_id;
    if (clientId) {
      acc[clientId] = (acc[clientId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const handleClientClick = (clientId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onClientSelect) {
        onClientSelect(clientId);
      }
    }, 500);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="active" className="h-full">
      <TabsList className="mb-4">
        <TabsTrigger value="active">Active Clients</TabsTrigger>
        <TabsTrigger value="all">All Clients</TabsTrigger>
      </TabsList>
      
      <TabsContent value="active" className="h-[calc(100%-3rem)]">
        <ScrollArea className="h-full">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {clients
              .filter(client => client.status !== 'inactive')
              .map(client => (
                <ClientCard 
                  key={client.id}
                  client={client}
                  documentCount={clientDocumentCounts[client.id] || 0}
                  onClick={() => handleClientClick(client.id)}
                />
              ))}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="all" className="h-[calc(100%-3rem)]">
        <ScrollArea className="h-full">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {clients.map(client => (
              <ClientCard 
                key={client.id}
                client={client}
                documentCount={clientDocumentCounts[client.id] || 0}
                onClick={() => handleClientClick(client.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

interface ClientCardProps {
  client: Client;
  documentCount: number;
  onClick: () => void;
}

const ClientCard = ({ client, documentCount, onClick }: ClientCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <UserRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{client.name}</h3>
              {client.email && (
                <p className="text-sm text-muted-foreground">{client.email}</p>
              )}
            </div>
          </div>
          {client.status === 'inactive' && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              Inactive
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>{documentCount} Documents</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={onClick}
        >
          View Client <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
