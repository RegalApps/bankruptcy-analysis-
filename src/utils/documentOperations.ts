
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

type ProgressCallback = (progress: number, message: string) => void;

export const uploadDocument = async (
  file: File, 
  progressCallback?: ProgressCallback,
  extraMetadata?: Record<string, any>
): Promise<any> => {
  // First ensure storage bucket exists
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const documentsBucketExists = buckets?.some(b => b.name === 'documents');
    
    if (!documentsBucketExists) {
      console.log("Documents bucket doesn't exist, attempting to create it");
      const { error } = await supabase.storage.createBucket('documents', { public: false });
      if (error) {
        console.error("Failed to create documents bucket:", error);
        throw new Error('Storage system not properly configured');
      }
    }
  } catch (error) {
    console.error("Error checking storage buckets:", error);
    toast.error("Storage system unavailable. Please contact support.");
    throw new Error('Storage system not properly configured');
  }
  
  try {
    // Update progress
    progressCallback?.(20, "Validating user session...");
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Auth error:", userError);
      progressCallback?.(0, "Authentication failed");
      throw new Error('Authentication required. Please login again.');
    }
    
    const userId = userData?.user?.id || 'anonymous';
    
    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const timeStamp = new Date().getTime();
    const safeFileName = file.name.replace(/\s+/g, '_');
    const filePath = `${userId}/${timeStamp}_${safeFileName}`;
    
    progressCallback?.(30, "Uploading file...");
    console.log('Uploading file to storage path:', filePath);

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      progressCallback?.(0, "Upload failed");
      throw new Error("Upload failed. Please try again.");
    }
    
    progressCallback?.(60, "Processing document...");
    console.log('File uploaded successfully, creating DB record');

    // Extract metadata from filename
    const extractedClientId = extractClientIdFromFilename(file.name);
    const isForm76 = file.name.toLowerCase().includes('form 76');
    const documentType = determineDocumentType(file);
    
    // Build combined metadata
    const metadata = {
      original_filename: file.name,
      upload_date: new Date().toISOString(),
      content_type: file.type,
      extracted_client_id: extractedClientId,
      ...extraMetadata,
      ...(isForm76 ? { document_type: 'form76' } : {})
    };
    
    progressCallback?.(70, "Saving document information...");

    // Create document record in database
    const { data: documentData, error: dbError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        type: file.type,
        size: file.size,
        storage_path: filePath,
        user_id: userId,
        ai_processing_status: 'processing',
        metadata
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      
      // Attempt to clean up storage file if database insert fails
      await supabase.storage.from('documents').remove([filePath]);
      
      progressCallback?.(0, "Failed to save document");
      throw new Error("Failed to save document information.");
    }
    
    progressCallback?.(80, "Generating document preview...");
    console.log('Document record created successfully:', documentData);
    
    // Start document analysis
    triggerDocumentAnalysis(documentData.id, file.name, isForm76);
    
    progressCallback?.(100, "Document uploaded successfully!");
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
  
  // Try to extract client name from Form 76
  if (filename.toLowerCase().includes('form 76') || filename.toLowerCase().includes('form76')) {
    const nameMatch = filename.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1].trim();
    }
  }
  
  return undefined;
}

function determineDocumentType(file: File): string {
  const name = file.name.toLowerCase();
  
  if (name.includes('form 76') || name.includes('form76')) {
    return 'form76';
  }
  if (name.includes('form 47') || name.includes('form47')) {
    return 'form47';
  }
  if (name.includes('form 31') || name.includes('form31')) {
    return 'form31';
  }
  
  // Check file extension
  if (name.endsWith('.pdf')) {
    return 'pdf';
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return 'spreadsheet';
  }
  if (name.endsWith('.docx') || name.endsWith('.doc')) {
    return 'document';
  }
  
  return 'other';
}

// Function to trigger document analysis
async function triggerDocumentAnalysis(documentId: string, filename: string, isForm76: boolean): Promise<void> {
  try {
    // For now just simulate by updating the status after a delay
    setTimeout(async () => {
      await supabase
        .from('documents')
        .update({ 
          ai_processing_status: 'completed',
          ai_confidence_score: Math.random() * 0.4 + 0.6 // Random score between 0.6 and 1.0
        })
        .eq('id', documentId);
      
      console.log(`Document analysis completed for ${documentId}`);
    }, 5000);
  } catch (error) {
    console.error('Error triggering document analysis:', error);
  }
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

// Adding the missing function that's being imported elsewhere
export const createForm47RiskAssessment = async (documentId: string): Promise<any> => {
  try {
    // This function would typically create a risk assessment for a Form 47 document
    console.log(`Creating risk assessment for Form 47 document: ${documentId}`);
    
    // Return mock risk data
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
