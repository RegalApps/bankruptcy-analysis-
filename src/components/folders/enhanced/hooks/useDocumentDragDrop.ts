
import { useState } from "react";

export const useDocumentDragDrop = (onRefresh: () => void) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedItemType, setDraggedItemType] = useState<'folder' | 'document' | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  
  const handleDragStart = (id: string, type: 'folder' | 'document') => {
    setDraggedItemId(id);
    setDraggedItemType(type);
  };
  
  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolder(folderId);
  };
  
  const handleDragLeave = () => {
    setDragOverFolder(null);
  };
  
  const handleDrop = async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    
    if (!draggedItemId || !draggedItemType) return;
    
    // In a real app, you would make an API call to move the item
    console.log(`Moving ${draggedItemType} ${draggedItemId} to folder ${targetFolderId}`);
    
    // Reset drag state
    setDraggedItemId(null);
    setDraggedItemType(null);
    
    // Refresh folder view
    onRefresh();
  };
  
  return {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    dragOverFolder
  };
};
