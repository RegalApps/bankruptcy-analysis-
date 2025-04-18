
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Attempts to fix document upload issues by checking common problems
 * and applying fixes
 */
export const fixDocumentUpload = async (): Promise<{
  fixed: boolean;
  message: string;
}> => {
  try {
    // Check if we have a user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return {
        fixed: false,
        message: `Authentication required: ${sessionError?.message || "No active session"}`
      };
    }
    
    // Check if we can access the storage
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      return {
        fixed: false,
        message: `Storage system error: ${bucketError.message}. This is likely a permissions issue.`
      };
    }
    
    // Check if documents bucket exists
    const docBucket = buckets?.find(b => b.name === 'documents');
    
    if (!docBucket) {
      // Note: Users typically can't create buckets due to RLS
      // so we just inform them of the issue
      return {
        fixed: false,
        message: "The 'documents' storage bucket doesn't exist. Please contact an administrator to set up the storage bucket."
      };
    }
    
    // Step 3: Try to list files in the bucket to verify access
    const { data: files, error: listError } = await supabase.storage
      .from('documents')
      .list();
      
    if (listError) {
      return {
        fixed: false,
        message: `Cannot access documents bucket: ${listError.message}`
      };
    }
    
    // System appears to be working
    return {
      fixed: true,
      message: "Document upload system is working correctly"
    };
  } catch (error: any) {
    return {
      fixed: false,
      message: `Error checking document system: ${error.message}`
    };
  }
};

/**
 * Command to fix document upload issues from the console
 */
export const runDocumentUploadFix = async () => {
  toast.loading("Checking document upload system...");
  
  const result = await fixDocumentUpload();
  
  if (result.fixed) {
    toast.success(result.message);
    return true;
  } else {
    toast.error(result.message, {
      description: "You may need administrator assistance to resolve this issue."
    });
    return false;
  }
};

// Make the fix function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).fixDocumentUpload = runDocumentUploadFix;
}
