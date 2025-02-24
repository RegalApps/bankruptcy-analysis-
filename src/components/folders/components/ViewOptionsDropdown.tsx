
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ChevronDown, Grid, FolderPlus, FileText, Files, Pencil, Trash2 } from "lucide-react";

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
      const { error } = await supabase
        .from('documents')
        .update({ title: newName.trim() })
        .eq('id', selectedItemId);

      if (error) throw error;

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
    if (!selectedItemId) return;

    try {
      // If it's a folder, first check if it's empty
      if (selectedItemType === 'folder') {
        const { data: containedItems } = await supabase
          .from('documents')
          .select('id')
          .eq('parent_folder_id', selectedItemId);

        if (containedItems && containedItems.length > 0) {
          toast.error("Cannot delete non-empty folder");
          setIsDeleteDialogOpen(false);
          return;
        }
      }

      // Delete from storage if it's a file
      if (selectedItemType === 'file') {
        const { data: document } = await supabase
          .from('documents')
          .select('storage_path')
          .eq('id', selectedItemId)
          .single();

        if (document?.storage_path) {
          await supabase.storage
            .from('documents')
            .remove([document.storage_path]);
        }
      }

      // Delete from documents table
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', selectedItemId);

      if (error) throw error;

      toast.success(`${selectedItemType === 'folder' ? 'Folder' : 'File'} deleted successfully`);
      setIsDeleteDialogOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(`Failed to delete ${selectedItemType}`);
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

          {selectedItemId && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Selected {selectedItemType === 'folder' ? 'Folder' : 'File'} Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
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

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {selectedItemType === 'folder' ? 'Folder' : 'File'}</DialogTitle>
            <DialogDescription>
              Enter a new name for this {selectedItemType}.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
            className="my-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedItemType === 'folder' ? 'Folder' : 'File'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {selectedItemType}? This action cannot be undone.
              {selectedItemType === 'folder' && (
                <p className="mt-2 text-destructive">
                  Note: You can only delete empty folders.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
