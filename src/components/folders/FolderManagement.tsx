
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "@/components/DocumentList/types";
import { ViewOptionsDropdown } from "./components/ViewOptionsDropdown";
import { FolderTab } from "./components/tabs/FolderTab";
import { UncategorizedTab } from "./components/tabs/UncategorizedTab";
import { FolderActionButtons } from "./components/FolderActionButtons";
import { useFolderManagement } from "./hooks/useFolderManagement";
import { SearchFilter } from "./components/SearchFilter";
import { TagsManager } from "./components/TagsManager";
import { Loader2 } from "lucide-react";

interface FolderManagementProps {
  documents: Document[];
  selectedItemId?: string;
  selectedItemType?: "folder" | "file";
  onItemSelect: (id: string, type: "folder" | "file") => void;
  onRefresh?: () => void;
  onOpenDocument?: (documentId: string) => void;
  currentFolderId?: string | null;
  onFolderNavigate?: (folderId: string | null) => void;
}

export const FolderManagement = ({ 
  documents,
  selectedItemId,
  selectedItemType,
  onItemSelect,
  onRefresh,
  onOpenDocument,
  currentFolderId,
  onFolderNavigate
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
    searchQuery,
    setSearchQuery,
    allTags,
    selectedTag,
    handleTagSelect,
    handleAddTag,
    handleRemoveTag,
    handleCreateFolder,
    handleDocumentDrop,
    handleFolderSelect,
    handleFolderNavigation,
    mergeableClientFolders,
    updateMergeableClientFolders,
    highlightMergeTargets,
    updateHighlightMergeTargets,
    folders,
    uncategorizedDocuments,
    filteredDocuments
  } = useFolderManagement({ 
    documents, 
    onRefresh, 
    onItemSelect 
  });

  const handleDocumentOpen = (documentId: string) => {
    if (onOpenDocument) {
      onOpenDocument(documentId);
    }
  };

  const isLoading = !documents || documents.length === 0;
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl">Document Explorer</h3>
            <ViewOptionsDropdown 
              onViewChange={setActiveView}
              selectedItemId={selectedItemId}
              selectedItemType={selectedItemType}
              onRefresh={onRefresh}
              updateMergeableClientFolders={updateMergeableClientFolders}
              updateHighlightMergeTargets={updateHighlightMergeTargets}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left sidebar with filters and tags */}
            <div className="lg:col-span-1 space-y-6">
              <SearchFilter 
                onSearchChange={setSearchQuery}
              />
              
              <TagsManager 
                tags={allTags}
                selectedTag={selectedTag || undefined}
                onFilterByTag={handleTagSelect}
              />
              
              <div className="pt-4">
                <FolderActionButtons 
                  setShowFolderDialog={setShowFolderDialog}
                  showFolderDialog={showFolderDialog}
                  newFolderName={newFolderName}
                  setNewFolderName={setNewFolderName}
                  onCreateFolder={handleCreateFolder}
                  folders={folders}
                  onFolderSelect={handleFolderSelect}
                  selectedFolderId={selectedFolder || undefined}
                />
              </div>
            </div>

            {/* Main content area with tabs */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Tabs defaultValue="folders" className="mt-2">
                  <TabsList className="mb-4 w-full justify-start">
                    <TabsTrigger value="folders">Folders ({folders.length})</TabsTrigger>
                    <TabsTrigger value="uncategorized">Uncategorized ({uncategorizedDocuments.length})</TabsTrigger>
                    <TabsTrigger value="all">All Documents ({filteredDocuments.filter(d => !d.is_folder).length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="folders">
                    <FolderTab
                      folders={folders}
                      documents={documents}
                      isDragging={isDragging}
                      selectedFolder={selectedFolder || null}
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
                  
                  <TabsContent value="all">
                    <UncategorizedTab 
                      documents={filteredDocuments.filter(doc => !doc.is_folder)}
                      onDocumentSelect={documentId => onItemSelect(documentId, "file")}
                      onOpenDocument={handleDocumentOpen}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
