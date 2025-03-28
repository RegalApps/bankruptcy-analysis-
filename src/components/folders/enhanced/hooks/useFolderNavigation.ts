
import { useState, useCallback } from "react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure } from "@/types/folders";

export const useFolderNavigation = (documents: Document[]) => {
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);
  const [selectedItemType, setSelectedItemType] = useState<"folder" | "file" | undefined>(undefined);
  
  // Calculate the folder path based on the selected folder
  const calculateFolderPath = useCallback(() => {
    if (!selectedItemId || selectedItemType !== "folder") return [];
    
    const path: { id: string; name: string }[] = [];
    let currentFolderId = selectedItemId;
    
    // In a real app, you'd traverse the folder structure
    // This is a simplified version
    const folder = documents.find(doc => doc.id === currentFolderId && doc.is_folder);
    if (folder) {
      path.push({ id: folder.id, name: folder.title || "Unnamed Folder" });
    }
    
    return path;
  }, [selectedItemId, selectedItemType, documents]);
  
  const handleItemSelect = (itemId: string, type: "folder" | "file") => {
    setSelectedItemId(itemId);
    setSelectedItemType(type);
  };
  
  return {
    selectedItemId,
    selectedItemType,
    folderPath: calculateFolderPath(),
    handleItemSelect
  };
};
