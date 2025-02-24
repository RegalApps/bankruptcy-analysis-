
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
import { ChevronDown, Grid, FolderPlus, FileText, FolderPen, FilePen, Trash2 } from "lucide-react";
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

  const handleRename = async () => {
    if (!selectedItemId || !newName.trim()) return;

    try {
      await documentService.renameItem(selectedItemId, newName);
      toast.success(`${selectedItemType === 'folder' ? 'Folder' : 'File'} renamed successfully`);
      setIsRenameDialogOpen(false);
      setNewName("");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error renaming:', error);
      toast.error(`Failed to rename ${selectedItemType}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedItemId || !selectedItemType) return;

    try {
      await documentService.deleteItem(selectedItemId, selectedItemType);
      toast.success(`${selectedItemType === 'folder' ? 'Folder' : 'File'} deleted successfully`);
      setIsDeleteDialogOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting:', error);
      const errorMessage = error instanceof Error ? error.message : `Failed to delete ${selectedItemType}`;
      toast.error(errorMessage);
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

          {selectedItemId && selectedItemType && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Selected {selectedItemType === 'folder' ? 'Folder' : 'File'} Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                {selectedItemType === 'folder' ? (
                  <FolderPen className="h-4 w-4 mr-2" />
                ) : (
                  <FilePen className="h-4 w-4 mr-2" />
                )}
                Rename {selectedItemType === 'folder' ? 'Folder' : 'File'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete {selectedItemType === 'folder' ? 'Folder' : 'File'}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        itemType={selectedItemType || 'file'}
        newName={newName}
        onNewNameChange={setNewName}
        onRename={handleRename}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemType={selectedItemType || 'file'}
        onDelete={handleDelete}
      />
    </>
  );
};
