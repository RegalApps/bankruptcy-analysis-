
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Upload, FolderPlus, RefreshCw, Filter } from "lucide-react";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure, UserRole } from "@/types/folders";
import { CreateFolderDialog } from "./dialogs/CreateFolderDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  folders: FolderStructure[];
  documents: Document[];
  userRole: UserRole;
  onRefresh: () => void;
}

export const FolderHeader = ({
  searchQuery,
  onSearchChange,
  folders,
  documents,
  userRole,
  onRefresh
}: FolderHeaderProps) => {
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  
  // Check if user has permissions to create folders
  const canCreateFolders = userRole === 'admin' || userRole === 'manager';

  return (
    <div className="flex flex-col space-y-4 mb-4">
      {/* Search bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders and documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        {/* Filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" title="Filter">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                All Documents
              </DropdownMenuItem>
              <DropdownMenuItem>
                Forms
              </DropdownMenuItem>
              <DropdownMenuItem>
                Financial Sheets
              </DropdownMenuItem>
              <DropdownMenuItem>
                Recent (30 days)
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Create folder button (only visible for admin/manager) */}
        {canCreateFolders && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowCreateFolder(true)}
            title="Create Folder"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Create folder dialog */}
      {showCreateFolder && (
        <CreateFolderDialog
          folders={folders}
          onClose={() => setShowCreateFolder(false)}
          onCreateFolder={onRefresh}
        />
      )}
    </div>
  );
};
