
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, Settings } from "lucide-react";
import { FolderActionDropdown } from "./components/FolderActionDropdown";
import { UserRole } from "@/types/folders";

interface FolderHeaderProps {
  onCreateFolder: () => void;
  onCreateDocument: () => void;
  selectedFolderId?: string;
  hasWriteAccess: boolean;
  userRole: UserRole;
  onRefresh: () => void;
}

export const FolderHeader = ({
  onCreateFolder,
  onCreateDocument,
  selectedFolderId,
  hasWriteAccess,
  userRole,
  onRefresh
}: FolderHeaderProps) => {
  const canCreateFolder = ['admin', 'manager', 'user'].includes(userRole);

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Document Folders</h2>
      
      <div className="flex items-center gap-2">
        {hasWriteAccess && canCreateFolder && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCreateFolder}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={onCreateDocument}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </>
        )}
        
        <FolderActionDropdown 
          selectedFolderId={selectedFolderId}
          hasWriteAccess={hasWriteAccess}
          userRole={userRole}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
};
