
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentDetails } from "./types";
import { fetchDocument, subscribeToDocumentUpdates, triggerAnalysisForDocument } from "./services/documentService";
import { processAnalysisContent, detectFormNumber, detectFormType } from "./utils/documentProcessingUtils";

export const useDocumentViewer = (documentId: string) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocumentDetails = async () => {
    try {
      const documentData = await fetchDocument(documentId);
      
      if (!documentData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Document not found"
        });
        setLoading(false);
        return;
      }
      
      console.log("Raw document data:", documentData);

      // Process the document data with our utility
      const processedDocument = processAnalysisContent(documentData);
      
      console.log('Final processed document:', processedDocument);

      setDocument(processedDocument);
      
      // If analysis is missing or processing is still pending, trigger analysis
      if (!documentData.analysis?.length || 
          documentData.ai_processing_status === 'pending' ||
          documentData.ai_processing_status === 'processing') {
        console.log("Document needs analysis, triggering it now");
        const formNumber = detectFormNumber(documentData);
        const formType = detectFormType(documentData);
        
        try {
          await triggerAnalysisForDocument(documentId, formNumber, formType);
          toast({
            title: "Analysis Started",
            description: "Document analysis has been initiated"
          });
        } catch (analyzeError) {
          console.error("Failed to trigger analysis:", analyzeError);
        }
      }
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
  
  // Function to manually re-analyze the document
  const reanalyzeDocument = async () => {
    if (!document) return;
    
    try {
      setLoading(true);
      toast({
        title: "Reanalyzing Document",
        description: "Starting fresh analysis of your document"
      });
      
      const formNumber = detectFormNumber(document);
      const formType = detectFormType(document);
      
      await triggerAnalysisForDocument(documentId, formNumber, formType);
      
      // Fetch updated document after analysis is triggered
      await fetchDocumentDetails();
      
      toast({
        title: "Analysis Complete",
        description: "Document has been reanalyzed successfully"
      });
    } catch (error: any) {
      console.error('Error reanalyzing document:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to reanalyze document"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentDetails();

    // Set up real-time subscription and get cleanup function
    const unsubscribe = subscribeToDocumentUpdates(documentId, fetchDocumentDetails);

    // Clean up subscription when component unmounts
    return unsubscribe;
  }, [documentId]);

  return {
    document,
    loading,
    fetchDocumentDetails,
    reanalyzeDocument
  };
};
