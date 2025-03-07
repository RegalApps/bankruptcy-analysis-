
import { useState, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { FolderRecommendation, FolderRecommendationHookResult } from "./types/folderTypes";
import { 
  isDocumentForm47, 
  isDocumentForm76, 
  isFinancialDocument,
  extractClientName,
  findAppropriateSubfolder
} from "./utils/folderIdentificationUtils";
import {
  suggestNewClientFolder,
  suggestNewSubfolder,
  notifyFolderRecommendation,
  notifyDocumentTypeNoClient,
  moveDocumentToFolder as moveDocument
} from "./services/folderRecommendationService";

export const useFolderRecommendations = (
  documents: Document[],
  folders: FolderStructure[]
): FolderRecommendationHookResult => {
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
            .maybeSingle();
            
          // Get client name from document
          const clientName = extractClientName(uncategorizedDoc, data);
          
          // Check document type
          const isForm47 = isDocumentForm47(uncategorizedDoc, data);
          const isForm76 = isDocumentForm76(uncategorizedDoc, data);
          const isFinancial = isFinancialDocument(uncategorizedDoc);
          
          if (clientName) {
            console.log("Found client name for folder recommendation:", clientName);
            
            // Find matching client folder
            const clientFolder = folders.find(f => 
              f.type === 'client' && 
              f.name.toLowerCase() === clientName.toLowerCase()
            );
            
            // If client folder not found, suggest creating one
            if (!clientFolder && clientName) {
              console.log("Client folder not found, suggesting creation");
              
              // Suggest creating a new client folder
              await suggestNewClientFolder(user.id, uncategorizedDoc.id, clientName);
              return;
            }
            
            if (clientFolder) {
              // Find appropriate subfolder based on document type
              const { targetFolderId, folderPath, suggestedSubfolderName } = findAppropriateSubfolder(
                clientFolder,
                isForm47,
                isForm76,
                isFinancial
              );
              
              // If we got a suggested subfolder name but no matching folder was found,
              // suggest creating that subfolder
              if (suggestedSubfolderName) {
                suggestNewSubfolder(suggestedSubfolderName, clientFolder.name);
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
              await notifyFolderRecommendation(
                user.id,
                uncategorizedDoc.id,
                uncategorizedDoc.title,
                targetFolderId,
                folderPath
              );
            }
          } else {
            // If no client name found but document type is recognized
            let folderType = isForm47 || isForm76 ? 'Forms' : 
                             isFinancial ? 'Financial Documents' : 'General Documents';
                             
            notifyDocumentTypeNoClient(folderType);
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

  // Helper function to move document to folder
  const moveDocumentToFolder = async (documentId: string, folderId: string, folderPath: string) => {
    const success = await moveDocument(documentId, folderId, folderPath);
    if (success) {
      setShowRecommendation(false);
      setRecommendation(null);
    }
  };

  // Helper function to reset recommendation
  const dismissRecommendation = () => {
    setShowRecommendation(false);
    setRecommendation(null);
  };

  return {
    showRecommendation,
    recommendation,
    setShowRecommendation,
    dismissRecommendation,
    moveDocumentToFolder
  };
};
