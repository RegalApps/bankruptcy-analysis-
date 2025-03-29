
import { useEffect, useState } from "react";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useCreateFolderStructure } from "@/components/folders/enhanced/hooks/useCreateFolderStructure";
import { useFolderNavigation } from "./useFolderNavigation";

interface Client {
  id: string;
  name: string;
  status?: string;
  location?: string;
  lastActivity?: string;
}

export const useDocumentsPage = () => {
  const { documents, refetch, isLoading } = useDocuments();
  const { folders } = useCreateFolderStructure(documents || []);
  
  const [clients, setClients] = useState<Client[]>([]);
  
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
  const handleItemSelect = (id: string, type: "folder" | "file") => {
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
        const metadata = doc?.metadata as any || {};
        
        return {
          id: clientId,
          name: metadata.client_name || `Client ${clientId}`,
          status: metadata.status || "Active",
          location: metadata.location || metadata.province || null,
          lastActivity: doc?.updated_at || null
        };
      });

      // Add special Josh Hart client for demo purposes
      if (!uniqueClients.some(c => c.id === 'josh-hart')) {
        uniqueClients.push({
          id: 'josh-hart',
          name: 'Josh Hart',
          status: 'Active',
          location: 'Ontario',
          lastActivity: new Date().toISOString()
        });
      }

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
    
    // Event handlers
    handleItemSelect,
    handleOpenDocument,
    handleClientSelect
  };
};
