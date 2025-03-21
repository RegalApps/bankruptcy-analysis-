
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "../../types";
import { DocumentPreviewTab } from "./DocumentPreviewTab";
import { ActivityTab } from "./ActivityTab";
import { useFilePreview } from "./useFilePreview";

interface FilePreviewPanelProps {
  document: Document | null;
  onDocumentOpen: (documentId: string) => void;
}

export const FilePreviewPanel: React.FC<FilePreviewPanelProps> = ({
  document,
  onDocumentOpen
}) => {
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
    return (
      <div className="flex flex-col h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
          <div className="px-4 pt-3 border-b">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </div>
          <div className="p-4 h-full overflow-y-auto">
            <p className="text-muted-foreground text-center pt-12">
              Select a document to view its details
            </p>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full overflow-hidden">
        <div className="px-4 pt-3 border-b">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>
        <div className="p-4 h-full overflow-y-auto">
          <TabsContent value="preview" className="mt-0 h-full">
            <DocumentPreviewTab
              document={document}
              hasStoragePath={hasStoragePath}
              effectiveDocumentId={effectiveDocumentId}
              getStoragePath={getStoragePath}
              handleDocumentOpen={handleDocumentOpen}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="activity" className="mt-0">
            <ActivityTab document={document} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
