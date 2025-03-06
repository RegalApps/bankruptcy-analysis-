
import { useState } from "react";
import { FolderNavigation } from "./FolderNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Document } from "@/components/DocumentList/types";
import { useCreateFolderStructure } from "./hooks/useCreateFolderStructure";
import { useFolderPermissions } from "./hooks/useFolderPermissions";
import { useFolderRecommendations } from "./hooks/useFolderRecommendations";
import { FolderOperations } from "./components/FolderOperations";
import { FolderManagementTools } from "./FolderManagementTools";

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
      </CardContent>
    </Card>
  );
};
