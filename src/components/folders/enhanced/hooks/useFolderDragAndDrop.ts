
import { useState } from "react";
import { Document } from "@/components/DocumentList/types";

export type DraggedItem = {
  id: string;
  type: "folder" | "document";
};

export const useFolderDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (id: string, type: "folder" | "document") => {
    setDraggedItem({ id, type });
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverFolder(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== folderId) {
      setDragOverFolder(folderId);
    }
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    setIsDragging(false);
    
    if (!draggedItem) return;
    
    console.log(`Dropped ${draggedItem.type} ${draggedItem.id} onto folder ${targetFolderId}`);
    
    // This would typically update the database to move the item
    // For now, just log the action and you can implement the actual API call later
    
    setDraggedItem(null);
  };
  
  // Function to provide the setExpandedFolders from parent
  let setExpandedFoldersFunction: React.Dispatch<React.SetStateAction<Record<string, boolean>>> | null = null;
  
  const setExpandedFoldersForDrag = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => {
    setExpandedFoldersFunction = setter;
  };

  return {
    draggedItem,
    dragOverFolder,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setExpandedFoldersFunction: setExpandedFoldersForDrag
  };
};
