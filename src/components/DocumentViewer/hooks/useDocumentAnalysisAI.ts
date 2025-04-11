
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { toast as sonner } from "sonner";

export const useDocumentAnalysisAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeDocument = async (documentId: string, documentText?: string, documentType?: string) => {
    if (!documentId) {
      setError("Document ID is required");
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Document ID is required"
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      sonner.info("Document analysis started", {
        description: "This may take a few moments"
      });
      
      console.log(`Calling analyze-document-openai function for document ${documentId}`);
      
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-document-openai', {
        body: {
          documentId,
          documentText,
          documentType: documentType || "generic"
        }
      });

      if (invokeError) {
        console.error("Error invoking function:", invokeError);
        throw new Error(invokeError.message || "Failed to analyze document");
      }
      
      console.log("Analysis result:", data);
      
      if (data?.analysis) {
        setResult(data.analysis);
        
        toast({
          title: "Analysis Complete",
          description: "Document has been successfully analyzed"
        });
        
        // Fetch the updated document analysis to ensure we have the latest data
        const { data: analysisData } = await supabase
          .from('document_analysis')
          .select('content')
          .eq('document_id', documentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (analysisData) {
          console.log("Updated analysis data from database:", analysisData);
          setResult(analysisData.content);
        }
      } else {
        setResult(null);
        throw new Error("No analysis data returned");
      }
      
    } catch (err: any) {
      console.error("Document analysis failed:", err);
      setError(err.message || "An unknown error occurred");
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: err.message || "Failed to analyze document"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeDocument,
    isAnalyzing,
    result,
    error
  };
};
