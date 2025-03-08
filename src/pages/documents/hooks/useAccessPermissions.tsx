
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useAccessPermissions = () => {
  const [hasWriteAccess, setHasWriteAccess] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("viewer");

  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error);
          setHasWriteAccess(false);
          return;
        }
        
        if (!user) {
          setHasWriteAccess(false);
          return;
        }
        
        setHasWriteAccess(true);
        setUserRole("admin");
      } catch (error) {
        console.error("Error checking permissions:", error);
        setHasWriteAccess(false);
      }
    };
    
    checkUserPermissions();
  }, []);

  const toggleAccess = () => {
    setHasWriteAccess(!hasWriteAccess);
    
    if (hasWriteAccess) {
      setUserRole("viewer");
      toast.info("Switched to view-only mode");
    } else {
      setUserRole("admin");
      toast.success("Switched to edit mode");
    }
  };

  return {
    hasWriteAccess,
    userRole,
    toggleAccess
  };
};
