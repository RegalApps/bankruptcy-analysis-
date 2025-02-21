
import { supabase } from '@/lib/supabase';
import { extractTextFromPdf } from './pdfUtils';

export const handleDocumentUpload = async (
  file: File,
  documentId: string,
  updateProgress: (message: string) => void
) => {
  let documentText = '';
  
  try {
    updateProgress('Processing document...');
    
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      documentText = await extractTextFromPdf(arrayBuffer);
      console.log('Extracted PDF text:', documentText);
    } else {
      const text = await file.text();
      documentText = text;
    }

    // Validate that we have text content before proceeding
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('No text could be extracted from the document');
    }

    updateProgress('Analyzing document...');

    // Retry mechanism for analysis
    let attempts = 0;
    const maxAttempts = 3;
    let analysisError = null;

    while (attempts < maxAttempts) {
      try {
        const { error } = await supabase.functions
          .invoke('analyze-document', {
            body: {
              documentText,
              documentId
            }
          });

        if (!error) {
          updateProgress('Document processed successfully');
          return;
        }

        analysisError = error;
        attempts++;
        
        if (attempts < maxAttempts) {
          updateProgress(`Retrying analysis (attempt ${attempts + 1}/${maxAttempts})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
        }
      } catch (error) {
        analysisError = error;
        attempts++;
        if (attempts < maxAttempts) {
          updateProgress(`Retrying analysis (attempt ${attempts + 1}/${maxAttempts})...`);
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
  updateProgress: (message: string) => void
) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError, data } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) throw uploadError;

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
