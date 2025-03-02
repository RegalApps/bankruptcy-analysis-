
import { Button } from "@/components/ui/button";
import { Tag, Tags } from "lucide-react";
import { FolderDialog } from "./FolderDialog";

interface FolderActionButtonsProps {
  setShowFolderDialog: (show: boolean) => void;
  showFolderDialog: boolean;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  onCreateFolder: () => void;
}

export const FolderActionButtons = ({
  setShowFolderDialog,
  showFolderDialog,
  newFolderName,
  setNewFolderName,
  onCreateFolder
}: FolderActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="default" 
        size="sm"
        onClick={() => setShowFolderDialog(true)}
      >
        + New Folder
      </Button>
      <FolderDialog
        showDialog={showFolderDialog}
        setShowDialog={setShowFolderDialog}
        folderName={newFolderName}
        setFolderName={setNewFolderName}
        onCreateFolder={onCreateFolder}
      />
      <Button variant="outline" size="sm">
        <Tag className="h-4 w-4 mr-2" />
        Add Meta Tags
      </Button>
      <Button variant="outline" size="sm">
        <Tags className="h-4 w-4 mr-2" />
        Manage Tags
      </Button>
    </div>
  );
};
