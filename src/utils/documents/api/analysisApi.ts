
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";
import { AnalysisResult } from "../types/analysisTypes";

export const triggerDocumentAnalysis = async (documentId: string) => {
  try {
    const { error } = await supabase.functions.invoke('analyze-document', {
      body: { 
        documentId, 
        includeRegulatory: true,
        includeClientExtraction: true,
        extractionMode: 'comprehensive',
        extractionPatterns: {
          // Add specific patterns for Form 66
          form66: {
            clientName: "(?:to:|TO:|To:)\\s*([\\w\\s\\.\\-']+)",
            // Add other Form 66 specific patterns as needed
          }
        }
      }
    });

    if (error) {
      console.error('Error triggering document analysis:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to trigger document analysis:', error);
    throw error;
  }
};

export const saveAnalysisResults = async (
  documentId: string, 
  userId: string, 
  analysisData: AnalysisResult
) => {
  const { error } = await supabase
    .from('document_analysis')
    .insert([{
      document_id: documentId,
      user_id: userId,
      content: analysisData
    }]);

  if (error) {
    logger.error('Error saving analysis results:', error);
    throw error;
  }
  
  logger.info('Analysis results saved successfully for document ID:', documentId);
};

export const updateDocumentStatus = async (
  documentId: string, 
  status: 'processing' | 'complete' | 'failed'
) => {
  const { error } = await supabase
    .from('documents')
    .update({ ai_processing_status: status })
    .eq('id', documentId);
    
  if (error) {
    logger.error(`Error updating document status to ${status}:`, error);
    throw error;
  }
  
  logger.info(`Document status updated to ${status} for document ID:`, documentId);
};

export const createClientIfNotExists = async (clientInfo: any) => {
  if (!clientInfo?.clientName) {
    return null;
  }
  
  try {
    // Check if client already exists
    const { data: existingClients, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .ilike('name', clientInfo.clientName)
      .limit(1);
      
    if (checkError) throw checkError;
    
    // If client exists, return their ID
    if (existingClients && existingClients.length > 0) {
      return existingClients[0].id;
    }
    
    // Create new client
    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        name: clientInfo.clientName,
        email: clientInfo.clientEmail || null,
        phone: clientInfo.clientPhone || null,
        metadata: {
          address: clientInfo.clientAddress || null,
          totalDebts: clientInfo.totalDebts || null,
          totalAssets: clientInfo.totalAssets || null,
          monthlyIncome: clientInfo.monthlyIncome || null
        }
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    logger.info(`Created new client with ID: ${newClient.id}`);
    return newClient.id;
  } catch (error) {
    logger.error('Error creating client:', error);
    return null;
  }
};
