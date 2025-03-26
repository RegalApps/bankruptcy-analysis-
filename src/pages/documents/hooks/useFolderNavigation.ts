
import { useState, useCallback } from "react";
import { Document } from "@/components/DocumentList/types";

export const useFolderNavigation = (documents: Document[]) => {
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "document" | undefined>(undefined);
  
  // Calculate the folder path based on selected folder
  const folderPath = useCallback(() => {
    if (!selectedItemId || selectedItemType !== "folder") return [];
    
    const path: { id: string; name: string }[] = [];
    let currentFolderId = selectedItemId;
    
    while (currentFolderId) {
      const folder = documents.find(doc => doc.id === currentFolderId && doc.is_folder);
      
      if (!folder) break;
      
      path.unshift({ id: folder.id, name: folder.title || "Unnamed Folder" });
      
      if (!folder.parent_folder_id) break;
      currentFolderId = folder.parent_folder_id;
    }
    
    return path;
  }, [selectedItemId, selectedItemType, documents]);
  
  const handleItemSelect = (itemId: string, type: "folder" | "document") => {
    setSelectedItemId(itemId);
    setSelectedItemType(type);
  };
  
  const handleOpenDocument = (documentId: string) => {
    console.log(`Opening document: ${documentId}`);
    // This would typically navigate to the document viewer
  };
  
  return {
    selectedItemId,
    selectedItemType,
    folderPath: folderPath(),
    handleItemSelect,
    handleOpenDocument
  };
};
