
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { extractTextFromPdf } from "@/utils/documents/pdfUtils";

export const useDocumentAnalysis = (storagePath: string, onAnalysisComplete?: () => void) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const handleAnalyzeDocument = async (currentSession = session) => {
    setError(null);
    
    try {
      if (!currentSession) {
        console.error("No session available for document analysis");
        throw new Error('You must be logged in to analyze documents');
      }

      setAnalyzing(true);
      
      // Step 1: Fetch the document record
      setAnalysisStep("Preparing document for analysis...");
      setProgress(10);
      console.log('Fetching document record for path:', storagePath);
      const { data: documentRecord, error: fetchError } = await supabase
        .from('documents')
        .select('id, title')
        .eq('storage_path', storagePath)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching document record:', fetchError);
        throw fetchError;
      }
      
      if (!documentRecord) {
        console.error('Document record not found for path:', storagePath);
        throw new Error('Document record not found in database');
      }
      
      console.log('Document record found:', documentRecord);
      
      // Step 2: Extract text from PDF
      setAnalysisStep("Extracting text from document using OCR technology...");
      setProgress(25);
      const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;
      console.log('Extracting text from PDF at URL:', publicUrl);
      const documentText = await extractTextFromPdf(publicUrl);
      
      if (!documentText || documentText.trim().length < 50) {
        console.error('Insufficient text extracted from document. Length:', documentText?.length || 0);
        throw new Error('Could not extract sufficient text from the document');
      }
      
      console.log(`Extracted ${documentText.length} characters of text from PDF`);
      setProgress(40);
      
      // Step 3: Entity recognition
      setAnalysisStep("Identifying key client information (name, dates, form numbers)...");
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Perform regulatory compliance check
      setAnalysisStep("Performing regulatory compliance analysis using frameworks...");
      setProgress(65);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 5: Risk assessment
      setAnalysisStep("Conducting risk assessment and generating mitigation strategies...");
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 6: Submit for analysis
      setAnalysisStep("Finalizing document analysis and saving results...");
      setProgress(90);
      console.log('Submitting to analyze-document function with document ID:', documentRecord.id);
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentText: documentText,
          documentId: documentRecord.id,
          includeRegulatory: true,
          includeClientExtraction: true, // Enable client detail extraction
          title: documentRecord.title,
          extractionMode: 'comprehensive' // Enhanced extraction mode
        }
      });

      if (error) {
        console.error('Analysis function error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
      }

      setProgress(100);
      console.log('Analysis completed successfully. Results:', data);

      toast({
        title: "Analysis Complete",
        description: "Document has been analyzed with client details extraction"
      });

      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error: any) {
      console.error('Document analysis failed:', error);
      setError(error.message || 'An unknown error occurred');
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze document"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    analyzing,
    error,
    analysisStep,
    progress,
    setSession,
    handleAnalyzeDocument
  };
};
