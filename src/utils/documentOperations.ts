
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import logger from "@/utils/logger";
import { extractTextFromPdf } from "./documents/pdfUtils";
import { organizeDocumentIntoFolders } from "./documents/folderUtils";
import { 
  performMockAnalysis, 
  saveAnalysisResults, 
  updateDocumentStatus,
  triggerDocumentAnalysis as triggerAnalysis
} from "./documents/analysisUtils";

export const triggerDocumentAnalysis = async (documentId: string) => {
  try {
    await triggerAnalysis(documentId);
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
    
    // Get analysis results (mock for demonstration)
    const analysisData = performMockAnalysis();

    // For real implementation, uncomment this and remove the performMockAnalysis:
    /*
    // Submit for analysis
    const { data, error } = await supabase.functions.invoke('analyze-document', {
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

    const analysisData = data;
    */

    // Save the analysis results 
    await saveAnalysisResults(documentData.id, session.user.id, analysisData);

    // Create folder structure based on extracted information
    await organizeDocumentIntoFolders(
      documentData.id,
      session.user.id,
      analysisData.extracted_info.clientName,
      analysisData.extracted_info.formNumber
    );

    // Update document status to indicate analysis is complete
    await updateDocumentStatus(documentData.id, 'complete');
    
    logger.info('Automatic document analysis completed successfully');
    
    toast({
      title: "Document Uploaded",
      description: "Document was uploaded and analyzed successfully."
    });
    
  } catch (error: any) {
    logger.error('Automatic document analysis failed:', error);
    
    // Update document status to indicate analysis failed
    await updateDocumentStatus(documentData.id, 'failed');
      
    toast({
      variant: "destructive",
      title: "Analysis Failed",
      description: "Document was uploaded but analysis could not be completed: " + error.message
    });
  }

  return documentData;
};
