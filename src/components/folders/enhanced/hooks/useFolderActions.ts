
import { useState } from "react";
import { Document } from "@/components/DocumentList/types";

export const useFolderActions = (documents: Document[]) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    
    // Build folder path
    const buildFolderPath = (currentId: string, path: { id: string; name: string }[] = []) => {
      const folder = documents.find(doc => doc.id === currentId && doc.is_folder);
      
      if (!folder) return path;
      
      const updatedPath = [{ id: folder.id, name: folder.title || 'Unnamed folder' }, ...path];
      
      if (folder.parent_folder_id) {
        return buildFolderPath(folder.parent_folder_id, updatedPath);
      }
      
      return updatedPath;
    };
    
    const newPath = buildFolderPath(folderId);
    setFolderPath(newPath);
  };

  const handleCreateFolder = async (name?: string, parentId?: string) => {
    if (!name) return null;
    
    setIsCreating(true);
    
    try {
      // Mock implementation - would use API in real application
      console.log(`Creating folder: ${name} under parent: ${parentId || 'root'}`);
      // Simulate success
      setTimeout(() => {
        setIsCreating(false);
      }, 500);
      return "new-folder-id";
    } catch (error) {
      console.error("Error creating folder:", error);
      setIsCreating(false);
      return null;
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    if (!newName.trim()) return false;
    
    setIsRenaming(true);
    
    try {
      // Mock implementation - would use API in real application
      console.log(`Renaming folder ${folderId} to ${newName}`);
      // Simulate success
      setTimeout(() => {
        setIsRenaming(false);
      }, 500);
      return true;
    } catch (error) {
      console.error("Error renaming folder:", error);
      setIsRenaming(false);
      return false;
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    setIsDeleting(true);
    
    try {
      // Mock implementation - would use API in real application
      console.log(`Deleting folder ${folderId}`);
      // Simulate success
      setTimeout(() => {
        setIsDeleting(false);
      }, 500);
      return true;
    } catch (error) {
      console.error("Error deleting folder:", error);
      setIsDeleting(false);
      return false;
    }
  };

  return {
    folderPath,
    selectedFolder,
    handleFolderSelect,
    isCreating,
    isRenaming,
    isDeleting,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder
  };
};
