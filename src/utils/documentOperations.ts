
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

// Helper function to create a folder if it doesn't exist
const createFolderIfNotExists = async (
  folderName: string, 
  folderType: string, 
  userId: string,
  parentFolderId?: string
): Promise<string> => {
  try {
    // Check if folder already exists
    const { data: existingFolders } = await supabase
      .from('documents')
      .select('id')
      .eq('title', folderName)
      .eq('is_folder', true)
      .eq('folder_type', folderType)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingFolders) {
      logger.info(`Folder "${folderName}" already exists, id: ${existingFolders.id}`);
      return existingFolders.id;
    }
    
    // Create new folder
    const { data: newFolder, error } = await supabase
      .from('documents')
      .insert({
        title: folderName,
        is_folder: true,
        folder_type: folderType,
        user_id: userId,
        parent_folder_id: parentFolderId,
        type: 'folder',
        size: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    logger.info(`Created new folder "${folderName}", id: ${newFolder.id}`);
    return newFolder.id;
  } catch (error) {
    logger.error(`Error creating folder "${folderName}":`, error);
    throw error;
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
    
    // Create mock data for demonstration (Form 76 example)
    // In a real application, this would be replaced with actual AI analysis
    const mockAnalysisData = {
      extracted_info: {
        formNumber: "Form 76",
        clientName: "Reginald Dickerson",
        dateSigned: "February 22, 2025",
        trusteeName: "Gradey Henderson",
        type: "bankruptcy",
        summary: "This is a bankruptcy form (Form 76) for Reginald Dickerson. The form was submitted on February 22, 2025. The trustee assigned to this case is Gradey Henderson."
      },
      risks: [
        {
          type: "Missing Financial Details",
          description: "There are no income, assets, liabilities, or creditor details present in the extracted information.",
          severity: "high",
          regulation: "BIA Reference: Section 158(a) requires a debtor to disclose full financial affairs to the trustee. Directive Reference: OSB Directive No. 6R3 states the requirement to file a Statement of Affairs.",
          impact: "May delay the bankruptcy process and lead to rejection of filing.",
          requiredAction: "Submit complete financial disclosure within 5 days.",
          solution: "Attach a Statement of Affairs with required financial details."
        },
        {
          type: "Lack of Required Signatures",
          description: "The form does not indicate whether it has been signed by the debtor or trustee.",
          severity: "medium",
          regulation: "BIA Reference: Section 50.4(8) mandates signatures for formal insolvency proceedings. Directive Reference: OSB Form Guidelines state that official documents must have authenticated signatures.",
          impact: "Document may be considered invalid without proper signatures.",
          requiredAction: "Obtain signatures before next trustee meeting.",
          solution: "Use digital signing (e.g., DocuSign API integration)."
        },
        {
          type: "No Creditor Information Provided",
          description: "There is no evidence of creditor claims or liabilities.",
          severity: "high",
          regulation: "BIA Reference: Section 158(c) states that a debtor must disclose all creditors and amounts owed. Directive Reference: OSB Directive No. 11 outlines creditor claim procedures.",
          impact: "Creditors may not be properly notified of proceedings.",
          requiredAction: "Submit creditor details within 3 days.",
          solution: "Use OCR and AI-driven form processing to extract financial details from bank statements."
        },
        {
          type: "No Mention of Assets or Exemptions",
          description: "There is no declaration of assets, which is critical for determining surplus income and potential liquidation.",
          severity: "medium",
          regulation: "BIA Reference: Section 67(1) discusses the division of assets under bankruptcy. Directive Reference: OSB Directive No. 11R2 details asset disclosure requirements.",
          impact: "May result in improper handling of debtor assets.",
          requiredAction: "Disclose assets before initial bankruptcy assessment.",
          solution: "Automate asset tracking through the CRM system."
        }
      ],
      regulatory_compliance: {
        status: "non_compliant",
        details: "This document does not meet BIA compliance requirements due to missing financial details, signatures, creditor information, and asset disclosures.",
        references: [
          "BIA Section 158(a) - Disclosure of financial affairs",
          "OSB Directive No. 6R3 - Statement of Affairs requirements",
          "BIA Section 50.4(8) - Signature requirements",
          "OSB Directive No. 11 - Creditor claim procedures"
        ]
      }
    };

    // For real implementation, uncomment this and remove the mock data:
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
    */

    // Save the analysis results 
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .insert([{
        document_id: documentData.id,
        user_id: session.user.id,
        content: mockAnalysisData
      }]);

    if (analysisError) {
      logger.error('Error saving analysis results:', analysisError);
      throw analysisError;
    }

    // Create folder structure based on extracted information
    try {
      const clientName = mockAnalysisData.extracted_info.clientName;
      const formNumber = mockAnalysisData.extracted_info.formNumber;
      
      if (clientName && formNumber) {
        // First create a client folder
        const clientFolderId = await createFolderIfNotExists(
          clientName, 
          'client', 
          session.user.id
        );
        
        // Then create a form folder inside the client folder
        const formFolderName = `${formNumber} - Documents`;
        const formFolderId = await createFolderIfNotExists(
          formFolderName,
          'form',
          session.user.id,
          clientFolderId
        );
        
        // Move the document into the form folder
        const { error: moveError } = await supabase
          .from('documents')
          .update({ parent_folder_id: formFolderId })
          .eq('id', documentData.id);
        
        if (moveError) {
          logger.error('Error moving document to folder:', moveError);
        } else {
          logger.info(`Document moved to folder structure: ${clientName} > ${formFolderName}`);
        }
      } else {
        logger.warn('Could not create folder structure: missing client name or form number');
      }
    } catch (folderError: any) {
      logger.error('Error creating folder structure:', folderError);
      // Don't throw here - we still want to complete the document update
    }

    // Update document status to indicate analysis is complete
    await supabase
      .from('documents')
      .update({ ai_processing_status: 'complete' })
      .eq('id', documentData.id);
    
    logger.info('Automatic document analysis completed successfully');
    
    toast({
      title: "Document Uploaded",
      description: "Document was uploaded and analyzed successfully."
    });
    
  } catch (error: any) {
    logger.error('Automatic document analysis failed:', error);
    
    // Update document status to indicate analysis failed
    await supabase
      .from('documents')
      .update({ ai_processing_status: 'failed' })
      .eq('id', documentData.id);
      
    toast({
      variant: "destructive",
      title: "Analysis Failed",
      description: "Document was uploaded but analysis could not be completed: " + error.message
    });
  }

  return documentData;
};
