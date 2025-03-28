
import { FileText, Eye, MessageSquare, History, Download, ExternalLink, File } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "../../types";
import { EmptyDocumentState } from "./EmptyDocumentState";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentPreviewTab } from "./DocumentPreviewTab";
import { CommentsTab } from "./CommentsTab";
import { ActivityHistoryTab } from "./ActivityHistoryTab";
import { useFilePreview } from "./useFilePreview";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

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

  // Determine status for badge
  const getStatusBadge = () => {
    const status = document.metadata?.status as string || 'pending';
    
    switch (status) {
      case 'complete':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="bg-muted p-2 rounded-md mr-3">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{document.title}</h3>
              <p className="text-sm text-muted-foreground">
                {document.type || 'Document'} • Updated {format(new Date(document.updated_at), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handleDocumentOpen()}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Open
          </Button>
          
          {hasStoragePath && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => {
                if (document.storage_path) {
                  window.open(document.storage_path, '_blank');
                }
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download
            </Button>
          )}
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
          <ActivityHistoryTab document={document} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
