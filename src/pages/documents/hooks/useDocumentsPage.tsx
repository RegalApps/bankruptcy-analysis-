
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useCreateFolderStructure } from "@/components/folders/enhanced/hooks/useCreateFolderStructure";
import { useClientsData } from "./useClientsData";
import { useFolderNavigation } from "./useFolderNavigation";
import { useAccessPermissions } from "./useAccessPermissions";

export const useDocumentsPage = () => {
  const { documents, refetch, isLoading } = useDocuments();
  const { folders } = useCreateFolderStructure(documents || []);
  
  // Use our new focused hooks
  const { clients, handleClientSelect } = useClientsData(documents);
  
  const {
    selectedItemId,
    selectedItemType,
    folderPath,
    handleItemSelect,
    handleOpenDocument
  } = useFolderNavigation(documents);
  
  const {
    hasWriteAccess,
    userRole,
    toggleAccess
  } = useAccessPermissions();

  return {
    // Document data
    documents,
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
