
import { useState, useEffect } from "react";
import { FolderPermissionRule, UserRole } from "@/types/folders";
import { supabase } from "@/lib/supabase";

export const useFolderPermissions = () => {
  const [userRole, setUserRole] = useState<UserRole>('restricted');
  const [folderPermissions, setFolderPermissions] = useState<FolderPermissionRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadPermissions = async () => {
      setIsLoading(true);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setUserRole('restricted');
          setFolderPermissions([]);
          return;
        }
        
        // Get user profile to determine role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        // Set default role to restricted if not found
        const role = profile?.role || 'restricted';
        setUserRole(role as UserRole);
        
        // Get folder permissions for current user
        const { data: permissions } = await supabase
          .from('folder_permissions')
          .select('*')
          .eq('user_id', user.id);
          
        if (permissions) {
          // Map permissions to FolderPermissionRule
          const folderPermissionRules: FolderPermissionRule[] = permissions.map(perm => ({
            folderId: perm.folder_id,
            userId: perm.user_id,
            permission: perm.permission_level
          }));
          
          setFolderPermissions(folderPermissionRules);
        }
      } catch (error) {
        console.error("Error loading folder permissions:", error);
        // Set default permissions for safety
        setUserRole('restricted');
        setFolderPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPermissions();
  }, []);
  
  return { userRole, folderPermissions, isLoading };
};
