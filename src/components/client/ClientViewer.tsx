
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Calendar, 
  ArrowUpRight,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  last_interaction?: string;
  engagement_score?: number;
}

interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface ClientViewerProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen: (documentId: string) => void;
}

export const ClientViewer = ({ clientId, onBack, onDocumentOpen }: ClientViewerProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("documents");
  const { toast } = useToast();

  // Fetch client data from metadata
  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        // Get documents with this client ID in metadata
        const { data: clientDocs, error: docsError } = await supabase
          .from('documents')
          .select('*')
          .filter('metadata->client_id', 'eq', clientId);
          
        if (docsError) throw docsError;
        
        if (clientDocs && clientDocs.length > 0) {
          // Extract client details from the first document
          const firstDoc = clientDocs[0];
          const metadata = firstDoc.metadata as Record<string, any> || {};
          
          const clientData: Client = {
            id: clientId,
            name: metadata.client_name || 'Unknown Client',
            email: metadata.client_email,
            phone: metadata.client_phone,
            status: 'active',
          };
          
          setClient(clientData);
          setDocuments(clientDocs);
        } else {
          toast({
            variant: "destructive",
            title: "Client not found",
            description: "Could not find client information"
          });
          onBack();
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load client information"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [clientId, toast, onBack]);

  // If still loading, show skeleton
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-1/3 mt-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-8 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If client not found
  if (!client) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex flex-col items-center justify-center py-12">
            <User className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">Client Not Found</CardTitle>
            <p className="text-muted-foreground">The client information could not be retrieved.</p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-1.5" />
              Contact
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1.5" />
              Schedule
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-12rem)]">
          {/* Left panel - Client info */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="p-4 h-full border-r">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{client.name}</h2>
                  <div className={`px-2 py-0.5 text-xs inline-block rounded-full ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status || 'Unknown Status'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {client.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.last_interaction && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Last Contact: {new Date(client.last_interaction).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Client Summary</h3>
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Total Documents:</span> {documents.length}
                      </p>
                      <p>
                        <span className="font-medium">Last Activity:</span> {
                          documents.length > 0 
                            ? new Date(documents[0].updated_at).toLocaleDateString() 
                            : 'No recent activity'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right panel - Documents */}
          <ResizablePanel defaultSize={75}>
            <div className="p-4 h-full">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="documents">
                    <FileText className="h-4 w-4 mr-1.5" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <Clock className="h-4 w-4 mr-1.5" />
                    Activity History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="documents" className="mt-0">
                  <div className="space-y-3">
                    {documents.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
                        <p className="text-muted-foreground">This client doesn't have any documents yet.</p>
                      </div>
                    ) : (
                      documents.map((doc) => (
                        <Card 
                          key={doc.id} 
                          className="hover:shadow-sm cursor-pointer transition-shadow"
                          onClick={() => onDocumentOpen(doc.id)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{doc.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Last modified: {new Date(doc.updated_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-0">
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Activity History</h3>
                    <p className="text-muted-foreground">
                      Activity history feature will be available soon.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};
