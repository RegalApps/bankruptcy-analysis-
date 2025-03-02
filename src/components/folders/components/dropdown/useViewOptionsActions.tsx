
import { useState } from "react";
import { toast } from "sonner";
import { documentService } from "../services/documentService";

interface ViewOptionsActionsProps {
  onRefresh?: () => void;
  updateMergeableClientFolders?: (mergeables: Record<string, string[]>) => void;
  updateHighlightMergeTargets?: (highlight: boolean) => void;
}

export const useViewOptionsActions = ({
  onRefresh,
  updateMergeableClientFolders,
  updateHighlightMergeTargets
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

  const handleRename = async (selectedItemId?: string) => {
    if (!selectedItemId || !newName.trim()) return;

    try {
      await documentService.renameItem(selectedItemId, newName);
      toast.success(`${actionType === 'folder' ? 'Folder' : 'File'} renamed successfully`);
      setIsRenameDialogOpen(false);
      setNewName("");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error renaming:', error);
      toast.error(`Failed to rename ${actionType}`);
    }
  };

  const handleDelete = async (selectedItemId?: string) => {
    if (!selectedItemId) return;

    try {
      await documentService.deleteItem(selectedItemId, actionType);
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
      setActionType(type || 'folder');
      setIsRenameDialogOpen(true);
    } else if (action === 'delete') {
      setActionType(type || 'folder');
      setIsDeleteDialogOpen(true);
    } else if (action === 'merge') {
      setIsMergeDialogOpen(true);
    }
  };

  // Determine if tools should be disabled based on selection
  const isFileActionDisabled = (actionType: 'folder' | 'file', selectedItemId?: string, selectedItemType?: 'folder' | 'file') => {
    if (!selectedItemId) return true;
    if (selectedItemType !== actionType) return true;
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
