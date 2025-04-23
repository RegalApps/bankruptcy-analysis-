import logger from "@/utils/logger";
import { analyzeBankruptcyForm } from "@/services/bankruptcyAnalyzer";
import { v4 as uuidv4 } from 'uuid';

/**
 * Document data structure
 */
export interface DocumentData {
  id: string;
  title: string;
  type: string;
  size: number;
  created_at: string;
  analysis: any;
  status: 'processed' | 'pending' | 'error';
  dataUrl?: string;
}

// In-memory storage for documents (replaces Supabase)
// This will contain sample documents and any uploaded by the user
export const localDocumentStorage: DocumentData[] = [
  // Sample document 1
  {
    id: 'sample-doc-1',
    title: 'Bankruptcy Form 1',
    type: 'application/pdf',
    size: 245000,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    analysis: {
      extracted_info: {
        clientName: 'John Smith',
        formNumber: '1',
        formType: 'bankruptcy',
        documentStatus: 'pending',
        summary: 'Bankruptcy filing document'
      },
      risks: [
        {
          type: 'Missing Information',
          description: 'Some required fields are not completed.',
          severity: 'medium',
          regulation: 'Bankruptcy Filing Guidelines',
          impact: 'Potential delay in processing',
          requiredAction: 'Complete all required fields',
          solution: 'Review document for completeness',
          deadline: '7 days'
        }
      ]
    },
    status: 'processed'
  },
  // Sample document 2
  {
    id: 'sample-doc-2',
    title: 'Consumer Proposal Form 47',
    type: 'application/pdf',
    size: 325000,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    analysis: {
      extracted_info: {
        clientName: 'Jane Doe',
        formNumber: '47',
        formType: 'consumer-proposal',
        documentStatus: 'completed',
        summary: 'Consumer proposal document'
      },
      risks: [
        {
          type: 'Deadline Approaching',
          description: 'Filing deadline is approaching.',
          severity: 'high',
          regulation: 'Consumer Proposal Guidelines',
          impact: 'Potential rejection if missed',
          requiredAction: 'Submit before deadline',
          solution: 'Prepare all documents for submission',
          deadline: '3 days'
        }
      ]
    },
    status: 'processed'
  }
];

/**
 * Uploads and processes a document locally
 */
export const uploadDocument = async (file: File): Promise<DocumentData> => {
  try {
    logger.info(`Processing file ${file.name}`);
    
    // Generate a unique ID for the document
    const documentId = uuidv4();
    
    // Create initial document record
    const documentData: DocumentData = {
      id: documentId,
      title: file.name,
      type: file.type,
      size: file.size,
      created_at: new Date().toISOString(),
      analysis: null,
      status: 'pending'
    };
    
    // Store document in local storage
    localDocumentStorage.push(documentData);
    
    logger.info(`Document record created with ID: ${documentId}`);
    
    // Create a FileReader to read the file as a data URL
    const reader = new FileReader();
    
    // Convert the file to a data URL and store it in local storage
    const fileDataPromise = new Promise<void>((resolve, reject) => {
      reader.onload = () => {
        try {
          // Get existing documents from local storage
          const documentsJson = localStorage.getItem('uploaded_documents') || '{}';
          const documents = JSON.parse(documentsJson);
          
          // Store the file data URL
          documents[documentId] = {
            dataUrl: reader.result,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString()
          };
          
          // Save back to local storage
          localStorage.setItem('uploaded_documents', JSON.stringify(documents));
          
          logger.info(`Document data URL stored in local storage: ${documentId}`);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file data'));
      };
      
      reader.readAsDataURL(file);
    });
    
    // Wait for the file data to be stored
    await fileDataPromise;
    
    // For PDF files, analyze with bankruptcy form analyzer
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        logger.info(`Analyzing PDF with bankruptcy form analyzer: ${file.name}`);
        const analysisResult = await analyzeBankruptcyForm(file);
        
        // Update document with analysis results
        const docIndex = localDocumentStorage.findIndex(doc => doc.id === documentId);
        if (docIndex !== -1) {
          localDocumentStorage[docIndex].analysis = analysisResult;
          localDocumentStorage[docIndex].status = 'processed';
          
          logger.info(`Analysis completed for document: ${documentId}`);
          return localDocumentStorage[docIndex];
        }
      } catch (analysisError) {
        logger.error(`Error analyzing document: ${analysisError}`);
        const docIndex = localDocumentStorage.findIndex(doc => doc.id === documentId);
        if (docIndex !== -1) {
          localDocumentStorage[docIndex].status = 'error';
        }
      }
    }
    
    return documentData;
  } catch (error) {
    logger.error('Error processing document:', error);
    throw new Error('Failed to process document: ' + (error instanceof Error ? error.message : String(error)));
  }
};

/**
 * Retrieves all documents from local storage
 */
export const getDocuments = async (): Promise<DocumentData[]> => {
  return [...localDocumentStorage];
};

/**
 * Retrieves a document by ID from local storage
 */
export const getDocumentById = async (documentId: string): Promise<DocumentData | null> => {
  try {
    const document = localDocumentStorage.find(doc => doc.id === documentId);
    
    if (!document) {
      // Instead of logging an error, just return null silently
      // This prevents console errors for non-existent documents
      return null;
    }
    
    return document;
  } catch (error) {
    // Log the error but don't display it in the console
    logger.error(`Error loading document: ${error} DocumentID: ${documentId}`);
    return null;
  }
};

/**
 * Deletes a document from local storage
 */
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  const initialLength = localDocumentStorage.length;
  const index = localDocumentStorage.findIndex(doc => doc.id === documentId);
  
  if (index !== -1) {
    localDocumentStorage.splice(index, 1);
    return localDocumentStorage.length < initialLength;
  }
  
  return false;
};
