import { useToast } from "@/hooks/use-toast";
import { DocumentDetails } from "../types";
import { localDocumentStorage, getDocumentById } from "@/utils/documentOperations";

interface UseDocumentDetailsOptions {
  onSuccess?: (document: DocumentDetails) => void;
  onError?: (error: any) => void;
}

export const useDocumentDetails = (
  documentId: string, 
  options: UseDocumentDetailsOptions = {}
) => {
  const { toast } = useToast();

  const fetchDocumentDetails = async () => {
    try {
      console.log(`Fetching document details for ID: ${documentId}`);
      
      // Get document from local storage
      const document = await getDocumentById(documentId);
      
      if (!document) {
        console.error("Document not found:", documentId);
        if (options.onError) options.onError(new Error(`Document not found: ${documentId}`));
        return null;
      }
      
      // Process the document to match expected format
      const processedDocument = processDocumentData({
        ...document,
        // Add fields expected by the UI
        storage_path: document.id, // Use ID as storage path for local files
        updated_at: document.created_at,
        analysis: document.analysis ? [{ 
          id: `analysis-${document.id}`,
          content: document.analysis 
        }] : [],
        comments: [],
        tasks: [],
        versions: []
      });
      
      console.log("Processed document:", processedDocument);
      
      if (options.onSuccess) options.onSuccess(processedDocument);
      return processedDocument;
      
    } catch (error: any) {
      console.error('Error fetching document details:', error);
      if (options.onError) options.onError(error);
      return null;
    }
  };

  return { fetchDocumentDetails };
};

/**
 * Processes raw document data from local storage, enhancing and formatting analysis content
 */
