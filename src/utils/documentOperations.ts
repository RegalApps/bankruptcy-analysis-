
import { supabase } from "@/lib/supabase";

// Function to extract client name from Form 76 filename
function extractClientName(filename: string): string {
  const nameMatch = filename.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
  if (nameMatch && nameMatch[1]) {
    return nameMatch[1].trim();
  }
  return 'Untitled Client';
}

export const uploadDocument = async (file: File) => {
  try {
    // Get user ID for document ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to upload documents");
    }

    const fileExt = file.name.split('.').pop();
    const uniqueId = crypto.randomUUID();
    const filePath = `${uniqueId}.${fileExt}`;

    console.log(`Uploading file: ${filePath}`);

    // Create upload options with onUploadProgress callback
    const uploadOptions = {
      cacheControl: '3600',
      upsert: false
    };

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, uploadOptions);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw uploadError;
    }

    console.log("File uploaded successfully to storage path:", filePath);

    // Try to detect if this is Form 76 from the filename
    const isForm76 = file.name.toLowerCase().includes('form 76') ||
      file.name.toLowerCase().includes('f76') ||
      file.name.toLowerCase().includes('form76');

    // Create database record with user_id
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        type: file.type,
        size: file.size,
        storage_path: filePath, // Explicitly set the storage path
        user_id: user.id, // Add user_id field to fix RLS policy
        ai_processing_status: 'pending',
        metadata: {
          formType: isForm76 ? 'form-76' : null,
          uploadDate: new Date().toISOString(),
          client_name: isForm76 ? extractClientName(file.name) : 'Untitled Client',
          ocr_status: 'pending',
          upload_id: uniqueId
        }
      })
      .select()
      .single();

    if (documentError) {
      console.error("Database insert error:", documentError);
      throw documentError;
    }

    console.log("Document record created with ID:", documentData.id);
    console.log("Document storage_path set to:", filePath);

    return documentData;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
