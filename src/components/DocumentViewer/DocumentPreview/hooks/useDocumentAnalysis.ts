
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
        .select('id, title, metadata')
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
      
      // Step 3: Entity recognition - detect if it's Form 76
      setAnalysisStep("Identifying document type and client details...");
      setProgress(50);
      
      // Check if the document is a Form 76 from metadata or content
      const metadata = documentRecord.metadata || {};
      const isForm76 = 
        metadata.formType === 'form-76' ||
        documentRecord.title.toLowerCase().includes('form 76') || 
        documentRecord.title.toLowerCase().includes('f76') ||
        documentText.toLowerCase().includes('form 76') ||
        documentText.toLowerCase().includes('f76');
                      
      console.log('Is document Form 76:', isForm76);
      
      // Step 4: Perform regulatory compliance check
      setAnalysisStep(isForm76 
        ? "Performing regulatory compliance analysis for Form 76..." 
        : "Analyzing document content and regulatory compliance...");
      setProgress(65);
      
      // Step 5: Risk assessment
      setAnalysisStep(isForm76
        ? "Conducting risk assessment for Form 76 and generating mitigation strategies..."
        : "Performing risk assessment and extracting key document information...");
      setProgress(80);
      
      // Step 6: Submit for analysis
      setAnalysisStep(isForm76
        ? "Finalizing Form 76 analysis and organizing document structure..."
        : "Finalizing document analysis and organization...");
      setProgress(90);
      console.log('Submitting to analyze-document function with document ID:', documentRecord.id);
      
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentId: documentRecord.id,
          documentText: documentText,
          includeRegulatory: true,
          includeClientExtraction: true,
          title: documentRecord.title,
          extractionMode: 'comprehensive',
          formType: isForm76 ? 'form-76' : 'unknown'
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
        description: isForm76 ? 
          "Form 76 has been analyzed with client details extraction" : 
          "Document has been analyzed with client details extraction"
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