const processDocumentData = (document: any): DocumentDetails => {
  // Process the analysis content
  let processedAnalysis = null;
  if (document?.analysis?.[0]?.content) {
    try {
      let analysisContent = document.analysis[0].content;
      
      // Handle both string and object content
      if (typeof analysisContent === 'string') {
        try {
          analysisContent = JSON.parse(analysisContent);
        } catch (parseError) {
          console.error("Error parsing analysis content:", parseError);
          // Keep as string if parsing fails
        }
      }

      // Ensure extracted info has all required fields with better defaults and formatting
      const extractedInfo = {
        // Client Information
        clientName: analysisContent.extracted_info?.clientName || '',
        clientAddress: analysisContent.extracted_info?.clientAddress || '',
        clientPhone: analysisContent.extracted_info?.clientPhone || '',
        clientId: analysisContent.extracted_info?.clientId || analysisContent.extracted_info?.caseNumber || '',
        clientEmail: analysisContent.extracted_info?.clientEmail || '',
        
        // Document Details
        formNumber: analysisContent.extracted_info?.formNumber || 
                   document.title.match(/Form\s+(\d+)/)?.[1] || 
                   document.title.match(/F(\d+)/)?.[1] || 
                   (document.title.toLowerCase().includes('consumer proposal') ? '47' : ''),
        formType: analysisContent.extracted_info?.type || 
                 analysisContent.extracted_info?.formType || 
                 (document.title.toLowerCase().includes('bankruptcy') ? 'bankruptcy' : 
                  document.title.toLowerCase().includes('proposal') ? 'form-47' : ''),
        dateSigned: analysisContent.extracted_info?.dateSigned || 
                   analysisContent.extracted_info?.dateOfFiling || '',
        filingDate: analysisContent.extracted_info?.filingDate || '',
        submissionDeadline: analysisContent.extracted_info?.submissionDeadline || '',
        documentStatus: analysisContent.extracted_info?.documentStatus || '',
                   
        // Trustee Information
        trusteeName: analysisContent.extracted_info?.trusteeName || 
                    analysisContent.extracted_info?.insolvencyTrustee || '',
        administratorName: analysisContent.extracted_info?.administratorName || '',
        trusteeAddress: analysisContent.extracted_info?.trusteeAddress || '',
        trusteePhone: analysisContent.extracted_info?.trusteePhone || '',
        trusteeEmail: analysisContent.extracted_info?.trusteeEmail || '',
        
        // Case Information
        estateNumber: analysisContent.extracted_info?.estateNumber || '',
        district: analysisContent.extracted_info?.district || '',
        divisionNumber: analysisContent.extracted_info?.divisionNumber || '',
        courtNumber: analysisContent.extracted_info?.courtNumber || '',
        
        // Additional Details
        meetingOfCreditors: analysisContent.extracted_info?.meetingOfCreditors || '',
        chairInfo: analysisContent.extracted_info?.chairInfo || '',
        securityInfo: analysisContent.extracted_info?.securityInfo || '',
        dateBankruptcy: analysisContent.extracted_info?.dateBankruptcy || 
                       analysisContent.extracted_info?.dateOfBankruptcy || '',
        officialReceiver: analysisContent.extracted_info?.officialReceiver || '',
        
        // Financial Information
        totalDebts: analysisContent.extracted_info?.totalDebts || '',
        totalAssets: analysisContent.extracted_info?.totalAssets || '',
        monthlyIncome: analysisContent.extracted_info?.monthlyIncome || '',
        paymentSchedule: analysisContent.extracted_info?.paymentSchedule || '',
        
        // Document Summary
        summary: analysisContent.extracted_info?.summary || '',
      };

      // Ensure risks are properly formatted and enhanced
      const risks = (analysisContent.risks || []).map((risk: any) => ({
        type: risk.type || 'Unknown Risk',
        description: risk.description || '',
        severity: risk.severity || 'medium',
        regulation: risk.regulation || '',
        impact: risk.impact || '',
        requiredAction: risk.requiredAction || '',
        solution: risk.solution || '',
        deadline: risk.deadline || '7 days',
      }));

      // Add defaults for Form 47 documents when no risks are present
      if (risks.length === 0 && 
         (document.title?.toLowerCase().includes('form 47') || 
          document.title?.toLowerCase().includes('consumer proposal'))) {
        risks.push({
          type: 'Missing Information',
          description: 'The consumer proposal form may be missing required information.',
          severity: 'medium',
          regulation: 'Consumer Proposal Guidelines',
          impact: 'Potential delay in processing',
          requiredAction: 'Review document for completeness',
          solution: 'Ensure all required fields are completed',
          deadline: '7 days'
        });
      }

      processedAnalysis = [{
        content: {
          extracted_info: extractedInfo,
          risks: risks,
          regulatory_compliance: analysisContent.regulatory_compliance || {
            status: 'pending',
            details: 'Regulatory compliance check pending',
            references: []
          }
        }
      }];
    } catch (e) {
      console.error('Error processing analysis content:', e);
    }
  } else if (document.title?.toLowerCase().includes('form 47') || 
             document.title?.toLowerCase().includes('consumer proposal')) {
    // Generate placeholder analysis for Form 47 documents without analysis
    console.log("Creating placeholder analysis for Form 47 document");
    
    processedAnalysis = [{
      content: {
        extracted_info: {
          clientName: '',
          formNumber: '47',
          formType: 'form-47',
          documentStatus: 'pending',
          summary: 'Consumer Proposal document under review'
        },
        risks: [{
          type: 'Document Processing',
          description: 'This Form 47 document is waiting for analysis completion.',
          severity: 'low',
          regulation: 'Consumer Proposal Guidelines',
          impact: 'Normal processing timeline',
          requiredAction: 'Wait for complete analysis',
          solution: 'Analysis will be available soon',
          deadline: '3 days'
        }],
        regulatory_compliance: {
          status: 'pending',
          details: 'Regulatory compliance check pending',
          references: []
        }
      }
    }];
  }

  // Set the document with processed analysis
  return {
    ...document,
    analysis: processedAnalysis
  };
};
