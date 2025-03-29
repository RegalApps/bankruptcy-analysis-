
import React from "react";
import { Document } from "@/components/client/types";
import { FolderItem } from "./FolderItem";

interface FolderListProps {
  folders: Document[];
  onDocumentOpen?: (documentId: string) => void;
}

export const FolderList = ({ folders = [], onDocumentOpen }: FolderListProps) => {
  // Early return if folders is undefined or empty
  if (!folders || folders.length === 0) {
    return null;
  }

  // Filter to only include actual folders
  const actualFolders = folders.filter(folder => folder && folder.is_folder);
  
  if (actualFolders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Folders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actualFolders.map(folder => folder && (
          <FolderItem 
            key={folder.id}
            folder={folder}
            onDocumentOpen={onDocumentOpen}
          />
        ))}
      </div>
    </div>
  );
};
