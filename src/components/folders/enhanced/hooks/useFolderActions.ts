
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UseFolderActionsProps {
  onSuccess: () => void;
}

export const useFolderActions = ({ onSuccess }: UseFolderActionsProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateFolder = async (name?: string, parentId?: string) => {
    if (isCreating) return;
    
    if (!name) {
      // If no name provided, this is likely a button click to open a dialog
      // The actual creation will happen when the dialog submits
      return;
    }
    
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: name.trim(),
          is_folder: true,
          type: 'folder',
          parent_folder_id: parentId || null,
          metadata: {
            created_at: new Date().toISOString()
          }
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Folder created successfully");
      onSuccess();
      return data.id;
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    if (isRenaming || !newName.trim()) return;
    
    setIsRenaming(true);
    try {
      const { error } = await supabase
        .from('documents')
        .update({ title: newName.trim() })
        .eq('id', folderId);
        
      if (error) throw error;
      
      toast.success("Folder renamed successfully");
      onSuccess();
    } catch (error) {
      console.error("Error renaming folder:", error);
      toast.error("Failed to rename folder");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      // Check if folder has subfolders or documents
      const { data: children, error: checkError } = await supabase
        .from('documents')
        .select('id')
        .eq('parent_folder_id', folderId);
      
      if (checkError) throw checkError;
      
      if (children && children.length > 0) {
        toast.error("Cannot delete non-empty folder");
        return;
      }
      
      // Delete the folder
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', folderId);
        
      if (error) throw error;
      
      toast.success("Folder deleted successfully");
      onSuccess();
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isCreating,
    isRenaming,
    isDeleting,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
  };
};
