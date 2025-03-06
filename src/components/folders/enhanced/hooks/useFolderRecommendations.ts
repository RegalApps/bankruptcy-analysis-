
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
            
          // Get client name from either document analysis or metadata
          let clientName = null;
          
          if (data?.content?.extracted_info?.clientName) {
            clientName = data.content.extracted_info.clientName;
          } else if (uncategorizedDoc.metadata?.clientName) {
            clientName = uncategorizedDoc.metadata.clientName;
          } else if (data?.content?.extracted_info?.consumerDebtorName) {
            // Special case for Form 47
            clientName = data.content.extracted_info.consumerDebtorName;
          }
          
          // Check if document is Form 47
          const isForm47 = uncategorizedDoc.metadata?.formType === 'form-47' || 
                          uncategorizedDoc.title?.toLowerCase().includes('form 47') ||
                          uncategorizedDoc.title?.toLowerCase().includes('consumer proposal') ||
                          data?.content?.extracted_info?.formType === 'form-47';
                          
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
              
              // Create notification suggesting new client folder
              await supabase.functions.invoke('handle-notifications', {
                body: {
                  action: 'create',
                  userId: user.id,
                  notification: {
                    title: 'New Client Detected',
                    message: `Consider creating a folder for client: ${clientName}`,
                    type: 'suggestion',
                    category: 'organization',
                    priority: 'normal',
                    action_url: `/documents`,
                    metadata: {
                      documentId: uncategorizedDoc.id,
                      clientName: clientName,
                      suggestedAction: 'create_client_folder'
                    }
                  }
                }
              });
              return;
            }
            
            if (clientFolder) {
              // Find appropriate subfolder based on document type
              let targetFolderId = clientFolder.id;
              let folderPath = [clientFolder.name];
              
              // Find or suggest appropriate subfolder 
              if (clientFolder.children) {
                let targetSubfolder;
                
                if (isForm47) {
                  // For Form 47, look for Forms folder
                  targetSubfolder = clientFolder.children.find(f => 
                    f.type === 'form' || f.name.toLowerCase().includes('form')
                  );
                } else {
                  const isFinancial = uncategorizedDoc.title.toLowerCase().includes('statement') || 
                                     uncategorizedDoc.title.toLowerCase().includes('sheet') ||
                                     uncategorizedDoc.title.toLowerCase().includes('.xls');
                                     
                  targetSubfolder = clientFolder.children.find(f => 
                    isFinancial ? f.type === 'financial' : f.type === 'form'
                  );
                }
                
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
