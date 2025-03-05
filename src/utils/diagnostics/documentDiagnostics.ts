
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import logger from "@/utils/logger";

/**
 * Comprehensive document diagnostic utility that tests various aspects of document processing
 */
export const runDocumentDiagnostics = async (documentId: string): Promise<{
  success: boolean;
  results: Record<string, any>;
  errors: string[];
}> => {
  const startTime = performance.now();
  const results: Record<string, any> = {};
  const errors: string[] = [];
  
  logger.info(`Starting diagnostics for document ID: ${documentId}`);
  
  try {
    // Step 1: Check if document exists in database
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .maybeSingle();
      
    if (dbError) {
      errors.push(`Database error: ${dbError.message}`);
      return { success: false, results, errors };
    }
    
    if (!document) {
      errors.push(`Document not found in database: ${documentId}`);
      return { success: false, results, errors };
    }
    
    results.documentRecord = {
      id: document.id,
      title: document.title,
      storage_path: document.storage_path,
      ai_processing_status: document.ai_processing_status
    };
    
    // Step 2: Check if file exists in storage
    const storagePath = document.storage_path;
    if (!storagePath) {
      errors.push('Document record is missing storage_path');
      return { success: false, results, errors };
    }
    
    try {
      // Check if file exists by trying to get its metadata
      const { data: fileData } = await supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);
      
      results.storage = {
        publicUrl: fileData.publicUrl,
      };
      
      // Verify file is actually accessible
      const fetchStart = performance.now();
      const fileResponse = await fetch(fileData.publicUrl, { method: 'HEAD' });
      const fetchEnd = performance.now();
      
      results.storage.accessible = fileResponse.ok;
      results.storage.statusCode = fileResponse.status;
      results.storage.fetchTime = (fetchEnd - fetchStart).toFixed(2) + 'ms';
      
      if (!fileResponse.ok) {
        errors.push(`File inaccessible: Status ${fileResponse.status}`);
      }
    } catch (e: any) {
      errors.push(`Error accessing file: ${e.message}`);
      return { success: false, results, errors };
    }
    
    // Step 3: Check document analysis status
    if (document.ai_processing_status === 'processing') {
      // Check if analysis is stuck
      const processingStepsCompleted = document.metadata?.processing_steps_completed || [];
      const lastUpdateTime = document.updated_at;
      
      results.analysis = {
        status: document.ai_processing_status,
        stepsCompleted: processingStepsCompleted.length,
        lastUpdateTime
      };
      
      // Calculate time since last update
      const lastUpdateDate = new Date(lastUpdateTime);
      const timeSinceUpdate = Date.now() - lastUpdateDate.getTime();
      const minutesSinceUpdate = Math.floor(timeSinceUpdate / (1000 * 60));
      
      results.analysis.minutesSinceLastUpdate = minutesSinceUpdate;
      
      // If analysis has been stuck for more than 5 minutes
      if (minutesSinceUpdate > 5 && processingStepsCompleted.length < 5) {
        errors.push(`Analysis appears stuck (${minutesSinceUpdate} minutes since last update)`);
      }
    }
    
    // Get execution time
    const endTime = performance.now();
    results.diagnosticsDuration = (endTime - startTime).toFixed(2) + 'ms';
    
    return {
      success: errors.length === 0,
      results,
      errors
    };
  } catch (e: any) {
    errors.push(`Unexpected error: ${e.message}`);
    return { success: false, results, errors };
  }
};

/**
 * Attempts to repair common document issues
 */
export const repairDocumentIssues = async (documentId: string): Promise<{
  success: boolean;
  actions: string[];
  errors: string[];
}> => {
  const actions: string[] = [];
  const errors: string[] = [];
  
  logger.info(`Attempting to repair document ID: ${documentId}`);
  
  try {
    // First run diagnostics
    const { success, results, errors: diagErrors } = await runDocumentDiagnostics(documentId);
    
    if (!success) {
      // Get document record
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .maybeSingle();
        
      if (dbError || !document) {
        errors.push(`Cannot repair: Document not found`);
        return { success: false, actions, errors };
      }
      
      // Check if analysis is stuck
      if (document.ai_processing_status === 'processing') {
        const processingSteps = document.metadata?.processing_steps_completed || [];
        const lastUpdateTime = document.updated_at;
        const lastUpdateDate = new Date(lastUpdateTime);
        const minutesSinceUpdate = Math.floor((Date.now() - lastUpdateDate.getTime()) / (1000 * 60));
        
        // If analysis has been stuck for more than 5 minutes, reset it
        if (minutesSinceUpdate > 5 && processingSteps.length < 5) {
          await supabase
            .from('documents')
            .update({
              ai_processing_status: 'failed',
              metadata: {
                ...document.metadata,
                repair_attempt: true,
                repair_timestamp: new Date().toISOString(),
                processing_error: "Analysis timeout - reset by diagnostic tool"
              }
            })
            .eq('id', documentId);
            
          actions.push(`Reset stuck analysis process (status: processing → failed)`);
        }
      }
      
      // Check for storage path issues
      if (!document.storage_path || diagErrors.some(e => e.includes('storage_path'))) {
        errors.push(`Cannot repair: Missing or invalid storage path`);
      }
    } else {
      actions.push(`No issues detected that require repair`);
    }
    
    return {
      success: errors.length === 0,
      actions,
      errors
    };
  } catch (e: any) {
    errors.push(`Repair error: ${e.message}`);
    return { success: false, actions, errors };
  }
};
