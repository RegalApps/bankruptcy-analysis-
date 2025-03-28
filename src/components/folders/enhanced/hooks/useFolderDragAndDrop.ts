
import { useState } from "react";

export const useFolderDragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ id: string, type: 'folder' | 'document' } | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  
  const handleDragStart = (id: string, type: 'folder' | 'document') => {
    setIsDragging(true);
    setDraggedItem({ id, type });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setDragOverFolder(null);
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
    setIsDragging(false);
    setDragOverFolder(null);
    
    // Implementation for actual drop would go here in a full version
    console.log(`Dropped item ${draggedItem?.id} of type ${draggedItem?.type} into folder ${targetFolderId}`);
    
    // Reset state
    setDraggedItem(null);
  };

  return {
    isDragging,
    draggedItem,
    dragOverFolder,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};
