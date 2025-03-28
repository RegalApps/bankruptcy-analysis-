
import { useEffect, useState } from "react";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useCreateFolderStructure } from "@/components/folders/enhanced/hooks/useCreateFolderStructure";
import { useFolderNavigation } from "./useFolderNavigation";
import { useAccessPermissions } from "./useAccessPermissions";

export const useDocumentsPage = () => {
  const { documents, refetch, isLoading } = useDocuments();
  // Fix: Pass the second required parameter (selectedFolderId) to useCreateFolderStructure
  const { folders, folderPath } = useCreateFolderStructure(documents || [], null);
  
  const [clients, setClients] = useState<any[]>([]);
  
  const handleClientSelect = (clientId: string) => {
    console.log("Selected client:", clientId);
    // Implementation would go here in a real app
  };
  
  const {
    selectedItemId,
    selectedItemType,
    folderPath: navigationFolderPath,
    handleItemSelect: originalHandleItemSelect,
    handleOpenDocument
  } = useFolderNavigation(documents || []);
  
  // Create a wrapper function to map between the different type systems
  const handleItemSelect = (id: string, type: "folder" | "file") => {
    // This ensures consistency across the application
    originalHandleItemSelect(id, type);
  };
  
  const {
    hasWriteAccess,
    userRole,
    toggleAccess
  } = useAccessPermissions();

  // Extract clients from documents
  useEffect(() => {
    if (documents && documents.length > 0) {
      // Extract unique client information from documents
      const uniqueClients = Array.from(
        new Set(
          documents
            .filter(doc => doc.metadata && (doc.metadata as any).client_id)
            .map(doc => (doc.metadata as any).client_id)
        )
      ).map(clientId => {
        const doc = documents.find(d => (d.metadata as any).client_id === clientId);
        return {
          id: clientId,
          name: (doc?.metadata as any).client_name || `Client ${clientId}`,
        };
      });

      setClients(uniqueClients);
    }
  }, [documents]);

  return {
    // Document data
    documents: documents || [],
    refetch,
    isLoading,
    folders,
    
    // Navigation state
    selectedItemId,
    selectedItemType,
    folderPath: navigationFolderPath, // Use folderPath from navigation hook
    
    // Access control
    hasWriteAccess,
    userRole,
    
    // Client data
    clients,
    
    // Event handlers
    handleItemSelect,
    handleOpenDocument,
    toggleAccess,
    handleClientSelect
  };
};
