
import React from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

interface EmptyFolderStateProps {
  onCreateFolder?: () => void;
}

export const EmptyFolderState = ({ onCreateFolder }: EmptyFolderStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 h-[300px] text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <FolderOpen className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Folders Found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        You don't have any folders yet. Create a folder to organize your documents.
      </p>
      {onCreateFolder && (
        <Button onClick={onCreateFolder}>
          Create Folder
        </Button>
      )}
    </div>
  );
};
