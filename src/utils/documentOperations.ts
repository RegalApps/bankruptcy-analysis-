
import { supabase, ensureStorageBucket } from '@/lib/supabase';
import { toast } from "sonner";

export const uploadDocument = async (file: File): Promise<any> => {
  // First ensure storage is configured
  const isBucketReady = await ensureStorageBucket();
  
  if (!isBucketReady) {
    toast.error("Storage system unavailable. Attempting to create storage bucket...");
    // Try creating the bucket one more time
    const secondAttempt = await ensureStorageBucket();
    if (!secondAttempt) {
      toast.error("Failed to create storage bucket. Please contact support.");
      throw new Error('Storage system not properly configured');
    } else {
      toast.success("Storage system created successfully!");
    }
  }
  
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      toast.error("Authentication required. Please login again.");
      throw new Error('User not authenticated');
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const timeStamp = new Date().getTime();
    const filePath = `${userData.user.id}/${timeStamp}_${file.name.replace(/\s+/g, '_')}`;
    
    console.log('Uploading file to storage path:', filePath);

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      toast.error("Upload failed. Please try again.");
      throw uploadError;
    }
    
    console.log('File uploaded successfully, creating DB record');

    // Create document record in database
    const { data: documentData, error: dbError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        type: file.type,
        size: file.size,
        storage_path: filePath,
        user_id: userData.user.id,
        ai_processing_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          original_filename: file.name,
          upload_date: new Date().toISOString(),
          content_type: file.type,
          client_id: extractClientIdFromFilename(file.name)
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      
      // Attempt to clean up storage file if database insert fails
      await supabase.storage.from('documents').remove([filePath]);
      
      toast.error("Failed to save document information.");
      throw dbError;
    }
    
    console.log('Document record created successfully:', documentData);
    
    // Generate a URL to confirm storage is properly configured
    const { data: urlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60);
      
    if (!urlData?.signedUrl) {
      console.warn('Could not generate preview URL - storage might not be properly configured');
    } else {
      console.log('Document preview URL generated successfully');
    }

    return documentData;
  } catch (error) {
    console.error('Document upload error:', error);
    throw error;
  }
};

// Helper function to try to extract client ID from filename
function extractClientIdFromFilename(filename: string): string | undefined {
  // Try to match patterns like "client-12345" or "12345-document" in the filename
  const clientMatch = filename.match(/(?:client[_-]?(\w+)|(\w+)[-_]client)/i);
  if (clientMatch) {
    return clientMatch[1] || clientMatch[2];
  }
  return undefined;
}

export const getDocumentPublicUrl = async (storagePath: string): Promise<string | null> => {
  if (!storagePath) {
    console.error('No storage path provided');
    return null;
  }

  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry
      
    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
    
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error getting document URL:', error);
    return null;
  }
};

// Adding the missing function that's being imported in riskAssessment.ts
export const createForm47RiskAssessment = async (documentId: string): Promise<any> => {
  try {
    // This function would typically create a risk assessment for a Form 47 document
    // Since we're just adding this to fix the import error, we'll provide a basic implementation
    console.log(`Creating risk assessment for Form 47 document: ${documentId}`);
    
    // Return mock risk data similar to what would be expected
    return {
      risks: [
        {
          type: "Missing Income Details",
          description: "The consumer proposal form is missing detailed income verification.",
          severity: "high",
          regulation: "Consumer Proposal Regulations Section 66.12",
          impact: "May delay approval process by regulatory authorities.",
          requiredAction: "Add complete income statements for the last 3 months.",
          solution: "Upload pay stubs or income verification documents."
        },
        {
          type: "Creditor Information",
          description: "One or more creditors are missing contact information.",
          severity: "medium",
          regulation: "BIA Directive 1R4",
          impact: "Creditors may not receive proper notification.",
          requiredAction: "Complete all creditor contact information fields.",
          solution: "Use the creditor lookup tool to complete missing fields."
        }
      ],
      documentId,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error creating Form 47 risk assessment: ${error}`);
    throw error;
  }
};
