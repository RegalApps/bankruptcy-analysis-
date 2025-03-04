
import { Button } from "@/components/ui/button";
import { Tag, Tags } from "lucide-react";
import { FolderDialog } from "./FolderDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface FolderActionButtonsProps {
  setShowFolderDialog: (show: boolean) => void;
  showFolderDialog: boolean;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  onCreateFolder: () => void;
  folders?: { id: string; title: string }[];
  onFolderSelect?: (folderId: string) => void;
  selectedFolderId?: string;
}

export const FolderActionButtons = ({
  setShowFolderDialog,
  showFolderDialog,
  newFolderName,
  setNewFolderName,
  onCreateFolder,
  folders = [],
  onFolderSelect,
  selectedFolderId
}: FolderActionButtonsProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Button 
        variant="default" 
        size="sm"
        onClick={() => setShowFolderDialog(true)}
      >
        + New Folder
      </Button>
      
      {folders.length > 0 && onFolderSelect && (
        <Select 
          value={selectedFolderId || undefined} 
          onValueChange={(value) => onFolderSelect(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent>
            {/* Removed the empty value SelectItem that was causing the error */}
            {folders.map(folder => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
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
