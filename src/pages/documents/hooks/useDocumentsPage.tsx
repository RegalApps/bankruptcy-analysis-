
import { useState, useEffect } from "react";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useNavigate } from "react-router-dom";
import { useCreateFolderStructure } from "@/components/folders/enhanced/hooks/useCreateFolderStructure";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Document } from "@/components/DocumentList/types";

export const useDocumentsPage = () => {
  const { documents, refetch, isLoading } = useDocuments();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "file" | undefined>();
  const [folderPath, setFolderPath] = useState<{id: string, name: string}[]>([]);
  const [hasWriteAccess, setHasWriteAccess] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("viewer");
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);
  const navigate = useNavigate();

  // Get folder structure for breadcrumb path
  const { folders } = useCreateFolderStructure(documents || []);

  // Extract clients from documents
  useEffect(() => {
    if (documents) {
      const extractedClients = documents.reduce<{id: string, name: string}[]>((acc, doc) => {
        const metadata = doc.metadata as Record<string, any> || {};
        
        // Check for client_id and client_name in metadata
        if (metadata?.client_id && metadata?.client_name) {
          const existingClient = acc.find(c => c.id === metadata.client_id);
          if (!existingClient) {
            acc.push({
              id: metadata.client_id,
              name: metadata.client_name
            });
          }
        }
        
        // Check for clientName in metadata (alternative format)
        if (metadata?.clientName) {
          const clientName = metadata.clientName;
          // Create a consistent client ID from the name if no explicit ID exists
          const clientId = metadata.client_id || clientName.toLowerCase().replace(/\s+/g, '-');
          
          const existingClient = acc.find(c => c.id === clientId);
          if (!existingClient) {
            acc.push({
              id: clientId,
              name: clientName
            });
          }
        }
        
        // Check for metadata from folder structure
        if (doc.is_folder && doc.folder_type === 'client') {
          const existingClient = acc.find(c => c.id === doc.id);
          if (!existingClient) {
            acc.push({
              id: doc.id,
              name: doc.title
            });
          }
        }
        
        return acc;
      }, []);
      
      console.log("Extracted clients:", extractedClients);
      setClients(extractedClients);
    }
  }, [documents]);

  // Check user's role and permissions
  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        // Get current user
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error);
          setHasWriteAccess(false);
          return;
        }
        
        if (!user) {
          setHasWriteAccess(false);
          return;
        }
        
        // For this implementation, we'll default to having write access
        // In a real app, you would check against user roles in your database
        setHasWriteAccess(true);
        setUserRole("admin"); // Default to admin for demonstration
      } catch (error) {
        console.error("Error checking permissions:", error);
        setHasWriteAccess(false);
      }
    };
    
    checkUserPermissions();
  }, []);

  useEffect(() => {
    // Update folder path when selected item changes
    if (selectedItemId && folders.length > 0) {
      // Find selected item
      const selectedItem = documents?.find(doc => doc.id === selectedItemId);
      
      if (selectedItem) {
        if (selectedItem.is_folder) {
          // Build path for folder
          buildFolderPath(selectedItemId);
        } else if (selectedItem.parent_folder_id) {
          // Build path for document's parent folder
          buildFolderPath(selectedItem.parent_folder_id);
        } else {
          // Reset path if no parent folder
          setFolderPath([]);
        }
      }
    } else {
      // Reset path if no selected item
      setFolderPath([]);
    }
  }, [selectedItemId, folders, documents]);

  // Build folder path array by traversing folder hierarchy
  const buildFolderPath = (folderId: string) => {
    const path: {id: string, name: string}[] = [];
    let currentFolderId = folderId;
    
    // Add current folder
    const currentFolder = documents?.find(doc => doc.id === currentFolderId);
    if (currentFolder) {
      path.unshift({ id: currentFolder.id, name: currentFolder.title });
    }
    
    // Traverse up the folder hierarchy
    while (currentFolder?.parent_folder_id) {
      const parentFolder = documents?.find(doc => doc.id === currentFolder.parent_folder_id);
      if (parentFolder) {
        path.unshift({ id: parentFolder.id, name: parentFolder.title });
        currentFolderId = parentFolder.id;
      } else {
        break;
      }
    }
    
    setFolderPath(path);
  };

  const handleItemSelect = (id: string, type: "folder" | "file") => {
    setSelectedItemId(id);
    setSelectedItemType(type);
  };

  const handleOpenDocument = (documentId: string) => {
    // Navigate to the home page with the selected document ID in the state
    navigate('/', { state: { selectedDocument: documentId } });
  };

  // Toggle user access
  const toggleAccess = () => {
    setHasWriteAccess(!hasWriteAccess);
    
    // In a real application, you would update the user's role in your database
    if (hasWriteAccess) {
      setUserRole("viewer");
      toast.info("Switched to view-only mode");
    } else {
      setUserRole("admin");
      toast.success("Switched to edit mode");
    }
  };

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    console.log(`Selecting client with ID: ${clientId}`);
    try {
      // Log access to client documents
      supabase
        .from('document_access_history')
        .insert({
          document_id: clientId,
          accessed_at: new Date().toISOString(),
          access_source: 'client_viewer'
        })
        .then(() => {
          console.log('Access logged successfully');
        })
        .catch((error) => {
          console.error('Error logging access:', error);
        });
      
      // Navigate to the client viewer page
      navigate('/', { state: { selectedClient: clientId } });
    } catch (error) {
      console.error('Error accessing client information:', error);
      toast.error("Could not access client information");
    }
  };

  return {
    documents,
    refetch,
    isLoading,
    selectedItemId,
    selectedItemType,
    folderPath,
    hasWriteAccess,
    userRole,
    clients,
    folders,
    handleItemSelect,
    handleOpenDocument,
    toggleAccess,
    handleClientSelect
  };
};
