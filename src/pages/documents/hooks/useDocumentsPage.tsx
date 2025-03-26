
import { useEffect, useState } from "react";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useCreateFolderStructure } from "@/components/folders/enhanced/hooks/useCreateFolderStructure";
import { useFolderNavigation } from "./useFolderNavigation";
import { useAccessPermissions } from "./useAccessPermissions";

export const useDocumentsPage = () => {
  const { documents, refetch, isLoading } = useDocuments();
  const { folders } = useCreateFolderStructure(documents || []);
  
  const [clients, setClients] = useState<any[]>([]);
  
  const handleClientSelect = (clientId: string) => {
    console.log("Selected client:", clientId);
    // Implementation would go here in a real app
  };
  
  const {
    selectedItemId,
    selectedItemType,
    folderPath,
    handleItemSelect: originalHandleItemSelect,
    handleOpenDocument
  } = useFolderNavigation(documents || []);
  
  // Create a wrapper function to map between the different type systems
  const handleItemSelect = (id: string, type: "folder" | "file" | "document") => {
    // If type is "document", map it to "file" for consistency
    // If type is "file", map it to "document" for the underlying function
    if (type === "file") {
      originalHandleItemSelect(id, "file" as any);
    } else {
      originalHandleItemSelect(id, type as any);
    }
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
    folderPath,
    
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
