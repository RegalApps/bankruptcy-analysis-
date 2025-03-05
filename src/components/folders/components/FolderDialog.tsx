
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface FolderDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  folderName: string;
  setFolderName: (name: string) => void;
  onCreateFolder: () => void;
}

export const FolderDialog = ({
  showDialog,
  setShowDialog,
  folderName,
  setFolderName,
  onCreateFolder,
}: FolderDialogProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder. You can drag and drop documents into it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="glass-panel"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button onClick={onCreateFolder} className="gradient-button">
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
