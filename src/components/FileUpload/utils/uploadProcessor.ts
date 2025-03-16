
import { supabase } from '@/lib/supabase';
import logger from "@/utils/logger";

/**
 * Extracts client name from Form 76 filename
 */
export function extractClientName(filename: string): string {
  const nameMatch = filename.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
  if (nameMatch && nameMatch[1]) {
    return nameMatch[1].trim();
  }
  return 'Untitled Client';
}

/**
 * Creates a more realistic and controlled upload process simulation
 */
export const simulateProcessingStages = async (
  isForm76: boolean, 
  isExcel: boolean,
  setUploadProgress: (progress: number) => void,
  setUploadStep: (step: string) => void
): Promise<void> => {
  // Initial validation stage (fast)
  setUploadProgress(10);
  setUploadStep("Validating document format and size...");
  await new Promise(r => setTimeout(r, 1000));
  
  // Upload stage (slow)
  setUploadProgress(25);
  setUploadStep("Uploading document to secure storage...");
  await new Promise(r => setTimeout(r, 2000));
  
  // Processing stages (variable time based on document type)
  setUploadProgress(40);
  if (isForm76) {
    setUploadStep("Analyzing Form 76 and extracting client details...");
    await new Promise(r => setTimeout(r, 3000));
  } else if (isExcel) {
    setUploadStep("Processing financial spreadsheet data...");
    await new Promise(r => setTimeout(r, 2500));
  } else {
    setUploadStep("Performing document analysis...");
    await new Promise(r => setTimeout(r, 2000));
  }
  
  setUploadProgress(60);
  if (isForm76) {
    setUploadStep("Performing compliance risk assessment...");
  } else if (isExcel) {
    setUploadStep("Analyzing financial data patterns...");
  } else {
    setUploadStep("Extracting key document information...");
  }
  await new Promise(r => setTimeout(r, 2500));
  
  // Risk assessment and organization (slow)
  setUploadProgress(80);
  setUploadStep("Organizing document in folder structure...");
  await new Promise(r => setTimeout(r, 2000));
  
  // Completion (fast)
  setUploadProgress(95);
  setUploadStep("Finalizing document processing...");
  await new Promise(r => setTimeout(r, 1500));
  
  setUploadProgress(100);
  setUploadStep("Upload complete!");
};

/**
 * Uploads file to Supabase storage
 */
export const uploadToStorage = async (
  file: File,
  userId: string,
  filePath: string
): Promise<{ error?: Error }> => {
  logger.info(`Uploading file to storage path: ${filePath}`);
  
  try {
    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    return {};
  } catch (error) {
    logger.error(`Storage upload error: ${error}`);
    return { error: error as Error };
  }
};

/**
 * Creates document record in database
 */
export const createDocumentRecord = async (
  file: File,
  userId: string,
  clientName: string | undefined,
  isForm76: boolean
): Promise<{ data?: any, error?: Error }> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        type: file.type,
        size: file.size,
        user_id: userId,
        ai_processing_status: 'pending',
        metadata: {
          formType: isForm76 ? 'form-76' : null,
          uploadDate: new Date().toISOString(),
          client_name: isForm76 ? extractClientName(file.name) : clientName || 'Untitled Client',
          ocr_status: 'pending',
          upload_method: 'client_intake'
        }
      })
      .select()
      .single();
      
    if (error) throw error;
    return { data };
  } catch (error) {
    logger.error(`Database error: ${error}`);
    return { error: error as Error };
  }
};

/**
 * Triggers document analysis using edge function
 */
export const triggerDocumentAnalysis = async (documentId: string, fileName: string, isForm76: boolean): Promise<{ error?: Error }> => {
  try {
    const { error } = await supabase.functions.invoke('analyze-document', {
      body: { 
        documentId,
        includeRegulatory: true,
        includeClientExtraction: true,
        title: fileName,
        extractionMode: 'comprehensive',
        formType: isForm76 ? 'form-76' : 'unknown'
      }
    });
    
    if (error) throw error;
    return {};
  } catch (error) {
    logger.warn("Error triggering analysis:", error);
    return { error: error as Error };
  }
};

/**
 * Creates notification for document upload events
 */
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success',
  documentId: string,
  fileName: string,
  processingStage: string
): Promise<void> => {
  try {
    await supabase.functions.invoke('handle-notifications', {
      body: {
        action: 'create',
        userId,
        notification: {
          title,
          message,
          type,
          category: 'file_activity',
          priority: 'normal',
          action_url: `/documents/${documentId}`,
          metadata: {
            documentId,
            fileName,
            processingStage,
            timestamp: new Date().toISOString()
          }
        }
      }
    });
  } catch (error) {
    logger.warn(`Error creating ${title} notification:`, error);
    // Continue processing even if notification fails
  }
};
