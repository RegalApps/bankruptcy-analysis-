
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

  const { folders } = useCreateFolderStructure(documents || []);

  useEffect(() => {
    if (documents) {
      const extractedClients = documents.reduce<{id: string, name: string}[]>((acc, doc) => {
        const metadata = doc.metadata as Record<string, any> || {};
        
        if (metadata?.client_id && metadata?.client_name) {
          const existingClient = acc.find(c => c.id === metadata.client_id);
          if (!existingClient) {
            acc.push({
              id: metadata.client_id,
              name: metadata.client_name
            });
          }
        }
        
        if (metadata?.clientName) {
          const clientName = metadata.clientName;
          const clientId = metadata.client_id || clientName.toLowerCase().replace(/\s+/g, '-');
          
          const existingClient = acc.find(c => c.id === clientId);
          if (!existingClient) {
            acc.push({
              id: clientId,
              name: clientName
            });
          }
        }
        
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

  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
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
        
        setHasWriteAccess(true);
        setUserRole("admin");
      } catch (error) {
        console.error("Error checking permissions:", error);
        setHasWriteAccess(false);
      }
    };
    
    checkUserPermissions();
  }, []);

  useEffect(() => {
    if (selectedItemId && folders.length > 0) {
      const selectedItem = documents?.find(doc => doc.id === selectedItemId);
      
      if (selectedItem) {
        if (selectedItem.is_folder) {
          buildFolderPath(selectedItemId);
        } else if (selectedItem.parent_folder_id) {
          buildFolderPath(selectedItem.parent_folder_id);
        } else {
          setFolderPath([]);
        }
      }
    } else {
      setFolderPath([]);
    }
  }, [selectedItemId, folders, documents]);

  const buildFolderPath = (folderId: string) => {
    const path: {id: string, name: string}[] = [];
    let currentFolderId = folderId;
    
    const currentFolder = documents?.find(doc => doc.id === currentFolderId);
    if (currentFolder) {
      path.unshift({ id: currentFolder.id, name: currentFolder.title });
    }
    
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
    navigate('/', { state: { selectedDocument: documentId } });
  };

  const toggleAccess = () => {
    setHasWriteAccess(!hasWriteAccess);
    
    if (hasWriteAccess) {
      setUserRole("viewer");
      toast.info("Switched to view-only mode");
    } else {
      setUserRole("admin");
      toast.success("Switched to edit mode");
    }
  };

  const handleClientSelect = (clientId: string) => {
    console.log(`Selecting client with ID: ${clientId}`);
    try {
      Promise.resolve(
        supabase
          .from('document_access_history')
          .insert({
            document_id: clientId,
            accessed_at: new Date().toISOString(),
            access_source: 'client_viewer'
          })
      )
      .then(() => {
        console.log('Access logged successfully');
        navigate('/', { state: { selectedClient: clientId } });
      })
      .catch((error) => {
        console.error('Error logging access:', error);
        navigate('/', { state: { selectedClient: clientId } });
      });
    } catch (error) {
      console.error('Error accessing client information:', error);
      toast.error("Could not access client information");
      
      navigate('/', { state: { selectedClient: clientId } });
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
