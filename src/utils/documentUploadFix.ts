
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
    // Step 1: Check if storage is available
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      return {
        fixed: false,
        message: `Storage system error: ${bucketError.message}`
      };
    }
    
    // Step 2: Check if documents bucket exists
    const docBucket = buckets?.find(b => b.name === 'documents');
    
    if (!docBucket) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        return {
          fixed: false,
          message: `Failed to create documents bucket: ${createError.message}`
        };
      }
      
      return {
        fixed: true,
        message: "Created documents storage bucket successfully"
      };
    }
    
    // Step 3: Verify we can upload to the bucket
    const testContent = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testContent], 'upload-test.txt');
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(`system-test/${Date.now()}.txt`, testFile);
      
    if (uploadError) {
      return {
        fixed: false,
        message: `Cannot upload to documents bucket: ${uploadError.message}`
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
    toast.error(result.message);
    return false;
  }
};

// Make the fix function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).fixDocumentUpload = runDocumentUploadFix;
}
