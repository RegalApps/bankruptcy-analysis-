
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Removes existing Form 31 documents for the current user
 * This helps prevent duplicate issues during testing
 * @returns Promise resolving to boolean indicating success
 */
export async function cleanupExistingForm31(): Promise<boolean> {
  try {
    // Get current user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return false;
    }
    
    // Find existing Form 31 documents
    const { data: existingDocs, error: queryError } = await supabase
      .from('documents')
      .select('id, title, storage_path')
      .filter('user_id', 'eq', user.id)
      .filter('title', 'ilike', '%Form 31%')
      .or('title.ilike.%Proof of Claim%,metadata->document_type.eq.form31');
    
    if (queryError) {
      console.error("Error querying existing Form 31 documents:", queryError);
      return false;
    }
    
    if (!existingDocs || existingDocs.length === 0) {
      console.log("No existing Form 31 documents found");
      return true;
    }
    
    console.log(`Found ${existingDocs.length} existing Form 31 documents to clean up`);
    
    // Delete from storage and database
    for (const doc of existingDocs) {
      // Delete from storage if path exists
      if (doc.storage_path) {
        await supabase.storage
          .from('documents')
          .remove([doc.storage_path])
          .then(({ error }) => {
            if (error) console.warn(`Could not delete storage file: ${doc.storage_path}`, error);
            else console.log(`Deleted storage file: ${doc.storage_path}`);
          });
      }
      
      // Delete database record
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);
        
      if (deleteError) {
        console.error(`Error deleting document ${doc.id}:`, deleteError);
      } else {
        console.log(`Deleted document record: ${doc.id} - ${doc.title}`);
      }
    }
    
    toast.success(`Cleaned up ${existingDocs.length} existing Form 31 documents`, {
      description: "You can now upload a new Form 31 document"
    });
    
    return true;
  } catch (error) {
    console.error("Error cleaning up Form 31 documents:", error);
    return false;
  }
}

/**
 * Checks if a filename appears to be a Form 31
 * @param filename The filename to check
 * @returns Boolean indicating if this is likely a Form 31
 */
export function isForm31ByFilename(filename: string): boolean {
  if (!filename) return false;
  
  const lowercaseName = filename.toLowerCase();
  return (
    lowercaseName.includes('form 31') || 
    lowercaseName.includes('form31') ||
    lowercaseName.includes('proof of claim') ||
    lowercaseName.includes('proofofclaim')
  );
}
