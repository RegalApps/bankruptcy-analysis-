
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FolderPermissionRule, UserRole } from "@/types/folders";

export const useFolderPermissions = () => {
  const [userRole, setUserRole] = useState<UserRole>("viewer" as UserRole);
  const [folderPermissions, setFolderPermissions] = useState<FolderPermissionRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoleAndPermissions = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Error getting user:", userError);
          setUserRole("restricted" as UserRole);
          setIsLoading(false);
          return;
        }
        
        // In a real application, you would fetch the user's role from your database
        // For this implementation, we'll default to "admin" role
        setUserRole("admin" as UserRole);
        
        // For a real app, you would fetch folder permissions from your database
        // For now, we'll create a simulated permissions array
        const simulatedPermissions: FolderPermissionRule[] = [
          {
            folderId: "all",
            userId: user.id,
            permission: "full"
          }
        ];
        
        setFolderPermissions(simulatedPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setUserRole("restricted" as UserRole);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserRoleAndPermissions();
  }, []);

  return {
    userRole,
    folderPermissions,
    isLoading
  };
};
