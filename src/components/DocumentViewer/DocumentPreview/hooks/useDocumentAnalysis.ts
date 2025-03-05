
import { useState, useEffect } from "react";
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
      setAnalysisStep("Stage 1: Document Ingestion & Preprocessing...");
      setProgress(10);
      console.log('Fetching document record for path:', storagePath);
      const { data: documentRecord, error: fetchError } = await supabase
        .from('documents')
        .select('id, title, metadata, ai_processing_status')
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
      
      // Step 2: Update document status
      await supabase
        .from('documents')
        .update({
          ai_processing_status: 'processing',
          metadata: {
            ...documentRecord.metadata,
            processing_stage: 'document_ingestion',
            processing_steps_completed: [...(documentRecord.metadata?.processing_steps_completed || []), 'analysis_started']
          }
        })
        .eq('id', documentRecord.id);
      
      // Step 3: Document Classification & Understanding
      setAnalysisStep("Stage 2: Document Classification & Understanding...");
      setProgress(25);
      
      const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;
      console.log('Extracting text from PDF at URL:', publicUrl);
      const documentText = await extractTextFromPdf(publicUrl);
      
      if (!documentText || documentText.trim().length < 50) {
        console.error('Insufficient text extracted from document. Length:', documentText?.length || 0);
        throw new Error('Could not extract sufficient text from the document');
      }
      
      console.log(`Extracted ${documentText.length} characters of text from PDF`);
      
      // Update document with OCR status
      await supabase
        .from('documents')
        .update({
          metadata: {
            ...documentRecord.metadata,
            processing_stage: 'document_classification',
            processing_steps_completed: [...(documentRecord.metadata?.processing_steps_completed || []), 'ocr_completed']
          }
        })
        .eq('id', documentRecord.id);
      
      // Step 4: Data Extraction & Content Processing
      setAnalysisStep("Stage 3: Data Extraction & Content Processing...");
      setProgress(40);
      
      // Check if the document is a Form 76 from metadata or content
      const metadata = documentRecord.metadata || {};
      const isForm76 = 
        metadata.formType === 'form-76' ||
        documentRecord.title.toLowerCase().includes('form 76') || 
        documentRecord.title.toLowerCase().includes('f76') ||
        documentText.toLowerCase().includes('form 76') ||
        documentText.toLowerCase().includes('f76') ||
        documentText.toLowerCase().includes('statement of affairs') ||
        documentText.toLowerCase().includes('monthly income');
                      
      console.log('Is document Form 76:', isForm76);
      
      // Update document with classification results
      await supabase
        .from('documents')
        .update({
          metadata: {
            ...documentRecord.metadata,
            formType: isForm76 ? 'form-76' : 'unknown',
            processing_stage: 'data_extraction',
            processing_steps_completed: [...(documentRecord.metadata?.processing_steps_completed || []), 'classification_completed']
          }
        })
        .eq('id', documentRecord.id);
      
      // Step 5: Risk & Compliance Assessment
      setAnalysisStep(isForm76 
        ? "Stage 4: Performing regulatory compliance analysis for Form 76..." 
        : "Stage 4: Risk & Compliance Assessment...");
      setProgress(55);
      
      // Update document with extraction status
      await supabase
        .from('documents')
        .update({
          metadata: {
            ...documentRecord.metadata,
            processing_stage: 'risk_assessment',
            processing_steps_completed: [...(documentRecord.metadata?.processing_steps_completed || []), 'extraction_completed']
          }
        })
        .eq('id', documentRecord.id);
      
      // Step 6: Issue Prioritization & Task Management
      setAnalysisStep(isForm76
        ? "Stage 5: Generating mitigation strategies for Form 76..."
        : "Stage 5: Issue Prioritization & Task Management...");
      setProgress(70);
      
      // Update document with risk assessment status
      await supabase
        .from('documents')
        .update({
          metadata: {
            ...documentRecord.metadata,
            processing_stage: 'issue_prioritization',
            processing_steps_completed: [...(documentRecord.metadata?.processing_steps_completed || []), 'risk_assessment_completed']
          }
        })
        .eq('id', documentRecord.id);
      
      // Step 7: Document Organization & Client Management
      setAnalysisStep("Stage 6: Document Organization & Client Management...");
      setProgress(85);
      
      // Update document with task creation status
      await supabase
        .from('documents')
        .update({
          metadata: {
            ...documentRecord.metadata,
            processing_stage: 'document_organization',
            processing_steps_completed: [...(documentRecord.metadata?.processing_steps_completed || []), 'tasks_created']
          }
        })
        .eq('id', documentRecord.id);
      
      // Step 8: User Notification & Collaboration 
      setAnalysisStep("Stage 7: Setting up collaboration workflow...");
      setProgress(95);
      
      // Submit for final analysis
      console.log('Submitting to analyze-document function with document ID:', documentRecord.id);
      
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentId: documentRecord.id,
          documentText: documentText,
          includeRegulatory: true,
          includeClientExtraction: true,
          title: documentRecord.title,
          extractionMode: 'comprehensive',
          formType: isForm76 ? 'form-76' : 'unknown',
          version: '2.0',
          enableOCR: true
        }
      });

      if (error) {
        console.error('Analysis function error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
      }

      // Final update - processing complete
      await supabase
        .from('documents')
        .update({
          ai_processing_status: 'completed',
          metadata: {
            ...documentRecord.metadata,
            processing_stage: 'completed',
            processing_steps_completed: [...(documentRecord.metadata?.processing_steps_completed || []), 'analysis_completed'],
            completion_date: new Date().toISOString()
          }
        })
        .eq('id', documentRecord.id);

      setAnalysisStep("Stage 8: Continuous AI Learning & Improvement...");
      setProgress(100);
      console.log('Analysis completed successfully. Results:', data);

      toast({
        title: "Analysis Complete",
        description: isForm76 ? 
          "Form 76 has been fully analyzed with client details extraction" : 
          "Document has been analyzed with content extraction"
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

  // When mounted, check if analysis is needed but not yet started
  useEffect(() => {
    if (session && storagePath && !analyzing) {
      // Check current document status
      const checkDocumentStatus = async () => {
        try {
          const { data: document } = await supabase
            .from('documents')
            .select('ai_processing_status, metadata')
            .eq('storage_path', storagePath)
            .maybeSingle();
            
          if (document && 
             (document.ai_processing_status === 'pending' || 
              document.ai_processing_status === 'failed' ||
              document.metadata?.processing_steps_completed?.length < 8)) {
            // If pending or failed, restart analysis
            console.log('Document needs analysis, current status:', document.ai_processing_status);
            handleAnalyzeDocument(session);
          }
        } catch (err) {
          console.error('Error checking document status:', err);
        }
      };
      
      checkDocumentStatus();
    }
  }, [session, storagePath, analyzing]);

  return {
    analyzing,
    error,
    analysisStep,
    progress,
    setSession,
    handleAnalyzeDocument
  };
};
