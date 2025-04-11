
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Risk, DocumentDetails } from "../types";

export const useDocumentAnalysisAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeDocument = async (documentId: string, documentText?: string) => {
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
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-document-openai', {
        body: {
          documentId,
          documentText,
          documentType: "form31" // You can make this dynamic based on document metadata
        }
      });

      if (invokeError) throw new Error(invokeError.message);
      
      if (data?.analysis) {
        setResult(data.analysis);
        
        toast({
          title: "Analysis Complete",
          description: "Document has been successfully analyzed"
        });
        
        // Fetch the updated document analysis
        const { data: analysisData } = await supabase
          .from('document_analysis')
          .select('content')
          .eq('document_id', documentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (analysisData) {
          setResult(analysisData.content);
        }
      }
    } catch (err: any) {
      console.error("Document analysis failed:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: err.message
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
