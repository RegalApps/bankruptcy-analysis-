
import { FileText, Eye, MessageSquare, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Document } from "../types";
import { CollaborationPanel } from "@/components/DocumentViewer/CollaborationPanel";
import { useState } from "react";
import { DocumentPreview } from "@/components/DocumentViewer/DocumentPreview";

interface FilePreviewPanelProps {
  document: Document | null;
  onDocumentOpen: (documentId: string) => void;
}

export const FilePreviewPanel = ({ document, onDocumentOpen }: FilePreviewPanelProps) => {
  const [activeTab, setActiveTab] = useState('preview');
  
  if (!document) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div>
          <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Document Selected</h3>
          <p className="text-muted-foreground">
            Select a document from the list to preview details and collaborate.
          </p>
        </div>
      </div>
    );
  }

  // Create a mock document details object that matches the DocumentDetails type
  // including the required storage_path property
  const documentDetails = {
    id: document.id,
    title: document.title,
    type: document.type || 'document',
    storage_path: document.metadata?.storage_path || '', // Add the required storage_path
    comments: [],
    // Add any other required properties from the DocumentDetails type
    url: document.metadata?.url || '',
    size: document.metadata?.size || 0,
    created_at: document.created_at,
    updated_at: document.updated_at
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{document.title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(document.updated_at).toLocaleDateString()}
          </p>
          <Button 
            size="sm" 
            onClick={() => onDocumentOpen(document.id)}
            className="gap-1"
          >
            <Eye className="h-4 w-4" />
            <span>Open</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">
            <FileText className="h-4 w-4 mr-1.5" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-1.5" />
            Activity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="mt-0 flex-1">
          {document.metadata?.storage_path ? (
            <div className="h-64 overflow-hidden rounded-md border">
              <DocumentPreview 
                storagePath={document.metadata.storage_path}
                documentId={document.id}
                title={document.title}
              />
            </div>
          ) : (
            <div className="bg-muted rounded-md p-8 h-64 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Document preview not available.
                <br />
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => onDocumentOpen(document.id)}
                >
                  Open in Document Viewer
                </Button>
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">AI Summary</h4>
            <Card>
              <CardContent className="p-3 text-sm">
                <p>This document appears to be a {document.type || 'standard document'} related to client {document.title.includes('Form') ? 'financial information' : 'case details'}.</p>
                <p className="mt-2 text-muted-foreground text-xs">AI summary is a preview feature and may not be accurate.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="comments" className="mt-0 flex-1 flex flex-col">
          <CollaborationPanel 
            document={documentDetails}
            onCommentAdded={() => console.log('Comment added')}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0 flex-1">
          <div className="space-y-4">
            <div className="text-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                  U
                </div>
                <div>
                  <p className="font-medium">User opened this document</p>
                  <p className="text-xs text-muted-foreground">Today at {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                  S
                </div>
                <div>
                  <p className="font-medium">System updated document metadata</p>
                  <p className="text-xs text-muted-foreground">{new Date(document.updated_at).toLocaleDateString()} at {new Date(document.updated_at).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
