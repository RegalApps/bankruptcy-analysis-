
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DocumentDetails } from "./types";

export const useDocumentViewer = (documentId: string) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocumentDetails = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching document details for ID:', documentId);
      
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
        setLoading(false);
        return;
      }
      
      console.log("Raw document data:", document);

      // Process the analysis content
      let processedAnalysis = null;
      if (document?.analysis?.[0]?.content) {
        try {
          let analysisContent = document.analysis[0].content;
          
          // Handle both string and object content
          if (typeof analysisContent === 'string') {
            try {
              analysisContent = JSON.parse(analysisContent);
              console.log("Successfully parsed analysis content from string");
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
            
            // Form 31 (Proof of Claim) specific fields
            creditorName: analysisContent.extracted_info?.creditorName || 
                         analysisContent.extracted_info?.claimantName || '',
            claimantName: analysisContent.extracted_info?.claimantName || 
                         analysisContent.extracted_info?.creditorName || '',
            claimAmount: analysisContent.extracted_info?.claimAmount || '',
            claimType: analysisContent.extracted_info?.claimType || 
                      analysisContent.extracted_info?.claimClassification || '',
            claimClassification: analysisContent.extracted_info?.claimClassification || 
                                analysisContent.extracted_info?.claimType || '',
            securityDetails: analysisContent.extracted_info?.securityDetails || '',
            creditorAddress: analysisContent.extracted_info?.creditorAddress || '',
            creditorRepresentative: analysisContent.extracted_info?.creditorRepresentative || '',
            creditorContactInfo: analysisContent.extracted_info?.creditorContactInfo || '',
            
            // Document Details
            formNumber: analysisContent.extracted_info?.formNumber || 
                       document.title.match(/Form\s+(\d+)/)?.[1] || 
                       document.title.match(/F(\d+)/)?.[1] || '',
            formType: analysisContent.extracted_info?.type || 
                     analysisContent.extracted_info?.formType || 
                     (document.title.toLowerCase().includes('bankruptcy') ? 'bankruptcy' : 
                      document.title.toLowerCase().includes('proposal') ? 'proposal' : '') || '',
            dateSigned: analysisContent.extracted_info?.dateSigned || 
                       analysisContent.extracted_info?.dateOfFiling || '',
            
            // Trustee Information
            trusteeName: analysisContent.extracted_info?.trusteeName || 
                        analysisContent.extracted_info?.insolvencyTrustee || '',
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
            documentStatus: analysisContent.extracted_info?.documentStatus || '',
            filingDate: analysisContent.extracted_info?.filingDate || '',
            submissionDeadline: analysisContent.extracted_info?.submissionDeadline || '',
            
            // Form 47 specific fields
            proposalType: analysisContent.extracted_info?.proposalType || '',
            monthlyPayment: analysisContent.extracted_info?.monthlyPayment || '',
            proposalDuration: analysisContent.extracted_info?.proposalDuration || '',
            paymentSchedule: analysisContent.extracted_info?.paymentSchedule || '',
            
            // Financial Information
            totalDebts: analysisContent.extracted_info?.totalDebts || '',
            totalAssets: analysisContent.extracted_info?.totalAssets || '',
            monthlyIncome: analysisContent.extracted_info?.monthlyIncome || '',
            
            // Document Summary
            summary: analysisContent.extracted_info?.summary || '',
            
            // Original text for form type detection
            fullText: analysisContent.extracted_info?.fullText || '',
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
          toast({
            variant: "default", // Changed from "warning" to "default"
            title: "Warning",
            description: "Could not process document analysis"
          });
        }
      }

      // Set the document with processed analysis
      const processedDocument = {
        ...document,
        analysis: processedAnalysis
      };
      
      console.log('Final processed document:', processedDocument);

      setDocument(processedDocument);
    } catch (error: any) {
      console.error('Error fetching document details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document details"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentDetails();

    const channelName = `document_updates_${documentId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analysis',
          filter: `document_id=eq.${documentId}`
        },
        async (payload) => {
          console.log("Analysis update detected:", payload);
          await fetchDocumentDetails();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_comments',
          filter: `document_id=eq.${documentId}`
        },
        async (payload) => {
          console.log("Comment update detected:", payload);
          await fetchDocumentDetails();
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${channelName}:`, status);
      });

    return () => {
      console.log("Cleaning up real-time subscription for channel:", channelName);
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  return {
    document,
    loading,
    fetchDocumentDetails
  };
};
