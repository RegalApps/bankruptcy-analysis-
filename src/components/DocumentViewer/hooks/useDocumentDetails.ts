
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DocumentDetails } from "../types";

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
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select(`
          *,
          analysis:document_analysis(content),
          comments:document_comments(id, content, created_at, user_id)
        `)
        .eq('id', documentId)
        .maybeSingle();

      if (docError) throw docError;
      if (!document) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Document not found"
        });
        if (options.onError) options.onError(new Error("Document not found"));
        return null;
      }
      
      console.log("Raw document data:", document);

      // Process the analysis content
      const processedDocument = processDocumentData(document);
      
      console.log('Final processed document:', processedDocument);

      if (options.onSuccess) options.onSuccess(processedDocument);
      return processedDocument;
    } catch (error: any) {
      console.error('Error fetching document details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document details"
      });
      if (options.onError) options.onError(error);
      return null;
    }
  };

  return { fetchDocumentDetails };
};

/**
 * Processes raw document data from Supabase, enhancing and formatting analysis content
 */
const processDocumentData = (document: any): DocumentDetails => {
  // Process the analysis content
  let processedAnalysis = null;
  if (document?.analysis?.[0]?.content) {
    try {
      let analysisContent = document.analysis[0].content;
      
      // Handle both string and object content
      if (typeof analysisContent === 'string') {
        analysisContent = JSON.parse(analysisContent);
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
                   document.title.match(/F(\d+)/)?.[1] || '',
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

      console.log("Processed analysis content:", { extractedInfo, risks });

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
  }

  // Set the document with processed analysis
  return {
    ...document,
    analysis: processedAnalysis
  };
};
