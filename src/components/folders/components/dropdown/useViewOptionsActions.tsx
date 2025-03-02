
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { documentService } from "../services/documentService";

interface ViewOptionsActionsProps {
  onRefresh?: () => void;
  updateMergeableClientFolders?: (mergeables: Record<string, string[]>) => void;
  updateHighlightMergeTargets?: (highlight: boolean) => void;
  selectedItemId?: string;
  selectedItemType?: "folder" | "file";
}

export const useViewOptionsActions = ({
  onRefresh,
  updateMergeableClientFolders,
  updateHighlightMergeTargets,
  selectedItemId,
  selectedItemType
}: ViewOptionsActionsProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [clientName, setClientName] = useState("");
  const [actionType, setActionType] = useState<"folder" | "file">("folder");
  const [isMerging, setIsMerging] = useState(false);
  const [mergeableClientFolders, setMergeableClientFolders] = useState<Record<string, string[]>>({});
  const [folderNames, setFolderNames] = useState<Record<string, string>>({});

  // When selected item changes, update the action type
  useEffect(() => {
    if (selectedItemType) {
      setActionType(selectedItemType);
    }
  }, [selectedItemType]);

  const handleRename = async (itemId?: string) => {
    if (!itemId || !newName.trim()) return;

    try {
      await documentService.renameItem(itemId, newName);
      toast.success(`${actionType === 'folder' ? 'Folder' : 'File'} renamed successfully`);
      setIsRenameDialogOpen(false);
      setNewName("");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error renaming:', error);
      toast.error(`Failed to rename ${actionType}`);
    }
  };

  const handleDelete = async (itemId?: string) => {
    if (!itemId) return;

    try {
      await documentService.deleteItem(itemId, actionType);
      toast.success(`${actionType === 'folder' ? 'Folder' : 'File'} deleted successfully`);
      setIsDeleteDialogOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting:', error);
      const errorMessage = error instanceof Error ? error.message : `Failed to delete ${actionType}`;
      toast.error(errorMessage);
    }
  };

  const handleMerge = async () => {
    if (!clientName.trim()) return;

    setIsMerging(true);
    try {
      const success = await documentService.mergeClientFolders(clientName);
      if (success) {
        toast.success(`Folders for client "${clientName}" merged successfully`);
        setIsMergeDialogOpen(false);
        setClientName("");
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Error merging folders:', error);
      toast.error("Failed to merge folders");
    } finally {
      setIsMerging(false);
    }
  };

  const handleToolAction = (action: 'rename' | 'delete' | 'merge', type?: 'folder' | 'file') => {
    if (action === 'rename') {
      const effectiveType = type || selectedItemType || 'folder';
      setActionType(effectiveType);
      if (selectedItemId) {
        // Pre-load the current name if we have it
        documentService.getItemName(selectedItemId)
          .then(name => {
            if (name) setNewName(name);
            setIsRenameDialogOpen(true);
          })
          .catch(err => {
            console.error("Failed to get item name:", err);
            setNewName("");
            setIsRenameDialogOpen(true);
          });
      } else {
        setNewName("");
        setIsRenameDialogOpen(true);
      }
    } else if (action === 'delete') {
      setActionType(type || selectedItemType || 'folder');
      setIsDeleteDialogOpen(true);
    } else if (action === 'merge') {
      setIsMergeDialogOpen(true);
    }
  };

  // Determine if tools should be disabled based on selection
  const isFileActionDisabled = (
    actionType: 'folder' | 'file', 
    itemId?: string, 
    itemType?: 'folder' | 'file'
  ) => {
    if (!itemId) return true;
    if (itemType !== actionType) return true;
    return false;
  };

  return {
    isRenameDialogOpen,
    setIsRenameDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isMergeDialogOpen,
    setIsMergeDialogOpen,
    newName,
    setNewName,
    clientName,
    setClientName,
    actionType,
    isMerging,
    mergeableClientFolders,
    setMergeableClientFolders,
    folderNames,
    setFolderNames,
    handleRename,
    handleDelete,
    handleMerge,
    handleToolAction,
    isFileActionDisabled
  };
};
