import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Verify storage system is properly configured and ready
 */
export const verifyStorageSystem = async (): Promise<boolean> => {
  try {
    // First check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error verifying storage system:", error);
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      // Try to create the documents bucket
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.error("Error creating documents bucket:", createError);
        return false;
      }
      
      console.log("Documents bucket created successfully");
      
      // Try creating a test file to verify bucket is working
      const testFile = new Blob(['test'], { type: 'text/plain' });
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload('test-file.txt', testFile);
        
      if (uploadError) {
        console.error("Error creating test file:", uploadError);
        return false;
      }
      
      // Clean up test file
      await supabase.storage.from('documents').remove(['test-file.txt']);
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Error verifying storage system:", error);
    return false;
  }
};

/**
 * Diagnostic check for document upload system
 */
export const runDocumentSystemDiagnostics = async (): Promise<{
  status: 'healthy' | 'degraded' | 'failed';
  issues: string[];
  messages: string[];
}> => {
  const result = {
    status: 'healthy' as 'healthy' | 'degraded' | 'failed',
    issues: [] as string[],
    messages: [] as string[]
  };
  
  // Step 1: Check bucket configuration
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  
  if (bucketError) {
    result.status = 'failed';
    result.issues.push(`Cannot access storage buckets: ${bucketError.message}`);
    return result;
  }
  
  const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
  
  if (!documentsBucket) {
    result.status = 'failed';
    result.issues.push('Documents storage bucket does not exist');
    
    // Try to create it
    try {
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        result.issues.push(`Failed to create documents bucket: ${createError.message}`);
      } else {
        result.messages.push('Created documents bucket successfully');
        result.status = 'degraded'; // Downgrade to degraded since we had to create it
      }
    } catch (createError: any) {
      result.issues.push(`Exception creating documents bucket: ${createError.message}`);
    }
  } else {
    result.messages.push('Documents bucket exists');
    
    // Check if bucket is accessible 
    try {
      const testFile = new Blob(['test'], { type: 'text/plain' });
      const testFilePath = `diagnostic-test-${Date.now()}.txt`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(testFilePath, testFile);
        
      if (uploadError) {
        result.status = 'degraded';
        result.issues.push(`Cannot upload to documents bucket: ${uploadError.message}`);
      } else {
        result.messages.push('Successfully uploaded test file');
        
        // Try to download it
        const { error: downloadError } = await supabase.storage
          .from('documents')
          .download(testFilePath);
          
        if (downloadError) {
          result.status = 'degraded';
          result.issues.push(`Cannot download from documents bucket: ${downloadError.message}`);
        } else {
          result.messages.push('Successfully downloaded test file');
        }
        
        // Clean up
        await supabase.storage.from('documents').remove([testFilePath]);
      }
    } catch (testError: any) {
      result.status = 'degraded';
      result.issues.push(`Exception testing bucket access: ${testError.message}`);
    }
  }
  
  // Check document table
  try {
    const { error: tableError } = await supabase
      .from('documents')
      .select('id')
      .limit(1);
      
    if (tableError) {
      result.status = result.status === 'healthy' ? 'degraded' : result.status;
      result.issues.push(`Cannot access documents table: ${tableError.message}`);
    } else {
      result.messages.push('Documents table is accessible');
    }
  } catch (tableError: any) {
    result.status = result.status === 'healthy' ? 'degraded' : result.status;
    result.issues.push(`Exception accessing documents table: ${tableError.message}`);
  }
  
  return result;
};

/**
 * Attempts to repair common document system issues
 */
export const repairDocumentSystem = async (): Promise<boolean> => {
  const diagnostics = await runDocumentSystemDiagnostics();
  
  if (diagnostics.status === 'healthy') {
    toast.success("Document system is healthy, no repairs needed");
    return true;
  }
  
  let repaired = false;
  
  // Create bucket if missing
  if (diagnostics.issues.some(issue => issue.includes('does not exist'))) {
    try {
      const { error } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (!error) {
        toast.success("Created documents storage bucket");
        repaired = true;
      }
    } catch (error) {
      console.error("Failed to create bucket:", error);
    }
  }
  
  // Other repairs could be added here as needed
  
  const finalCheck = await runDocumentSystemDiagnostics();
  if (finalCheck.status === 'healthy') {
    toast.success("Document system has been repaired successfully");
    return true;
  } else {
    toast.error(`Document system still has issues: ${finalCheck.issues[0]}`);
    return repaired;
  }
};
