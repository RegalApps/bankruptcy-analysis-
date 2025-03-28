import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, Users, Settings } from "lucide-react";
import { FolderActionDropdown } from "./components/FolderActionDropdown";
import { FolderPermissionsDialog } from "./dialogs/FolderPermissionsDialog";
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
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

  const canCreateFolder = useMemo(() => {
    return hasWriteAccess && ['admin', 'manager', 'user'].includes(userRole);
  }, [hasWriteAccess, userRole]);

  const canManagePermissions = useMemo(() => {
    return userRole === 'admin' || userRole === 'manager';
  }, [userRole]);

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Document Folders</h2>
      
      <div className="flex items-center gap-2">
        {canCreateFolder && (
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
        
        {canManagePermissions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPermissionsDialog(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            Permissions
          </Button>
        )}
        
        <FolderActionDropdown 
          selectedFolderId={selectedFolderId}
          hasWriteAccess={hasWriteAccess}
          userRole={userRole}
          onRefresh={onRefresh}
        />
      </div>
      
      {showPermissionsDialog && (
        <FolderPermissionsDialog
          open={showPermissionsDialog}
          onOpenChange={setShowPermissionsDialog}
          folderId={selectedFolderId}
        />
      )}
    </div>
  );
};
