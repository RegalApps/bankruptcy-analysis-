
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
  Tool
} from "lucide-react";
import { RenameDialog } from "./dialogs/RenameDialog";
import { DeleteDialog } from "./dialogs/DeleteDialog";
import { documentService } from "./services/documentService";

interface ViewOptionsDropdownProps {
  onViewChange: (view: "all" | "uncategorized" | "folders") => void;
  selectedItemId?: string;
  selectedItemType?: "folder" | "file";
  onRefresh?: () => void;
}

export const ViewOptionsDropdown = ({ 
  onViewChange, 
  selectedItemId,
  selectedItemType,
  onRefresh 
}: ViewOptionsDropdownProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
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

  const handleToolAction = (action: 'rename' | 'delete', type: 'folder' | 'file') => {
    setActionType(type);
    if (action === 'rename') {
      setIsRenameDialogOpen(true);
    } else {
      setIsDeleteDialogOpen(true);
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
            <Tool className="h-4 w-4 inline mr-2" />
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
    </>
  );
};
