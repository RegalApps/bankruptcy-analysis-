
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const triggerDocumentAnalysis = async (documentId: string) => {
  try {
    const { error } = await supabase.functions.invoke('analyze-document', {
      body: { documentId }
    });

    if (error) {
      console.error('Error triggering document analysis:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to trigger document analysis:', error);
    toast({
      variant: "destructive",
      title: "Analysis Error",
      description: "Failed to analyze document. Please try again later."
    });
  }
};

export const uploadDocument = async (file: File) => {
  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("Authentication required");
  }

  // Create a unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = fileName;

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  // Create document record in database
  const { data: documentData, error: dbError } = await supabase
    .from('documents')
    .insert({
      title: file.name,
      type: file.type,
      size: file.size,
      storage_path: filePath,
      url: publicUrl,
      user_id: session.user.id,
      ai_processing_status: 'pending'
    })
    .select('id')
    .single();

  if (dbError) {
    // If database insert fails, delete the uploaded file
    await supabase.storage
      .from('documents')
      .remove([filePath]);
    throw dbError;
  }

  return documentData;
};
