
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useFolderDragDrop = (documents: any[]) => {
  const [draggedItem, setDraggedItem] = useState<{ id: string, type: 'folder' | 'document' } | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleDragStart = (id: string, type: 'folder' | 'document') => {
    setDraggedItem({ id, type });
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolder(folderId);
    
    // Auto-expand folder when dragging over it
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setExpandedFolders(prev => ({
        ...prev,
        [folderId]: true
      }));
    }, 1000); // Expand after hovering for 1 second
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    
    if (!draggedItem) return;
    
    try {
      if (draggedItem.type === 'document') {
        // Move document to target folder
        const { error } = await supabase
          .from('documents')
          .update({ parent_folder_id: targetFolderId })
          .eq('id', draggedItem.id);
          
        if (error) throw error;
        
        // Show success message
        toast.success("Document moved successfully");
      } else if (draggedItem.type === 'folder') {
        // Validate: Can't move a folder into its own child
        let isValidMove = true;
        let currentFolderId = targetFolderId;
        
        // Check if target folder is a descendant of the dragged folder
        while (currentFolderId) {
          if (currentFolderId === draggedItem.id) {
            isValidMove = false;
            break;
          }
          
          const parentFolder = documents.find(
            doc => doc.is_folder && doc.id === currentFolderId
          );
          
          currentFolderId = parentFolder?.parent_folder_id || null;
        }
        
        if (!isValidMove) {
          toast.error("Cannot move a folder into its own subfolder");
          return;
        }
        
        // Move folder to target folder
        const { error } = await supabase
          .from('documents')
          .update({ parent_folder_id: targetFolderId })
          .eq('id', draggedItem.id);
          
        if (error) throw error;
        
        // Show success message
        toast.success("Folder moved successfully");
      }
    } catch (error) {
      console.error("Error moving item:", error);
      toast.error("Failed to move item");
    } finally {
      setDraggedItem(null);
    }
  };

  // Need to be passed in as a parameter since it's defined in the parent component
  let setExpandedFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  const setExpandedFoldersFunction = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => {
    setExpandedFolders = setter;
  };

  return {
    draggedItem,
    dragOverFolder,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setExpandedFoldersFunction
  };
};
