
import { useState, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { Client } from "@/components/client/types";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentViewControls } from "./components/DocumentViewControls";
import { DocumentSearchFilter } from "./components/DocumentSearchFilter";
import { FolderList } from "./components/FolderList";
import { DocumentViewPanel } from "./components/DocumentViewPanel";
import { FolderTools } from "./components/FolderTools";
import { useFolderDragAndDrop } from "./hooks/useFolderDragAndDrop";
import { useFolderActions } from "./hooks/useFolderActions";
import { useFolderFilterAndExpand } from "./hooks/useFolderFilterAndExpand";
import { useCreateFolderStructure } from "./hooks/useCreateFolderStructure";
import { ClientTab } from "./components/ClientTab";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
  onRefresh: () => void;
  onClientSelect?: (clientId: string) => void;
  clients?: any[];
}

export const EnhancedFolderTab = ({
  documents,
  onDocumentOpen,
  onRefresh,
  onClientSelect,
  clients = []
}: EnhancedFolderTabProps) => {
  const [activeTab, setActiveTab] = useState<string>("folders");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>();
  const [filterType, setFilterType] = useState<string | null>(null);

  const { folders, isLoading: isLoadingFolders } = useCreateFolderStructure(documents);

  const { filteredFolders, expandedFolders, toggleFolder } = useFolderFilterAndExpand({
    folders,
    searchQuery,
  });

  const { handleCreateFolder, handleRenameFolder, handleDeleteFolder } = useFolderActions({
    onSuccess: onRefresh,
  });

  const {
    dragOverFolder,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFolderDragAndDrop({
    onDropSuccess: onRefresh,
  });

  // Get documents in the currently selected folder
  const folderDocuments = selectedFolderId
    ? documents.filter(
        (doc) => !doc.is_folder && doc.parent_folder_id === selectedFolderId
      )
    : documents.filter((doc) => !doc.is_folder && !doc.parent_folder_id);

  // Further filter by type if filterType is set
  const filteredDocuments = folderDocuments.filter(
    (doc) => !filterType || doc.type === filterType
  );

  // Find Form 47 documents for special handling
  const form47Documents = documents.filter(
    doc => doc.metadata?.formType === 'form-47' || 
          doc.title.toLowerCase().includes('form 47') ||
          doc.title.toLowerCase().includes('consumer proposal')
  );

  // Calculate folder path for breadcrumb navigation
  const calculateFolderPath = () => {
    if (!selectedFolderId) return [];
    
    const path: { id: string; name: string }[] = [];
    let currentFolderId = selectedFolderId;
    
    const findFolder = (folderId: string) => {
      const folder = documents.find(
        doc => doc.id === folderId && doc.is_folder
      );
      
      if (!folder) return;
      
      path.unshift({ id: folder.id, name: folder.title });
      
      if (folder.parent_folder_id) {
        findFolder(folder.parent_folder_id);
      }
    };
    
    findFolder(currentFolderId);
    return path;
  };
  
  const folderPath = calculateFolderPath();

  // Select document
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  // Select folder
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedDocumentId(undefined);
  };

  // Test for demonstration purposes only
  const handleRunTest = () => {
    console.log("Running test function");
    // This is just a placeholder - do not reference Jest here
    const testResult = true;
    return testResult;
  };

  return (
    <Card className="h-[calc(100vh-15rem)]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex justify-between items-center px-6 pt-6">
          <TabsList>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          {activeTab === "folders" ? (
            <FolderTools
              onCreateFolder={() => handleCreateFolder()}
              onRefresh={onRefresh}
            />
          ) : (
            <div /> // Placeholder for client tab actions
          )}
        </div>
        
        <CardContent className="flex-1 overflow-hidden p-6">
          <TabsContent value="folders" className="h-full flex flex-col space-y-4 mt-0">
            <div className="flex justify-between">
              <DocumentSearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onFilterChange={setFilterType}
                selectedFilter={filterType}
              />
              
              <DocumentViewControls
                isGridView={isGridView}
                setIsGridView={setIsGridView}
              />
            </div>
            
            <div className="flex-1 flex gap-4 h-[calc(100%-3rem)]">
              <div className="w-1/3 border rounded-md overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-2">
                    <FolderList
                      folders={filteredFolders}
                      documents={documents}
                      onFolderSelect={handleFolderSelect}
                      onDocumentSelect={handleDocumentSelect}
                      onDocumentOpen={onDocumentOpen}
                      selectedFolderId={selectedFolderId}
                      expandedFolders={expandedFolders}
                      toggleFolder={toggleFolder}
                      handleDragStart={handleDragStart}
                      handleDragOver={handleDragOver}
                      handleDragLeave={handleDragLeave}
                      handleDrop={handleDrop}
                      dragOverFolder={dragOverFolder}
                    />
                  </div>
                </ScrollArea>
              </div>
              
              <div className="w-2/3 rounded-md">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <DocumentViewPanel
                      documents={filteredDocuments}
                      isGridView={isGridView}
                      onDocumentSelect={handleDocumentSelect}
                      onDocumentOpen={onDocumentOpen}
                      folderPath={folderPath}
                      selectedDocumentId={selectedDocumentId}
                    />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="h-full mt-0">
            <ClientTab 
              clients={clients || []} 
              documents={documents}
              onClientSelect={onClientSelect}
              onDocumentOpen={onDocumentOpen}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
