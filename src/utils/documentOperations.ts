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
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    // Create upload options with onUploadProgress callback
    const uploadOptions = {
      cacheControl: '3600',
      upsert: false
    };

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, uploadOptions);

    if (uploadError) throw uploadError;

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
        storage_path: filePath,
        user_id: user.id, // Add user_id field to fix RLS policy
        ai_processing_status: 'pending',
        metadata: {
          formType: isForm76 ? 'form-76' : null,
          uploadDate: new Date().toISOString(),
          client_name: isForm76 ? extractClientName(file.name) : 'Untitled Client',
          ocr_status: 'pending'
        }
      })
      .select()
      .single();

    if (documentError) throw documentError;

    return documentData;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
