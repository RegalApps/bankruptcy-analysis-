
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentDetails } from "./types";
import { fetchDocument, subscribeToDocumentUpdates } from "./services/documentService";
import { processAnalysisContent } from "./utils/documentProcessingUtils";

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

    // Set up real-time subscription and get cleanup function
    const unsubscribe = subscribeToDocumentUpdates(documentId, fetchDocumentDetails);

    // Clean up subscription when component unmounts
    return unsubscribe;
  }, [documentId]);

  return {
    document,
    loading,
    fetchDocumentDetails
  };
};
