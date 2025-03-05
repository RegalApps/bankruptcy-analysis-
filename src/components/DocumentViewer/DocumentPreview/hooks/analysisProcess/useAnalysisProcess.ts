
import { supabase } from "@/lib/supabase";
import { extractTextFromPdf } from "@/utils/documents/pdfUtils";
import { DocumentRecord } from "../types";
import { updateAnalysisStatus } from "./documentStatusUpdates";
import { isForm76 as checkIsForm76 } from "./formIdentification";

export interface AnalysisProcessProps {
  setAnalysisStep: (step: string) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  toast: any;
  onAnalysisComplete?: () => void;
}

export const useAnalysisProcess = ({
  setAnalysisStep,
  setProgress,
  setError,
  toast,
  onAnalysisComplete
}: AnalysisProcessProps) => {
  
  const executeAnalysisProcess = async (storagePath: string, session: any) => {
    try {
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
      
      // Step 2: Update document status to processing
      await updateAnalysisStatus(documentRecord, 'document_ingestion', 'analysis_started');
      
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
      await updateAnalysisStatus(documentRecord, 'document_classification', 'ocr_completed');
      
      // Step 4: Data Extraction & Content Processing
      setAnalysisStep("Stage 3: Data Extraction & Content Processing...");
      setProgress(40);
      
      // Check if the document is a Form 76
      const isForm76 = checkIsForm76(documentRecord, documentText);
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
      await updateAnalysisStatus(documentRecord, 'risk_assessment', 'extraction_completed');
      
      // Step 6: Issue Prioritization & Task Management
      setAnalysisStep(isForm76
        ? "Stage 5: Generating mitigation strategies for Form 76..."
        : "Stage 5: Issue Prioritization & Task Management...");
      setProgress(70);
      
      // Update document with risk assessment status
      await updateAnalysisStatus(documentRecord, 'issue_prioritization', 'risk_assessment_completed');
      
      // Step 7: Document Organization & Client Management
      setAnalysisStep("Stage 6: Document Organization & Client Management...");
      setProgress(85);
      
      // Update document with task creation status
      await updateAnalysisStatus(documentRecord, 'document_organization', 'tasks_created');
      
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
    } catch (error) {
      throw error;
    }
  };
  
  return { executeAnalysisProcess };
};
