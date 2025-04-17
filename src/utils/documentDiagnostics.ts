
import { supabase } from "@/lib/supabase";

// Function to check document accessibility and return diagnostic information
export const diagnoseDocument = async (documentId: string): Promise<{
  exists: boolean;
  storagePathValid: boolean;
  canAccessStorage: boolean;
  urlGenerationWorks: boolean;
  documentRecord: any | null;
  errorDetails?: string;
}> => {
  const result = {
    exists: false,
    storagePathValid: false,
    canAccessStorage: false,
    urlGenerationWorks: false,
    documentRecord: null,
    errorDetails: ''
  };
  
  try {
    // Step 1: Check if document exists in database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .maybeSingle();
      
    if (docError) {
      result.errorDetails = `Database error: ${docError.message}`;
      return result;
    }
    
    if (!document) {
      result.errorDetails = 'Document not found in database';
      return result;
    }
    
    result.exists = true;
    result.documentRecord = document;
    
    // Step 2: Check if storage path exists and is valid
    if (!document.storage_path) {
      result.errorDetails = 'Document has no storage path';
      return result;
    }
    
    result.storagePathValid = true;
    
    // Step 3: Check if we can access the file in storage
    try {
      const { data: fileData, error: fileError } = await supabase.storage
        .from('documents')
        .download(document.storage_path);
        
      if (fileError) {
        result.errorDetails = `Storage access error: ${fileError.message}`;
        return result;
      }
      
      result.canAccessStorage = true;
      
      // Step 4: Check if URL generation works
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.storage_path, 60);
        
      if (urlError) {
        result.errorDetails = `URL generation error: ${urlError.message}`;
        return result;
      }
      
      if (!urlData?.signedUrl) {
        result.errorDetails = 'URL generation failed - no URL returned';
        return result;
      }
      
      result.urlGenerationWorks = true;
      
    } catch (error: any) {
      result.errorDetails = `Storage operation error: ${error.message}`;
    }
    
    return result;
    
  } catch (error: any) {
    result.errorDetails = `Diagnostic process error: ${error.message}`;
    return result;
  }
};

// Function to check storage bucket health
export const checkStorageBucketHealth = async (): Promise<{
  exists: boolean;
  publicAccessible: boolean;
  canUpload: boolean;
  canDownload: boolean;
  errorDetails?: string;
}> => {
  const result = {
    exists: false,
    publicAccessible: false,
    canUpload: false,
    canDownload: false,
    errorDetails: ''
  };
  
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      result.errorDetails = `Bucket listing error: ${bucketError.message}`;
      return result;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      result.errorDetails = 'Documents bucket does not exist';
      return result;
    }
    
    result.exists = true;
    result.publicAccessible = documentsBucket.public || false;
    
    // Test upload capability with a small test file
    const testContent = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testContent], 'storage-test.txt');
    const testPath = `diagnostic/storage-test-${Date.now()}.txt`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(testPath, testFile);
      
    if (uploadError) {
      result.errorDetails = `Upload test failed: ${uploadError.message}`;
      return result;
    }
    
    result.canUpload = true;
    
    // Test download capability
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(testPath);
      
    if (downloadError) {
      result.errorDetails = `Download test failed: ${downloadError.message}`;
      
      // Clean up test file even if download failed
      await supabase.storage.from('documents').remove([testPath]);
      
      return result;
    }
    
    result.canDownload = true;
    
    // Clean up test file
    await supabase.storage.from('documents').remove([testPath]);
    
    return result;
    
  } catch (error: any) {
    result.errorDetails = `Storage diagnostic error: ${error.message}`;
    return result;
  }
};
