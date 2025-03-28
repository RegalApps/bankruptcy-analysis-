
import { Button } from "@/components/ui/button";
import { FolderPlus, RefreshCw } from "lucide-react";

interface FolderToolsProps {
  onCreateFolder: () => void;
  onRefresh: () => void;
}

export const FolderTools = ({
  onCreateFolder,
  onRefresh
}: FolderToolsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onCreateFolder}
        className="flex items-center"
      >
        <FolderPlus className="h-4 w-4 mr-2" />
        New Folder
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        className="h-8 w-8 p-0"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
