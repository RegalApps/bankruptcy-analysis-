
import { supabase } from '@/lib/supabase';
import { extractTextFromPdf } from './pdfUtils';

export const handleDocumentUpload = async (
  file: File,
  documentId: string,
  updateProgress: (message: string) => void
) => {
  let documentText = '';
  
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    documentText = await extractTextFromPdf(arrayBuffer);
    console.log('Extracted PDF text:', documentText);
  } else {
    const text = await file.text();
    documentText = text;
  }

  const { error: analysisError } = await supabase.functions
    .invoke('analyze-document', {
      body: {
        documentText,
        documentId
      }
    });

  if (analysisError) throw analysisError;
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
