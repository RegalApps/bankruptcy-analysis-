
import { supabase } from "@/lib/supabase";

// Function to extract client name from Form 76 filename
function extractClientName(filename: string): string {
  const nameMatch = filename.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
  if (nameMatch && nameMatch[1]) {
    return nameMatch[1].trim();
  }
  return 'Untitled Client';
}

// Function to extract client name from Form 47 filename
function extractForm47ClientName(filename: string): string {
  // First, try to match pattern like "Form47_ClientName.pdf"
  const nameMatch = filename.match(/form[- ]?47[- _](.+?)(?:\.|$)/i);
  if (nameMatch && nameMatch[1]) {
    return nameMatch[1].trim();
  }
  
  // Default client name for Form 47 if pattern doesn't match
  return 'Josh Hart';
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
    let formType = null;
    let submissionDeadline = null;
    
    if (isForm76) {
      clientName = extractClientName(file.name);
      formType = 'form-76';
    } else if (isForm47) {
      clientName = extractForm47ClientName(file.name);
      formType = 'form-47';
      
      // Set a default submission deadline for Form 47 (30 days from now)
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + 30);
      submissionDeadline = deadlineDate.toISOString();
    }

    // Set a default filing date for form documents (today)
    const filingDate = new Date().toISOString();

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
          formType: formType,
          uploadDate: new Date().toISOString(),
          client_name: clientName,
          ocr_status: 'pending',
          upload_id: uniqueId,
          filingDate: filingDate,
          submissionDeadline: submissionDeadline,
          requiresSignature: isForm47, // Flag that Form 47 requires signatures
          signatureStatus: isForm47 ? 'pending' : null,
          signaturesRequired: isForm47 ? ['debtor', 'administrator', 'witness'] : []
        },
        // Add deadline for Form 47
        deadlines: isForm47 ? [{
          title: "Form 47 Submission Deadline",
          dueDate: submissionDeadline,
          description: "Consumer Proposal must be submitted before this date"
        }] : []
      })
      .select()
      .single();

    if (documentError) {
      console.error("Database insert error:", documentError);
      throw documentError;
    }

    console.log("Document record created with ID:", documentData.id);
    console.log("Document storage_path set to:", filePath);

    // Create notification for Form 47 deadline if applicable
    if (isForm47 && submissionDeadline) {
      try {
        await supabase.functions.invoke('handle-notifications', {
          body: {
            action: 'create',
            userId: user.id,
            notification: {
              title: 'Form 47 Submission Deadline',
              message: `Consumer Proposal for ${clientName} must be submitted by ${new Date(submissionDeadline).toLocaleDateString()}`,
              type: 'reminder',
              priority: 'high',
              category: 'deadline',
              action_url: `/documents/${documentData.id}`,
              metadata: {
                documentId: documentData.id,
                deadlineType: 'submission',
                dueDate: submissionDeadline,
                formType: 'form-47'
              }
            }
          }
        });
      } catch (error) {
        console.error("Failed to create deadline notification:", error);
        // Continue anyway, the upload was successful
      }
    }

    // Immediately trigger document analysis
    try {
      console.log("Triggering document analysis...");
      const { error: analysisError } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentId: documentData.id,
          title: file.name,
          formType: formType
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
