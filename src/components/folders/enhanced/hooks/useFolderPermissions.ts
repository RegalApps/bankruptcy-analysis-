
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface FolderPermission {
  folderId: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
}

export const useFolderPermissions = () => {
  const [userRole, setUserRole] = useState<string>("viewer");
  const [folderPermissions, setFolderPermissions] = useState<Record<string, FolderPermission>>({});
  
  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        // Get current user
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error);
          setUserRole("viewer");
          return;
        }
        
        if (!user) {
          setUserRole("viewer");
          return;
        }
        
        // For this implementation, we'll set a default role
        // In a real app, you would get the user's role from the database
        setUserRole("admin");
        
        // Define default permissions based on user role
        const defaultPermissions = {
          "admin": {
            canView: true,
            canEdit: true,
            canDelete: true,
            canShare: true
          },
          "case_manager": {
            canView: true,
            canEdit: true,
            canDelete: false,
            canShare: true
          },
          "reviewer": {
            canView: true,
            canEdit: false,
            canDelete: false,
            canShare: false
          },
          "viewer": {
            canView: true,
            canEdit: false,
            canDelete: false,
            canShare: false
          }
        };
        
        // In a real implementation, you would fetch folder-specific permissions
        // from a database. Here we just use the role-based permissions.
        
        // Mock fetching folders
        const { data: folders } = await supabase
          .from('documents')
          .select('id')
          .eq('is_folder', true);
          
        if (folders) {
          const permissions: Record<string, FolderPermission> = {};
          
          folders.forEach(folder => {
            // For now, set permissions based on user role
            // In a real app, you'd have folder-specific permissions
            permissions[folder.id] = {
              folderId: folder.id,
              ...defaultPermissions[userRole as keyof typeof defaultPermissions]
            };
          });
          
          setFolderPermissions(permissions);
        }
      } catch (error) {
        console.error("Error getting user permissions:", error);
        setUserRole("viewer");
      }
    };
    
    checkUserPermissions();
  }, []);
  
  return { userRole, folderPermissions };
};
