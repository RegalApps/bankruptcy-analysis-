import { supabase } from '@/lib/supabase';
import { extractTextFromPdf } from './pdfUtils';
import { DocumentProcessingQueue } from './utils/documentProcessingQueue';

export const handleDocumentUpload = async (
  file: File,
  documentId: string,
  updateProgress: (message: string, percentage?: number) => void
) => {
  try {
    // Step 1: Initial processing (10%)
    updateProgress('Initializing document processing...', 10);
    
    // Extract initial text content for type detection
    let documentText = '';
    let documentType = 'unknown';
    
    if (file.type === 'application/pdf') {
      updateProgress('Processing PDF document...', 20);
      const arrayBuffer = await file.arrayBuffer();
      const result = await extractTextFromPdf(arrayBuffer);
      documentText = result.text;
      
      // Basic document type detection
      if (documentText.toLowerCase().includes('form 31') || 
          documentText.toLowerCase().includes('proof of claim')) {
        documentType = 'form31';
      } else if (documentText.toLowerCase().includes('form 47')) {
        documentType = 'form47';
      }
      
      updateProgress('Initial document analysis complete', 40);
    }

    // Step 2: Save initial metadata
    const metadata = {
      initial_text_length: documentText.length,
      detected_type: documentType,
      upload_timestamp: new Date().toISOString(),
      original_filename: file.name
    };

    // Update document with initial metadata
    const { error: updateError } = await supabase
      .from('documents')
      .update({ 
        metadata,
        type: file.type,
        ai_processing_status: 'pending'
      })
      .eq('id', documentId);

    if (updateError) throw updateError;

    // Step 3: Add to processing queue
    await DocumentProcessingQueue.addTask({
      documentId,
      storagePath: file.name,
      type: documentType,
      priority: 1
    });

    updateProgress('Document queued for detailed analysis', 100);
    
  } catch (error) {
    console.error('Document processing error:', error);
    updateProgress('Error processing document');
    throw error;
  }
};

export const uploadToStorage = async (
  file: File,
  userId: string,
  updateProgress: (message: string, percentage?: number) => void
) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  updateProgress('Uploading document to secure storage...', 20);

  const { error: uploadError, data } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) throw uploadError;

  updateProgress('Document uploaded, saving details...', 30);

  const { error: dbError, data: documentData } = await supabase
    .from('documents')
    .insert([
      {
        title: file.name,
        type: file.type,
        size: file.size,
        storage_path: fileName,
        url: data?.path || '',
        user_id: userId,
        metadata: {} // Initialize empty metadata
      }
    ])
    .select()
    .single();

  if (dbError) throw dbError;

  return { fileName, documentData };
};

export const cleanupUpload = async (fileName: string | null = null) => {
  if (fileName) {
    try {
      await supabase.storage.from('documents').remove([fileName]);
    } catch (error) {
      console.error('Error cleaning up failed upload:', error);
    }
  }
};
