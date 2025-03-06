
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
      
    // Check for Consumer Proposal Form 47
    const isForm47 = file.name.toLowerCase().includes('form 47') ||
      file.name.toLowerCase().includes('f47') ||
      file.name.toLowerCase().includes('form47') ||
      file.name.toLowerCase().includes('consumer proposal');

    // Extract client name based on document type
    let clientName = 'Untitled Client';
    if (isForm76) {
      clientName = extractClientName(file.name);
    } else if (isForm47 && file.name.includes('_')) {
      // Try to extract client name from Form 47 filename (e.g., "Form47_JohnDoe.pdf")
      const parts = file.name.split('_');
      if (parts.length > 1) {
        clientName = parts[1].split('.')[0].trim();
      } else {
        clientName = 'Josh Hart'; // Default client name for Form 47
      }
    }

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
          formType: isForm76 ? 'form-76' : (isForm47 ? 'form-47' : null),
          uploadDate: new Date().toISOString(),
          client_name: clientName,
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

    // Immediately trigger document analysis
    try {
      console.log("Triggering document analysis...");
      const { error: analysisError } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentId: documentData.id,
          title: file.name,
          formType: isForm76 ? 'form-76' : (isForm47 ? 'form-47' : null)
        }
      });

      if (analysisError) {
        console.error("Analysis error:", analysisError);
        // Continue anyway, the upload was successful
      } else {
        console.log("Analysis triggered successfully");
      }
    } catch (error) {
      console.error("Failed to trigger analysis:", error);
      // Continue anyway, the upload was successful
    }

    return documentData;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
