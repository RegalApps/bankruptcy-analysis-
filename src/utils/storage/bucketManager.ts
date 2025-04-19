
import { supabase } from "@/lib/supabase";

/**
 * Ensures the required storage buckets exist and have proper configuration
 * This function should be called when the app initializes
 */
export const ensureStorageBuckets = async (): Promise<boolean> => {
  try {
    console.log("Checking storage buckets...");
    
    // Get all existing buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error checking storage buckets:", bucketsError);
      return false;
    }
    
    // Check if documents bucket exists
    const documentsExists = buckets?.some(bucket => bucket.name === 'documents');
    
    if (!documentsExists) {
      console.log("Creating documents bucket...");
      
      // Create the documents bucket with proper configuration
      const { error: bucketError } = await supabase.storage
        .createBucket('documents', {
          public: false,
          fileSizeLimit: 31457280, // 30MB
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png'
          ]
        });
      
      if (bucketError) {
        console.error("Error creating documents bucket:", bucketError);
        return false;
      }
      
      console.log("Documents bucket created successfully");
    } else {
      console.log("Documents bucket exists");
    }
    
    return true;
  } catch (error) {
    console.error("Storage bucket initialization failed:", error);
    return false;
  }
};

/**
 * Diagnoses file upload issues by checking bucket existence, RLS policies,
 * user authentication, and file size limitations
 */
export const diagnoseUploadIssues = async (file?: File): Promise<{
  isAuthenticated: boolean;
  bucketExists: boolean;
  hasPermission: boolean;
  fileSizeValid: boolean;
  diagnostic: string;
}> => {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const isAuthenticated = !!user && !authError;
    
    // Check bucket existence
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'documents') || false;
    
    // Check permissions
    let hasPermission = false;
    if (bucketExists && isAuthenticated) {
      // Try to list files as a simple permission check
      const { error: listError } = await supabase.storage
        .from('documents')
        .list();
      
      hasPermission = !listError;
    }
    
    // Check file size
    let fileSizeValid = true;
    let diagnostic = "";
    
    if (file) {
      fileSizeValid = file.size <= 30 * 1024 * 1024; // 30MB
      
      if (!fileSizeValid) {
        diagnostic = `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 30MB limit`;
      }
    }
    
    if (!isAuthenticated) {
      diagnostic = "User not authenticated. Please log in again.";
    } else if (!bucketExists) {
      diagnostic = "Storage bucket 'documents' does not exist";
    } else if (!hasPermission) {
      diagnostic = "User does not have permission to access storage";
    } else if (diagnostic === "") {
      diagnostic = "Basic checks passed. Try uploading again.";
    }
    
    return {
      isAuthenticated,
      bucketExists,
      hasPermission,
      fileSizeValid,
      diagnostic
    };
  } catch (error) {
    console.error("Diagnostics error:", error);
    return {
      isAuthenticated: false,
      bucketExists: false,
      hasPermission: false,
      fileSizeValid: true,
      diagnostic: `Error running diagnostics: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Formats file size in a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};
