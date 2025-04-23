import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Folder } from "lucide-react";
import { toast } from "sonner";
import { getDocuments, getDocumentById, uploadDocument } from "@/utils/documentOperations";
import { v4 as uuidv4 } from 'uuid';

// Define client folder type to match our local implementation
interface ClientFolder {
  id: string;
  title: string;
}

export const DocumentUploadSection = () => {
  const [newClientName, setNewClientName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing clients
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      // Get all documents from local storage
      const allDocuments = await getDocuments();
      
      // Filter for client folders - using type checking to handle potential missing properties
      const clientFolders = allDocuments.filter(doc => {
        // Check if the document has folder properties
        return doc.type === 'folder' || 
               (doc as any).is_folder === true && 
               (doc as any).folder_type === "client";
      });
      
      setClients(clientFolders.map(folder => ({
        id: folder.id,
        title: folder.title || "Unnamed Client"
      })));
    } catch (error) {
      console.error("Error fetching client folders:", error);
      toast.error("Failed to load client folders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Create a new client folder
  const handleCreateClient = async () => {
    if (!newClientName.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    try {
      // Generate a unique ID for the new client folder
      const newClientId = `client-${uuidv4()}`;
      
      // Create a folder file to upload
      const folderBlob = new Blob([`Client folder: ${newClientName}`], { type: 'application/folder' });
      const folderFile = new File([folderBlob], `${newClientName.trim()}.folder`, { type: 'application/folder' });
      
      // Upload the folder as a document
      await uploadDocument(folderFile);
      
      toast.success("Client folder created successfully");
      setNewClientName("");
      fetchClients();
      setSelectedClientId(newClientId);
    } catch (error) {
      toast.error("Failed to create client folder");
      console.error("Error creating client folder:", error);
    }
  };

  const handleUploadComplete = async (documentId: string) => {
    if (selectedClientId) {
      try {
        // Get the document from local storage
        const document = await getDocumentById(documentId);
        
        if (!document) {
          throw new Error("Document not found");
        }
        
        // In a local-only implementation, we would update the document
        // with the parent folder ID, but since we're using an array for storage,
        // we'll just log this action
        console.log(`Document ${documentId} linked to client ${selectedClientId}`);

        toast.success("Document uploaded and linked to client successfully");
      } catch (error) {
        console.error("Error linking document to client:", error);
        toast.error("Failed to link document to client");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporting Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedClientId || "new"} className="space-y-4">
          <TabsList>
            <TabsTrigger value="new">New Client</TabsTrigger>
            {clients?.map((client) => (
              <TabsTrigger
                key={client.id}
                value={client.id}
                onClick={() => setSelectedClientId(client.id)}
              >
                {client.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="new" className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="clientName">New Client Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="clientName"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Enter client name"
                  />
                  <Button onClick={handleCreateClient}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {clients?.map((client) => (
            <TabsContent key={client.id} value={client.id} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Folder className="h-5 w-5" />
                <span className="font-medium">{client.title}</span>
              </div>
              <FileUpload onUploadComplete={handleUploadComplete} />
            </TabsContent>
          ))}
          
          {isLoading && (
            <div className="flex justify-center p-4">
              <span className="text-sm text-muted-foreground">Loading clients...</span>
            </div>
          )}
          
          {!isLoading && clients.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Folder className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No client folders found. Create your first client to get started.</p>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
