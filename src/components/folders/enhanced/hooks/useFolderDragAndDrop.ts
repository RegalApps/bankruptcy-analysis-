
import { useState } from "react";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UseFolderDragAndDropProps {
  onDropSuccess: () => void;
}

export const useFolderDragAndDrop = ({ onDropSuccess }: UseFolderDragAndDropProps) => {
  const [draggedItem, setDraggedItem] = useState<{ id: string, type: 'folder' | 'document' } | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  
  const handleDragStart = (id: string, type: 'folder' | 'document') => {
    setDraggedItem({ id, type });
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
    
    if (!draggedItem) return;
    
    try {
      if (draggedItem.type === 'document') {
        // Move document to target folder
        const { error } = await supabase
          .from('documents')
          .update({ parent_folder_id: targetFolderId })
          .eq('id', draggedItem.id);
          
        if (error) throw error;
        
        toast.success("Document moved successfully");
        onDropSuccess();
      } else if (draggedItem.type === 'folder') {
        // Cannot move a folder into itself
        if (targetFolderId === draggedItem.id) {
          toast.error("Cannot move a folder into itself");
          return;
        }
        
        // Move folder to target folder
        const { error } = await supabase
          .from('documents')
          .update({ parent_folder_id: targetFolderId })
          .eq('id', draggedItem.id);
          
        if (error) throw error;
        
        toast.success("Folder moved successfully");
        onDropSuccess();
      }
    } catch (error) {
      console.error("Error moving item:", error);
      toast.error("Failed to move item");
    } finally {
      setDraggedItem(null);
    }
  };

  return {
    draggedItem,
    dragOverFolder,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
