
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
            analysisContent = JSON.parse(analysisContent);
          }

          // Ensure extracted info has all required fields
          const extractedInfo = {
            // Client Information
            clientName: analysisContent.extracted_info?.clientName || '',
            clientAddress: analysisContent.extracted_info?.clientAddress || '',
            clientPhone: analysisContent.extracted_info?.clientPhone || '',
            clientId: analysisContent.extracted_info?.clientId || '',
            
            // Document Details
            formNumber: analysisContent.extracted_info?.formNumber || document.title.match(/Form\s+(\d+)/)?.[1] || '',
            formType: analysisContent.extracted_info?.type || document.type || '',
            dateSigned: analysisContent.extracted_info?.dateSigned || '',
            
            // Trustee Information
            trusteeName: analysisContent.extracted_info?.trusteeName || '',
            trusteeAddress: analysisContent.extracted_info?.trusteeAddress || '',
            trusteePhone: analysisContent.extracted_info?.trusteePhone || '',
            
            // Case Information
            estateNumber: analysisContent.extracted_info?.estateNumber || '',
            district: analysisContent.extracted_info?.district || '',
            divisionNumber: analysisContent.extracted_info?.divisionNumber || '',
            courtNumber: analysisContent.extracted_info?.courtNumber || '',
            
            // Additional Details
            meetingOfCreditors: analysisContent.extracted_info?.meetingOfCreditors || '',
            chairInfo: analysisContent.extracted_info?.chairInfo || '',
            securityInfo: analysisContent.extracted_info?.securityInfo || '',
            dateBankruptcy: analysisContent.extracted_info?.dateBankruptcy || '',
            officialReceiver: analysisContent.extracted_info?.officialReceiver || '',
            
            // Document Summary
            summary: analysisContent.extracted_info?.summary || '',
          };

          // Ensure risks are properly formatted
          const risks = (analysisContent.risks || []).map((risk: any) => ({
            type: risk.type || 'Unknown Risk',
            description: risk.description || '',
            severity: risk.severity || 'medium',
            regulation: risk.regulation || '',
            impact: risk.impact || '',
            requiredAction: risk.requiredAction || '',
            solution: risk.solution || '',
          }));

          console.log("Processed analysis content:", { extractedInfo, risks });

          processedAnalysis = [{
            content: {
              extracted_info: extractedInfo,
              risks: risks
            }
          }];
        } catch (e) {
          console.error('Error processing analysis content:', e);
          toast({
            variant: "destructive",
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
