
import { useState, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
            .maybeSingle();
            
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
          
          // Check document type
          const isForm47 = uncategorizedDoc.metadata?.formType === 'form-47' || 
                          uncategorizedDoc.title?.toLowerCase().includes('form 47') ||
                          uncategorizedDoc.title?.toLowerCase().includes('consumer proposal') ||
                          data?.content?.extracted_info?.formType === 'form-47';
                          
          const isForm76 = uncategorizedDoc.metadata?.formType === 'form-76' || 
                          uncategorizedDoc.title?.toLowerCase().includes('form 76') ||
                          data?.content?.extracted_info?.formType === 'form-76';
                          
          const isFinancial = uncategorizedDoc.title?.toLowerCase().includes('statement') ||
                            uncategorizedDoc.title?.toLowerCase().includes('sheet') ||
                            uncategorizedDoc.title?.toLowerCase().includes('budget') ||
                            uncategorizedDoc.title?.toLowerCase().includes('.xls');
          
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
              
              // Create toast notification
              toast.info(
                `New client detected: ${clientName}. Consider creating a folder.`,
                {
                  duration: 5000,
                  action: {
                    label: "Create Folder",
                    onClick: () => {
                      // This would be handled separately to create the folder
                      toast.success(`Creating folder for ${clientName}...`);
                    }
                  }
                }
              );
              
              return;
            }
            
            if (clientFolder) {
              // Find appropriate subfolder based on document type
              let targetFolderId = clientFolder.id;
              let folderPath = [clientFolder.name];
              let subfolderName = "";
              
              // Find or suggest appropriate subfolder 
              if (clientFolder.children) {
                let targetSubfolder;
                
                if (isForm47 || isForm76) {
                  // For Form 47/76, look for Forms folder
                  subfolderName = "Forms";
                  targetSubfolder = clientFolder.children.find(f => 
                    f.type === 'form' || f.name.toLowerCase().includes('form')
                  );
                } else if (isFinancial) {
                  // For financial documents, look for Financial Sheets folder
                  subfolderName = "Financial Sheets";
                  targetSubfolder = clientFolder.children.find(f => 
                    f.type === 'financial' || 
                    f.name.toLowerCase().includes('financial') ||
                    f.name.toLowerCase().includes('sheet')
                  );
                } else {
                  // For other documents, use Documents folder
                  subfolderName = "Documents";
                  targetSubfolder = clientFolder.children.find(f => 
                    f.type === 'general' || f.name.toLowerCase().includes('document')
                  );
                }
                
                if (targetSubfolder) {
                  targetFolderId = targetSubfolder.id;
                  folderPath.push(targetSubfolder.name);
                } else if (subfolderName) {
                  // If appropriate subfolder not found, suggest creating one
                  toast.info(
                    `Consider creating a "${subfolderName}" folder under ${clientFolder.name}`,
                    {
                      duration: 5000,
                      action: {
                        label: "Create Folder",
                        onClick: () => {
                          // This would be handled separately
                          toast.success(`Creating ${subfolderName} folder...`);
                        }
                      }
                    }
                  );
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
              
              // Show toast with recommendation
              toast.info(
                `AI suggests organizing "${uncategorizedDoc.title}" in folder: ${folderPath.join(' > ')}`,
                {
                  duration: 5000,
                  action: {
                    label: "Move File",
                    onClick: () => {
                      // This would need to be implemented
                      moveDocumentToFolder(uncategorizedDoc.id, targetFolderId, folderPath.join(' > '));
                    }
                  }
                }
              );
            }
          } else {
            // If no client name found but document type is recognized
            let folderType = isForm47 || isForm76 ? 'Forms' : 
                             isFinancial ? 'Financial Documents' : 'General Documents';
                             
            toast.info(
              `Document detected as "${folderType}" but no client associated`,
              {
                duration: 5000
              }
            );
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
    try {
      const { error } = await supabase
        .from('documents')
        .update({ parent_folder_id: folderId })
        .eq('id', documentId);
        
      if (error) throw error;
      
      toast.success(`Document moved to ${folderPath}`);
      setShowRecommendation(false);
      setRecommendation(null);
    } catch (error) {
      console.error("Error moving document:", error);
      toast.error("Failed to move document");
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
