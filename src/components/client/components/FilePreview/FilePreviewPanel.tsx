
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Document } from "../../types";
import { FilePreview } from "./FilePreview";
import { CommentPanel } from "./CommentPanel";
import { HistoryPanel } from "./HistoryPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, FileQuestion } from "lucide-react";

interface FilePreviewPanelProps {
  document: Document | null;
  onDocumentOpen: (documentId: string) => void;
}

export const FilePreviewPanel = ({ 
  document, 
  onDocumentOpen 
}: FilePreviewPanelProps) => {
  const [activeTab, setActiveTab] = useState("preview");
  
  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center p-6">
          <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Document Selected</h3>
          <p className="text-muted-foreground">
            Select a document from the list to preview it here.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <File className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">{document.title}</h3>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex-1">
              Comments
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              History
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="flex-1 mt-0">
          <FilePreview 
            document={document} 
            onDocumentOpen={() => onDocumentOpen(document.id)} 
          />
        </TabsContent>
        
        <TabsContent value="comments" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <CommentPanel documentId={document.id} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="history" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <HistoryPanel documentId={document.id} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
