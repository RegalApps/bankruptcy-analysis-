
import { useState, useEffect } from "react";
import { Document } from "@/components/DocumentList/types";
import { useNavigate } from "react-router-dom";

export const useFolderNavigation = (documents: Document[] | undefined) => {
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "file" | undefined>();
  const [folderPath, setFolderPath] = useState<{id: string, name: string}[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedItemId && documents && documents.length > 0) {
      const selectedItem = documents.find(doc => doc.id === selectedItemId);
      
      if (selectedItem) {
        if (selectedItem.is_folder) {
          buildFolderPath(selectedItemId, documents);
        } else if (selectedItem.parent_folder_id) {
          buildFolderPath(selectedItem.parent_folder_id, documents);
        } else {
          setFolderPath([]);
        }
      }
    } else {
      setFolderPath([]);
    }
  }, [selectedItemId, documents]);

  const buildFolderPath = (folderId: string, docs: Document[]) => {
    const path: {id: string, name: string}[] = [];
    
    const findParentFolders = (currentId: string) => {
      const currentFolder = docs.find(doc => doc.id === currentId);
      if (!currentFolder) return;
      
      path.unshift({ id: currentFolder.id, name: currentFolder.title || 'Unnamed Folder' });
      
      if (currentFolder.parent_folder_id) {
        findParentFolders(currentFolder.parent_folder_id);
      }
    };
    
    findParentFolders(folderId);
    setFolderPath(path);
  };

  const handleItemSelect = (id: string, type: "folder" | "file") => {
    setSelectedItemId(id);
    setSelectedItemType(type);
  };

  const handleOpenDocument = (documentId: string) => {
    navigate('/', { state: { selectedDocument: documentId } });
  };

  return {
    selectedItemId,
    selectedItemType,
    folderPath,
    handleItemSelect,
    handleOpenDocument
  };
};
