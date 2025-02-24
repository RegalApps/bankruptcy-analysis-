
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface RenameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: "folder" | "file";
  newName: string;
  onNewNameChange: (value: string) => void;
  onRename: () => void;
}

export const RenameDialog = ({
  isOpen,
  onOpenChange,
  itemType,
  newName,
  onNewNameChange,
  onRename,
}: RenameDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {itemType}</DialogTitle>
          <DialogDescription>
            Enter a new name for this {itemType}.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={newName}
          onChange={(e) => onNewNameChange(e.target.value)}
          placeholder="Enter new name"
          className="my-4"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onRename}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
