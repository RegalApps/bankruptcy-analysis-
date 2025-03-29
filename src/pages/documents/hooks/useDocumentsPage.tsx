
import { useEffect, useState } from "react";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useCreateFolderStructure } from "@/components/folders/enhanced/hooks/useCreateFolderStructure";
import { useFolderNavigation } from "./useFolderNavigation";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

export const useDocumentsPage = () => {
  const { documents, refetch, isLoading } = useDocuments();
  const { folders } = useCreateFolderStructure(documents || []);
  const location = useLocation();
  
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  // Get client from location state if available
  useEffect(() => {
    const state = location.state as { selectedClient?: string } | null;
    if (state?.selectedClient) {
      console.log("Found selected client in location state:", state.selectedClient);
      setSelectedClient(state.selectedClient);
    }
  }, [location]);
  
  const handleClientSelect = (clientId: string) => {
    console.log("Selected client:", clientId);
    setSelectedClient(clientId);
    
    // In a real app, we would log access to the client
    try {
      console.log('Access to client logged:', clientId);
      toast.success(`Client ${clientId} information loaded`);
    } catch (error) {
      console.error('Error accessing client information:', error);
      toast.error("Could not access client information");
    }
  };
  
  const {
    selectedItemId,
    selectedItemType,
    folderPath,
    handleItemSelect: originalHandleItemSelect,
    handleOpenDocument
  } = useFolderNavigation(documents || []);
  
  // Create a wrapper function to map between the different type systems
  const handleItemSelect = (id: string, type: "folder" | "file") => {
    // Clear selected client when selecting a folder or file
    if (selectedClient) {
      setSelectedClient(null);
    }
    
    // This ensures consistency across the application
    originalHandleItemSelect(id, type);
  };

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
    
    // Client data
    clients,
    selectedClient,
    
    // Event handlers
    handleItemSelect,
    handleOpenDocument,
    handleClientSelect
  };
};
