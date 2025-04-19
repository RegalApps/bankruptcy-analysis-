
import { FileText, Eye, MessageSquare, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "../types";
import { EmptyDocumentState } from "./FilePreview/EmptyDocumentState";
import { DocumentHeader } from "./FilePreview/DocumentHeader";
import { DocumentPreviewTab } from "./FilePreview/DocumentPreviewTab";
import { CommentsTab } from "./FilePreview/CommentsTab";
import { ActivityTab } from "./FilePreview/ActivityTab";
import { useFilePreview } from "./FilePreview/useFilePreview";

interface FilePreviewPanelProps {
  document: Document | null;
  onDocumentOpen: (documentId: string) => void;
}

export const FilePreviewPanel = ({ document, onDocumentOpen }: FilePreviewPanelProps) => {
  const {
    activeTab,
    setActiveTab,
    hasStoragePath,
    isLoading,
    effectiveDocumentId,
    getStoragePath,
    handleDocumentOpen
  } = useFilePreview(document, onDocumentOpen);
  
  if (!document) {
    return <EmptyDocumentState />;
  }

  return (
    <div className="h-full flex flex-col p-4">
      <DocumentHeader document={document} handleDocumentOpen={handleDocumentOpen} />
      
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
          <DocumentPreviewTab 
            document={document}
            hasStoragePath={hasStoragePath}
            effectiveDocumentId={effectiveDocumentId}
            getStoragePath={getStoragePath}
            handleDocumentOpen={handleDocumentOpen}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="comments" className="mt-0 flex-1 flex flex-col">
          <CommentsTab 
            document={document}
            effectiveDocumentId={effectiveDocumentId}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0 flex-1">
          <ActivityTab document={document} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
