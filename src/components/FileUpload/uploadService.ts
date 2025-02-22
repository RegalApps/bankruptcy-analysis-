
import { supabase } from '@/lib/supabase';
import { extractTextFromPdf } from './pdfUtils';

export const handleDocumentUpload = async (
  file: File,
  documentId: string,
  updateProgress: (message: string, percentage?: number) => void
) => {
  let documentText = '';
  
  try {
    // Step 1: Initial processing (10%)
    updateProgress('Initializing document processing...', 10);
    
    if (file.type === 'application/pdf') {
      updateProgress('Processing PDF document...', 20);
      const arrayBuffer = await file.arrayBuffer();
      documentText = await extractTextFromPdf(arrayBuffer);
      console.log('Extracted PDF text length:', documentText.length);
      updateProgress('PDF text extraction complete', 40);
    } else {
      const text = await file.text();
      documentText = text;
      updateProgress('Document text extracted', 40);
    }

    // Validate text content
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('No text could be extracted from the document');
    }

    // Step 2: Document Analysis (40-80%)
    updateProgress('Analyzing document content...', 50);

    // Retry mechanism for analysis with progress updates
    let attempts = 0;
    const maxAttempts = 3;
    let analysisError = null;

    while (attempts < maxAttempts) {
      try {
        const { error } = await supabase.functions.invoke('analyze-document', {
          body: {
            documentText,
            documentId
          }
        });

        if (!error) {
          updateProgress('Document analysis completed successfully', 100);
          return;
        }

        analysisError = error;
        attempts++;
        
        if (attempts < maxAttempts) {
          const progress = 50 + (attempts * 10); // Progress from 50-80%
          updateProgress(`Retrying analysis (attempt ${attempts + 1}/${maxAttempts})...`, progress);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      } catch (error) {
        analysisError = error;
        attempts++;
        if (attempts < maxAttempts) {
          const progress = 50 + (attempts * 10);
          updateProgress(`Retrying analysis (attempt ${attempts + 1}/${maxAttempts})...`, progress);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }

    if (analysisError) {
      console.error('Analysis error after retries:', analysisError);
      throw analysisError;
    }
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
        user_id: userId
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
