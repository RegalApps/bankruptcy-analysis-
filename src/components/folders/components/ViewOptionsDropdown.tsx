
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { 
  ChevronDown, 
  Grid, 
  FolderPlus, 
  FileText, 
  FolderPen, 
  FilePen, 
  Trash2,
  Settings,
  FolderSync
} from "lucide-react";
import { RenameDialog } from "./dialogs/RenameDialog";
import { DeleteDialog } from "./dialogs/DeleteDialog";
import { MergeDialog } from "./dialogs/MergeDialog"; // New import
import { documentService } from "./services/documentService";

interface ViewOptionsDropdownProps {
  onViewChange: (view: "all" | "uncategorized" | "folders") => void;
  selectedItemId?: string;
  selectedItemType?: "folder" | "file";
  onRefresh?: () => void;
  updateMergeableClientFolders?: (mergeables: Record<string, string[]>) => void;
  updateHighlightMergeTargets?: (highlight: boolean) => void;
}

export const ViewOptionsDropdown = ({ 
  onViewChange, 
  selectedItemId,
  selectedItemType,
  onRefresh 
}: ViewOptionsDropdownProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false); // New state
  const [newName, setNewName] = useState("");
  const [clientName, setClientName] = useState(""); // New state for client name
  const [actionType, setActionType] = useState<"folder" | "file">("folder");

  const handleRename = async () => {
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

  const handleDelete = async () => {
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            View Options
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Document Views</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewChange("all")} role="button">
            <Grid className="h-4 w-4 mr-2" />
            All Documents
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange("folders")} role="button">
            <FolderPlus className="h-4 w-4 mr-2" />
            Folder View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange("uncategorized")} role="button">
            <FileText className="h-4 w-4 mr-2" />
            Uncategorized
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>
            <Settings className="h-4 w-4 inline mr-2" />
            Tools
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            onClick={() => handleToolAction('rename', 'folder')}
          >
            <FolderPen className="h-4 w-4 mr-2" />
            Rename Folder
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleToolAction('rename', 'file')}
          >
            <FilePen className="h-4 w-4 mr-2" />
            Rename File
          </DropdownMenuItem>
          
          {/* New Merge Folders option */}
          <DropdownMenuItem 
            onClick={() => handleToolAction('merge')}
          >
            <FolderSync className="h-4 w-4 mr-2" />
            Merge Client Folders
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleToolAction('delete', 'folder')}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Folder
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleToolAction('delete', 'file')}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        itemType={actionType}
        newName={newName}
        onNewNameChange={setNewName}
        onRename={handleRename}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemType={actionType}
        onDelete={handleDelete}
      />

      {/* New MergeDialog component */}
      <MergeDialog
        isOpen={isMergeDialogOpen}
        onOpenChange={setIsMergeDialogOpen}
        clientName={clientName}
        onClientNameChange={setClientName}
        onMerge={handleMerge}
      />
    </>
  );
};
