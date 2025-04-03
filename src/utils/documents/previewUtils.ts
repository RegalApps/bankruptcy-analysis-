
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Generate a signed URL for a file in Supabase storage
 */
export const getSignedUrl = async (storagePath: string): Promise<string | null> => {
  try {
    if (!storagePath) {
      throw new Error("No storage path provided");
    }
    
    // Extract bucket and file path from storage path
    // Expected format: bucket/path/to/file.ext
    const pathParts = storagePath.split('/');
    const bucket = pathParts[0];
    const filePath = pathParts.slice(1).join('/');
    
    if (!bucket || !filePath) {
      throw new Error("Invalid storage path format");
    }
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
    if (error) {
      throw error;
    }
    
    return data.signedUrl;
  } catch (error: any) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};

/**
 * Get public URL for a file in Supabase storage
 */
export const getPublicUrl = (storagePath: string): string | null => {
  try {
    if (!storagePath) {
      return null;
    }
    
    // Extract bucket and file path from storage path
    const pathParts = storagePath.split('/');
    const bucket = pathParts[0];
    const filePath = pathParts.slice(1).join('/');
    
    if (!bucket || !filePath) {
      return null;
    }
    
    const { data } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error("Error generating public URL:", error);
    return null;
  }
};

/**
 * Download a file from Supabase storage
 */
export const downloadFile = async (storagePath: string, filename?: string): Promise<void> => {
  try {
    if (!storagePath) {
      throw new Error("No storage path provided");
    }
    
    // Get a signed URL for the file
    const signedUrl = await getSignedUrl(storagePath);
    if (!signedUrl) {
      throw new Error("Could not generate download URL");
    }
    
    // Create a temporary link and click it to trigger download
    const link = document.createElement('a');
    link.href = signedUrl;
    link.download = filename || storagePath.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download started");
  } catch (error: any) {
    console.error("Download error:", error);
    toast.error("Failed to download file", {
      description: error.message
    });
  }
};

/**
 * Get the file type from a storage path
 */
export const getFileTypeFromPath = (storagePath: string): string => {
  if (!storagePath) return 'unknown';
  
  const extension = storagePath.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'word';
    case 'xls':
    case 'xlsx':
    case 'csv':
      return 'excel';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
      return 'image';
    case 'zip':
    case 'rar':
    case '7z':
      return 'archive';
    case 'mp4':
    case 'mov':
    case 'avi':
      return 'video';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'audio';
    default:
      return 'document';
  }
};

/**
 * Check if a file exists in Supabase storage
 */
export const checkFileExists = async (storagePath: string): Promise<boolean> => {
  try {
    if (!storagePath) return false;
    
    // Extract bucket and file path
    const pathParts = storagePath.split('/');
    const bucket = pathParts[0];
    const filePath = pathParts.slice(1).join('/');
    
    if (!bucket || !filePath) return false;
    
    // Try to get file metadata (will fail if file doesn't exist)
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(filePath, 10); // Short expiry just to check existence
      
    return !error && !!data;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
};
