
import { useState, useEffect } from "react";
import { FolderNavigation } from "./FolderNavigation";
import { FolderHeader } from "./FolderHeader";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure, UserRole } from "@/types/folders";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateFolderStructure } from "./hooks/useCreateFolderStructure";
import { useFolderPermissions } from "./hooks/useFolderPermissions";
import { FolderRecommendationAlert } from "./FolderRecommendationAlert";
import { supabase } from "@/lib/supabase";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    documentId: string;
    suggestedFolderId: string;
    documentTitle: string;
    folderPath: string[];
  } | null>(null);

  // Get the folder structure based on documents
  const { folders, isLoading: foldersLoading } = useCreateFolderStructure(documents);
  
  // Get user permissions for folders
  const { userRole, folderPermissions } = useFolderPermissions();

  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedDocumentId(undefined);
  };

  // Handle document selection
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  // Check for folder recommendations when documents change
  useEffect(() => {
    const checkForRecommendations = async () => {
      try {
        // Get user ID for notifications
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Find any uncategorized documents
        const uncategorizedDoc = documents.find(doc => 
          !doc.is_folder && 
          !doc.parent_folder_id && 
          doc.ai_processing_status === 'complete'
        );

        if (uncategorizedDoc) {
          // Check if there's an AI recommendation
          const { data } = await supabase
            .from('document_analysis')
            .select('content')
            .eq('document_id', uncategorizedDoc.id)
            .single();
            
          if (data?.content?.extracted_info?.clientName) {
            // Find matching client folder
            const clientName = data.content.extracted_info.clientName;
            const clientFolder = folders.find(f => 
              f.type === 'client' && 
              f.name.toLowerCase() === clientName.toLowerCase()
            );
            
            if (clientFolder) {
              // Find appropriate subfolder based on document type
              let targetFolderId = clientFolder.id;
              let folderPath = [clientFolder.name];
              
              // Find appropriate subfolder (Forms or Financial Sheets)
              if (clientFolder.children) {
                const isFinancial = uncategorizedDoc.title.toLowerCase().includes('statement') || 
                                   uncategorizedDoc.title.toLowerCase().includes('sheet') ||
                                   uncategorizedDoc.title.toLowerCase().includes('.xls');
                                   
                const targetSubfolder = clientFolder.children.find(f => 
                  isFinancial ? f.type === 'financial' : f.type === 'form'
                );
                
                if (targetSubfolder) {
                  targetFolderId = targetSubfolder.id;
                  folderPath.push(targetSubfolder.name);
                }
              }
              
              // Set recommendation
              setRecommendation({
                documentId: uncategorizedDoc.id,
                suggestedFolderId: targetFolderId,
                documentTitle: uncategorizedDoc.title,
                folderPath: folderPath
              });
              
              setShowRecommendation(true);
              
              // Create recommendation notification
              await supabase.functions.invoke('handle-notifications', {
                body: {
                  action: 'folderRecommendation',
                  userId: user.id,
                  notification: {
                    message: `AI suggests organizing "${uncategorizedDoc.title}" in folder: ${folderPath.join(' > ')}`,
                    documentId: uncategorizedDoc.id,
                    recommendedFolderId: targetFolderId,
                    suggestedPath: folderPath
                  }
                }
              });
            }
          }
        }
      } catch (error) {
        console.error("Error checking for recommendations:", error);
      }
    };
    
    if (documents.length > 0 && folders.length > 0) {
      checkForRecommendations();
    }
  }, [documents, folders]);

  // Handle recommendation acceptance
  const handleAcceptRecommendation = async () => {
    if (!recommendation) return;
    
    try {
      // Update document with parent folder ID
      await supabase
        .from('documents')
        .update({ parent_folder_id: recommendation.suggestedFolderId })
        .eq('id', recommendation.documentId);
        
      // Hide recommendation
      setShowRecommendation(false);
      setRecommendation(null);
      
      // Refresh documents
      onRefresh();
      
      // Expand the folder
      setExpandedFolders(prev => ({
        ...prev,
        [recommendation.suggestedFolderId]: true
      }));
    } catch (error) {
      console.error("Error accepting recommendation:", error);
    }
  };

  // Handle search filtering
  const filteredFolders = searchQuery.trim() === "" 
    ? folders 
    : folders.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full">
        {/* Recommendation Alert */}
        {showRecommendation && recommendation && (
          <FolderRecommendationAlert
            documentTitle={recommendation.documentTitle}
            folderPath={recommendation.folderPath}
            onAccept={handleAcceptRecommendation}
            onDismiss={() => setShowRecommendation(false)}
          />
        )}
        
        {/* Folder Header with Search */}
        <FolderHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          folders={folders}
          documents={documents}
          userRole={userRole}
          onRefresh={onRefresh}
        />
        
        {/* Folder Navigation */}
        <FolderNavigation 
          folders={filteredFolders}
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
