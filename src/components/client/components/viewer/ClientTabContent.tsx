
import { ScrollArea } from "@/components/ui/scroll-area";
import { Client, Document } from "../../types";
import { DocumentList } from "../DocumentList";
import { DocumentTree } from "../DocumentTree";
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { ClientActivityPanel } from "../ClientActivityPanel";

interface ClientTabContentProps {
  client: Client;
  documents: Document[];
  activeTab: string;
  onDocumentOpen?: (documentId: string) => void;
}

export const ClientTabContent = ({
  client,
  documents,
  activeTab,
  onDocumentOpen
}: ClientTabContentProps) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };
  
  const handleDocumentOpen = (documentId: string) => {
    if (onDocumentOpen) {
      onDocumentOpen(documentId);
    }
  };
  
  // Find the selected document for preview
  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId) || null;

  return (
    <Tabs value={activeTab} className="h-full">
      <TabsContent value="info" className="h-full mt-0 border-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Client Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p>{client.name}</p>
                </div>
                
                {client.email && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{client.email}</p>
                  </div>
                )}
                
                {client.phone && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{client.phone}</p>
                  </div>
                )}
                
                {client.address && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p>{client.address}</p>
                  </div>
                )}
              </div>
              
              {client.notes && (
                <div className="space-y-2 mt-6">
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="documents" className="h-full mt-0 border-0">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-2 border-b">
            <h3 className="text-sm font-medium">{documents.length} Documents</h3>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden flex">
            <div className="w-1/4 border-r p-2 hidden md:block">
              <DocumentTree 
                documents={documents} 
                onDocumentSelect={handleDocumentSelect} 
              />
            </div>
            
            <div className="flex-1 overflow-auto">
              <DocumentList 
                documents={documents}
                onDocumentOpen={handleDocumentOpen}
                onDocumentSelect={handleDocumentSelect}
                selectedDocumentId={selectedDocumentId}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="activity" className="h-full mt-0 border-0">
        <ClientActivityPanel client={client} />
      </TabsContent>
    </Tabs>
  );
};
