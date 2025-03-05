
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { FolderRecommendationAlert } from "../FolderRecommendationAlert";

interface FolderOperationsProps {
  showRecommendation: boolean;
  recommendation: {
    documentId: string;
    suggestedFolderId: string;
    documentTitle: string;
    folderPath: string[];
  } | null;
  onAcceptRecommendation: () => Promise<void>;
  onDismissRecommendation: () => void;
  onRefresh: () => void;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const FolderOperations = ({
  showRecommendation,
  recommendation,
  onAcceptRecommendation,
  onDismissRecommendation,
  onRefresh,
  setExpandedFolders
}: FolderOperationsProps) => {
  
  // Handle recommendation acceptance
  const handleAcceptRecommendation = async () => {
    if (!recommendation) return;
    
    try {
      // Update document with parent folder ID
      await supabase
        .from('documents')
        .update({ parent_folder_id: recommendation.suggestedFolderId })
        .eq('id', recommendation.documentId);
        
      // Expand the folder
      setExpandedFolders(prev => ({
        ...prev,
        [recommendation.suggestedFolderId]: true
      }));
      
      // Call parent handler to perform refresh and cleanup
      await onAcceptRecommendation();
    } catch (error) {
      console.error("Error accepting recommendation:", error);
    }
  };

  return (
    <>
      {/* Recommendation Alert */}
      {showRecommendation && recommendation && (
        <FolderRecommendationAlert
          documentTitle={recommendation.documentTitle}
          folderPath={recommendation.folderPath}
          onAccept={handleAcceptRecommendation}
          onDismiss={onDismissRecommendation}
        />
      )}
      
      {/* Header with refresh button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
