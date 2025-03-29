
import React, { useState } from "react";
import { ClientHeader } from "./viewer/ClientHeader";
import { ClientTabs } from "./viewer/ClientTabs";
import { Card } from "@/components/ui/card";
import { EditableClientInfo } from "./EditableClientInfo";
import { Client, Document } from "../types";
import { formatDate } from "@/utils/formatDate";
import { toast } from "sonner";
import { FileText, FileSpreadsheet, File, Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface ClientTemplateProps {
  clientId: string;
  onBack: () => void;
  onDocumentOpen?: (documentId: string) => void;
}

export const ClientTemplate = ({ clientId, onBack, onDocumentOpen }: ClientTemplateProps) => {
  console.log("ClientTemplate: Initializing with client ID:", clientId);
  
  const [client, setClient] = useState<Client>({
    id: clientId,
    name: clientId === 'josh-hart' ? 'Josh Hart' : formatClientName(clientId),
    email: clientId === 'josh-hart' ? 'josh.hart@example.com' : '',
    phone: clientId === 'josh-hart' ? '(555) 123-4567' : '',
    status: 'active',
    last_interaction: new Date().toISOString() // Adding this to avoid type errors
  });
  
  const [activeTab, setActiveTab] = useState("info");
  
  const sampleDocuments: Document[] = clientId === 'josh-hart' ? [
    {
      id: 'form-47-doc',
      title: 'Form 47 - Consumer Proposal',
      type: 'form-47',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        client_name: client.name
      }
    },
    {
      id: 'bank-statement',
      title: 'Bank Statement - March 2023',
      type: 'financial',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        client_name: client.name
      }
    }
  ] : [
    {
      id: 'sample-doc-1',
      title: 'Sample Document 1',
      type: 'document',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        client_name: client.name
      }
    }
  ];
  
  const handleClientUpdate = (updatedClient: Client) => {
    console.log("ClientTemplate: Client update received:", updatedClient);
    setClient(updatedClient);
    toast.success("Client information updated", {
      description: "Your changes have been saved"
    });
  };
  
  const handleDocumentSelect = (documentId: string) => {
    console.log("Selected document:", documentId);
  };
  
  const handleDocumentOpen = (documentId: string) => {
    console.log("ClientTemplate: Document open requested:", documentId);
    if (onDocumentOpen) {
      console.log("ClientTemplate: Using provided onDocumentOpen callback");
      onDocumentOpen(documentId);
    } else {
      console.log("ClientTemplate: No document open callback provided, showing toast only");
      toast.info("Opening document", {
        description: `Opening ${sampleDocuments.find(d => d.id === documentId)?.title || 'document'}`
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ClientHeader client={client} onBack={onBack} />
      
      <div className="mt-6 flex-1 overflow-hidden flex flex-col">
        <ClientTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <ScrollArea className="mt-4 flex-1">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="info" className="m-0">
              <div className="space-y-6">
                <EditableClientInfo client={client} onSave={handleClientUpdate} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-muted/50 p-4">
                    <h3 className="text-sm font-medium mb-2">Client Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Documents:</span>
                        <span className="text-xs font-medium">{sampleDocuments.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Last Activity:</span>
                        <span className="text-xs font-medium">{formatDate(new Date().toISOString())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Engagement Score:</span>
                        <span className="text-xs font-medium">85</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-muted/50 p-4">
                    <h3 className="text-sm font-medium mb-2">Recent Documents</h3>
                    <ul className="space-y-2">
                      {sampleDocuments.slice(0, 3).map(doc => (
                        <li 
                          key={doc.id}
                          className="text-xs p-2 rounded cursor-pointer hover:bg-muted"
                          onClick={() => handleDocumentSelect(doc.id)}
                        >
                          {doc.title}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="m-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Client Documents</h3>
                  <Button variant="outline" size="sm" className="text-xs">
                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> Add Document
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {sampleDocuments.map(doc => (
                    <Card key={doc.id} className="p-3 hover:bg-accent/10 cursor-pointer" onClick={() => handleDocumentOpen(doc.id)}>
                      <div className="flex items-start">
                        <div className="bg-muted rounded-md p-2 mr-3">
                          {doc.type === 'financial' ? (
                            <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                          ) : doc.type === 'form-47' ? (
                            <File className="h-5 w-5 text-red-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{doc.title}</h4>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground">{doc.type}</span>
                            <span className="text-xs text-muted-foreground ml-auto flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(doc.updated_at).split(' at ')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="m-0">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Client Activity</h3>
                
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="border-l-2 border-blue-500 pl-3 py-1">
                      <p className="text-sm">Document viewed: Form 47 - Consumer Proposal</p>
                      <p className="text-xs text-muted-foreground">{formatDate(new Date().toISOString())}</p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-3 py-1">
                      <p className="text-sm">Client information updated</p>
                      <p className="text-xs text-muted-foreground">{formatDate(new Date(Date.now() - 86400000).toISOString())}</p>
                    </div>
                    <div className="border-l-2 border-orange-500 pl-3 py-1">
                      <p className="text-sm">Document uploaded: Bank Statement - March 2023</p>
                      <p className="text-xs text-muted-foreground">{formatDate(new Date(Date.now() - 172800000).toISOString())}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  );
};

function formatClientName(clientId: string): string {
  return clientId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
