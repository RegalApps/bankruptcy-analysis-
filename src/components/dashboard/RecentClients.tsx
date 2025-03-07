
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Client {
  id: string;
  name: string;
  last_accessed: string;
  document_count: number;
}

interface RecentClientsProps {
  onClientSelect: (clientId: string) => void;
}

export const RecentClients = ({ onClientSelect }: RecentClientsProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecentClients = async () => {
      try {
        setIsLoading(true);
        
        // Fetch recent document access history
        const { data: accessHistory, error: accessError } = await supabase
          .from('document_access_history')
          .select('document_id, accessed_at')
          .order('accessed_at', { ascending: false })
          .limit(20);
          
        if (accessError) throw accessError;
        
        if (!accessHistory || accessHistory.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // Get document details for the accessed documents
        const documentIds = accessHistory.map(record => record.document_id);
        const { data: documents, error: docsError } = await supabase
          .from('documents')
          .select('id, title, metadata, created_at, folder_type')
          .in('id', documentIds);
          
        if (docsError) throw docsError;
        
        // Extract client information from the documents
        const clientMap = new Map<string, Client>();
        
        documents?.forEach(doc => {
          const clientName = doc.metadata?.client_name || 'Unknown Client';
          const clientId = doc.metadata?.client_id || doc.id;
          
          // Only process if we have a client name
          if (clientName !== 'Unknown Client') {
            if (!clientMap.has(clientId)) {
              const accessRecord = accessHistory.find(record => record.document_id === doc.id);
              
              clientMap.set(clientId, {
                id: clientId,
                name: clientName,
                last_accessed: accessRecord?.accessed_at || doc.created_at,
                document_count: 1
              });
            } else {
              const existing = clientMap.get(clientId)!;
              clientMap.set(clientId, {
                ...existing,
                document_count: existing.document_count + 1
              });
            }
          }
        });
        
        setClients(Array.from(clientMap.values()));
      } catch (error) {
        console.error('Error fetching recent clients:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load recent clients"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentClients();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No clients yet</h3>
        <p className="text-muted-foreground mb-4">
          Upload documents to start organizing by client
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map(client => (
        <Card
          key={client.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onClientSelect(client.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-lg">{client.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Last accessed: {new Date(client.last_accessed).toLocaleDateString()}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Folder className="h-3.5 w-3.5 mr-1" />
                  {client.document_count} document{client.document_count !== 1 ? 's' : ''}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onClientSelect(client.id);
                }}
              >
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
