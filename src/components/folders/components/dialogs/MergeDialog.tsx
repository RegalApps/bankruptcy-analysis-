
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

interface MergeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onClientNameChange: (value: string) => void;
  onMerge: () => void;
}

export const MergeDialog = ({
  isOpen,
  onOpenChange,
  clientName,
  onClientNameChange,
  onMerge,
}: MergeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Merge Client Folders</DialogTitle>
          <DialogDescription>
            Enter a client name to merge all related folders. This will combine documents from similarly named client folders into one folder.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={clientName}
          onChange={(e) => onClientNameChange(e.target.value)}
          placeholder="Enter client name"
          className="my-4"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onMerge} disabled={!clientName.trim()}>
            Merge Folders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
