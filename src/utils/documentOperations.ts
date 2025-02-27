
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import logger from "@/utils/logger";
import * as pdfjs from 'pdfjs-dist';

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

const extractTextFromPdf = async (url: string): Promise<string> => {
  try {
    logger.info('Starting PDF text extraction from:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    logger.info('PDF fetched, arrayBuffer size:', arrayBuffer.byteLength);
    
    // Initialize PDF.js worker if not already initialized
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      const workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    }
    
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    logger.info('PDF loaded, pages:', pdf.numPages);
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      logger.debug(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    logger.info('Text extraction complete. Length:', fullText.length);
    return fullText;
  } catch (error: any) {
    logger.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
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
      ai_processing_status: 'processing'
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

  // Start document analysis immediately after upload
  try {
    logger.info('Starting automatic document analysis for document ID:', documentData.id);
    
    // Extract text from the uploaded PDF
    const documentText = await extractTextFromPdf(publicUrl);
    
    if (!documentText || documentText.trim().length < 50) {
      logger.error('Insufficient text extracted from document.');
      throw new Error('Could not extract sufficient text from the document');
    }
    
    // Submit for analysis
    const { error } = await supabase.functions.invoke('analyze-document', {
      body: { 
        documentText,
        documentId: documentData.id,
        includeRegulatory: true,
        title: file.name
      }
    });

    if (error) {
      logger.error('Analysis function error:', error);
      throw error;
    }

    // Update document status to indicate analysis is complete
    await supabase
      .from('documents')
      .update({ ai_processing_status: 'complete' })
      .eq('id', documentData.id);
    
    logger.info('Automatic document analysis completed successfully');
    
    // Don't toast here, as it might be confusing to the user
    // They'll see the analysis results when they open the document
  } catch (error: any) {
    logger.error('Automatic document analysis failed:', error);
    
    // Update document status to indicate analysis failed
    await supabase
      .from('documents')
      .update({ ai_processing_status: 'failed' })
      .eq('id', documentData.id);
  }

  return documentData;
};
