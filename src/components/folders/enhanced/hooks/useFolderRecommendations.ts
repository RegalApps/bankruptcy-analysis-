
import { useState, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";
import { supabase } from "@/lib/supabase";

interface FolderRecommendation {
  documentId: string;
  suggestedFolderId: string;
  documentTitle: string;
  folderPath: string[];
}

export const useFolderRecommendations = (
  documents: Document[],
  folders: FolderStructure[]
) => {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<FolderRecommendation | null>(null);
  
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

  // Helper function to reset recommendation
  const dismissRecommendation = () => {
    setShowRecommendation(false);
    setRecommendation(null);
  };

  return {
    showRecommendation,
    recommendation,
    setShowRecommendation,
    dismissRecommendation
  };
};
