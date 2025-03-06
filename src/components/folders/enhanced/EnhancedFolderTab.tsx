
import { useState } from "react";
import { FolderNavigation } from "./FolderNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Document } from "@/components/DocumentList/types";
import { useCreateFolderStructure } from "./hooks/useCreateFolderStructure";
import { useFolderPermissions } from "./hooks/useFolderPermissions";
import { useFolderRecommendations } from "./hooks/useFolderRecommendations";
import { FolderOperations } from "./components/FolderOperations";
import { FolderManagementTools } from "./FolderManagementTools";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, FileQuestion } from "lucide-react";

interface EnhancedFolderTabProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
  onRefresh: () => void;
}

export const EnhancedFolderTab = ({ 
  documents, 
  onDocumentOpen,
  onRefresh
}: EnhancedFolderTabProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("folders");
  
  // Get the folder structure based on documents
  const { folders, isLoading: foldersLoading } = useCreateFolderStructure(documents);
  
  // Get user permissions for folders
  const { userRole, folderPermissions } = useFolderPermissions();

  // Get folder recommendations
  const { 
    showRecommendation, 
    recommendation, 
    setShowRecommendation,
    dismissRecommendation
  } = useFolderRecommendations(documents, folders);

  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedDocumentId(undefined);
  };

  // Handle document selection
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  // Handle recommendation acceptance with refresh
  const handleAcceptRecommendation = async () => {
    // Hide recommendation
    setShowRecommendation(false);
    dismissRecommendation();
    
    // Refresh documents
    onRefresh();
  };

  // Filter uncategorized documents (not in any folder)
  const uncategorizedDocuments = documents.filter(doc => 
    !doc.is_folder && !doc.parent_folder_id
  );

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full">
        {/* Add new Folder Management Tools component */}
        <FolderManagementTools 
          documents={documents}
          onRefresh={onRefresh}
          selectedFolderId={selectedFolderId}
        />
        
        {/* Folder Operations Section */}
        <FolderOperations
          showRecommendation={showRecommendation}
          recommendation={recommendation}
          onAcceptRecommendation={handleAcceptRecommendation}
          onDismissRecommendation={dismissRecommendation}
          onRefresh={onRefresh}
          setExpandedFolders={setExpandedFolders}
        />
        
        {/* Tabs for Folders and Uncategorized */}
        <Tabs 
          defaultValue="folders" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="folders" className="flex items-center">
              <Folder className="mr-2 h-4 w-4" />
              Folders
            </TabsTrigger>
            <TabsTrigger value="uncategorized" className="flex items-center">
              <FileQuestion className="mr-2 h-4 w-4" />
              Uncategorized
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="folders" className="mt-4 space-y-4">
            {/* Folder Navigation */}
            <FolderNavigation 
              folders={folders}
              documents={documents}
              onFolderSelect={handleFolderSelect}
              onDocumentSelect={handleDocumentSelect}
              onDocumentOpen={onDocumentOpen}
              selectedFolderId={selectedFolderId}
              expandedFolders={expandedFolders}
              setExpandedFolders={setExpandedFolders}
            />
          </TabsContent>
          
          <TabsContent value="uncategorized" className="mt-4 space-y-4">
            <div className="border rounded-md p-3">
              <h3 className="text-sm font-medium mb-2">Uncategorized Documents</h3>
              <div className="space-y-1">
                {uncategorizedDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No uncategorized documents found.</p>
                ) : (
                  uncategorizedDocuments.map(doc => (
                    <div 
                      key={doc.id}
                      className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-sm cursor-pointer"
                      onClick={() => onDocumentOpen(doc.id)}
                    >
                      <FileQuestion className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate">{doc.title}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
