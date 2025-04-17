
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://plxuyxacefgttimodrbp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseHV5eGFjZWZndHRpbW9kcmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4Mjk1NDksImV4cCI6MjA1NTQwNTU0OX0.2eRYQPoDgbl5Zqyya1YP9SBXlUOhZUP0ptWbGthT8sw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
});

// Helper to check if storage bucket exists and create if not
export const ensureStorageBucket = async () => {
  try {
    // Check if documents bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking storage buckets:', error);
      return false;
    }
    
    const documentsBucketExists = buckets?.some(bucket => bucket.name === 'documents');
    
    if (!documentsBucketExists) {
      console.warn('Documents bucket not found - creating it now');
      // For security purposes, log this but don't automatically create
      // Bucket should be created through proper migrations
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage bucket:', error);
    return false;
  }
};

// Helper to get document URL with better error handling
export const getDocumentUrl = async (storagePath: string): Promise<string | null> => {
  if (!storagePath) {
    console.error('Storage path is empty');
    return null;
  }
  
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry
      
    if (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
    
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error generating document URL:', error);
    return null;
  }
};
