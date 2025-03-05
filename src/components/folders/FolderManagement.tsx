
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "@/components/DocumentList/types";
import { ViewOptionsDropdown } from "./components/ViewOptionsDropdown";
import { FolderTab } from "./components/tabs/FolderTab";
import { UncategorizedTab } from "./components/tabs/UncategorizedTab";
import { FolderActionButtons } from "./components/FolderActionButtons";
import { useFolderManagement } from "./hooks/useFolderManagement";

interface FolderManagementProps {
  documents: Document[];
  selectedItemId?: string;
  selectedItemType?: "folder" | "file";
  onItemSelect: (id: string, type: "folder" | "file") => void;
  onRefresh?: () => void;
  onOpenDocument?: (documentId: string) => void;
}

export const FolderManagement = ({ 
  documents,
  selectedItemId,
  selectedItemType,
  onItemSelect,
  onRefresh,
  onOpenDocument 
}: FolderManagementProps) => {
  const {
    showFolderDialog,
    setShowFolderDialog,
    newFolderName,
    setNewFolderName,
    isDragging,
    setIsDragging,
    activeView,
    setActiveView,
    selectedFolder,
    handleCreateFolder,
    handleDocumentDrop,
    handleFolderSelect,
    mergeableClientFolders,
    updateMergeableClientFolders,
    highlightMergeTargets,
    updateHighlightMergeTargets,
    folders,
    uncategorizedDocuments
  } = useFolderManagement({ documents, onRefresh, onItemSelect });

  const handleDocumentOpen = (documentId: string) => {
    if (onOpenDocument) {
      onOpenDocument(documentId);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-xl">Document Management</h3>
            <ViewOptionsDropdown 
              onViewChange={setActiveView}
              selectedItemId={selectedItemId}
              selectedItemType={selectedItemType}
              onRefresh={onRefresh}
              updateMergeableClientFolders={updateMergeableClientFolders}
              updateHighlightMergeTargets={updateHighlightMergeTargets}
            />
          </div>
          <FolderActionButtons 
            setShowFolderDialog={setShowFolderDialog}
            showFolderDialog={showFolderDialog}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            onCreateFolder={handleCreateFolder}
            folders={folders}
            onFolderSelect={handleFolderSelect}
            selectedFolderId={selectedFolder}
          />
        </div>

        <Tabs defaultValue="folders" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="uncategorized">Uncategorized</TabsTrigger>
          </TabsList>

          <TabsContent value="folders">
            <FolderTab
              folders={folders}
              documents={documents}
              isDragging={isDragging}
              selectedFolder={selectedFolder}
              onFolderSelect={handleFolderSelect}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDocumentDrop}
              onOpenDocument={handleDocumentOpen}
              mergeableClientFolders={mergeableClientFolders}
              highlightMergeTargets={highlightMergeTargets}
            />
          </TabsContent>

          <TabsContent value="uncategorized">
            <UncategorizedTab 
              documents={uncategorizedDocuments}
              onDocumentSelect={documentId => onItemSelect(documentId, "file")}
              onOpenDocument={handleDocumentOpen}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
