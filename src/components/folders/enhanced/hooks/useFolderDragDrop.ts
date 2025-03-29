
import { useState } from "react";
import { Document } from "@/components/client/types";

export const useFolderDragDrop = (documents: Document[]) => {
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [setExpandedFoldersFunction, setSetExpandedFoldersFunction] = useState<React.Dispatch<React.SetStateAction<Record<string, boolean>>> | null>(null);

  // Set the setExpandedFolders function for later use
  const setExpandedFolders = (func: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => {
    setSetExpandedFoldersFunction(() => func);
  };

  // Start drag operation
  const handleDragStart = (id: string, type: 'folder' | 'document') => {
    // Set data in the drag event
    const event = window.event as DragEvent;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', JSON.stringify({ id, type }));
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  // Handle drag over a folder
  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(folderId);
    
    // Expand the folder after hovering for a moment
    if (setExpandedFoldersFunction) {
      setTimeout(() => {
        setExpandedFoldersFunction(prev => ({
          ...prev,
          [folderId]: true
        }));
      }, 1000);
    }
  };

  // Handle drag leaving a folder
  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  // Handle dropping an item onto a folder
  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(null);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { id, type } = data;
      
      if (id === targetFolderId) {
        // Cannot drop onto itself
        return;
      }
      
      console.log(`Moving ${type} with ID ${id} to folder ${targetFolderId}`);
      
      // TODO: Implement actual moveToFolder logic
      // For now, we'll just log the operation
    } catch (error) {
      console.error('Error processing drop:', error);
    }
  };

  return {
    dragOverFolder,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setExpandedFoldersFunction: setExpandedFolders
  };
};
