
import { supabase } from "@/lib/supabase";
import { AnalysisProcessProps } from "./types";
import { Session } from "@supabase/supabase-js";
import { stages } from "../../DocumentPreview/hooks/analysisProcess/stages";

export const useAnalysisProcess = (props: AnalysisProcessProps) => {
  const { setAnalysisStep, setProgress, setError, setProcessingStage, toast, onAnalysisComplete } = props;

  const executeAnalysisProcess = async (storagePath: string, session: Session) => {
    try {
      if (!session) {
        throw new Error('Authentication required: You must be logged in to analyze documents');
      }

      // Check if the file exists and get document ID
      const { data: documents, error: documentsError } = await supabase
        .from('documents')
        .select('id, title, metadata')
        .eq('storage_path', storagePath)
        .limit(1);

      if (documentsError) {
        console.error('Error fetching document:', documentsError);
        setError(`Error fetching document: ${documentsError.message}`);
        return;
      }

      if (!documents || documents.length === 0) {
        setError('Document not found in the database');
        return;
      }

      const documentId = documents[0].id;
      const documentTitle = documents[0].title;
      const documentMetadata = documents[0].metadata || {};

      // Begin the analysis process
      setAnalysisStep('Initializing document analysis');
      setProgress(5);
      setProcessingStage('Preparing document for processing');

      // Download document content for analysis
      setAnalysisStep('Downloading document content');
      setProgress(15);
      
      // Make sure we're using a fresh token for the storage download
      const { data: refreshedSession, error: refreshError } = await supabase.auth.getSession();
      if (refreshError) {
        console.error('Failed to refresh session for document download:', refreshError);
        throw new Error('Authentication error: Failed to refresh your session');
      }
      
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(storagePath);

      if (downloadError) {
        console.error('Error downloading document:', downloadError);
        setError(`Error downloading document: ${downloadError.message}`);
        return;
      }

      // Convert file to text
      setAnalysisStep('Extracting text content');
      setProgress(25);
      setProcessingStage('Converting document to processable format');
      
      let textContent: string;
      try {
        textContent = await fileData.text();
      } catch (error: any) {
        console.error('Error converting file to text:', error);
        setError(`Error converting file to text: ${error.message}`);
        return;
      }

      // Execute classification stage
      setAnalysisStep(stages.documentClassification.description);
      setProgress(35);
      setProcessingStage(stages.documentClassification.detailedDescription);
      
      // Log authentication info for debugging
      console.log("Using authenticated session for API call");
      
      // Process document with AI
      setAnalysisStep('Processing with AI assistant');
      setProgress(50);
      setProcessingStage('Analyzing document content with AI');

      try {
        // Ensure we have a valid session before making the API call
        const { data: latestSession, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !latestSession.session) {
          console.error("Session validation error:", sessionError);
          throw new Error("Authentication error: Invalid or expired session");
        }

        // Make API request with fresh session token
        const result = await supabase.functions.invoke('process-ai-request', {
          body: {
            message: textContent.substring(0, 100000), // Limit text size to avoid payload issues
            documentId,
            module: "document-analysis",
            title: documentTitle,
            formType: documentMetadata.formType
          }
        });

        if (result.error) {
          console.error("Edge function error:", result.error);
          throw new Error(`AI processing error: ${result.error.message || JSON.stringify(result.error)}`);
        }
        
        console.log("AI processing response:", result.data);
      } catch (error: any) {
        console.error('AI processing error:', error);
        setError(`AI processing error: ${error.message}`);
        return;
      }

      // Execute remaining stages
      setAnalysisStep(stages.dataExtraction.description);
      setProgress(65);
      setProcessingStage(stages.dataExtraction.detailedDescription);

      // Brief delay to show progress
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAnalysisStep(stages.riskAssessment.description);
      setProgress(75);
      setProcessingStage(stages.riskAssessment.detailedDescription);

      // Brief delay to show progress
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAnalysisStep(stages.documentOrganization.description);
      setProgress(90);
      setProcessingStage(stages.documentOrganization.detailedDescription);

      // Analysis complete
      setAnalysisStep('Analysis complete');
      setProgress(100);
      setProcessingStage('Document successfully analyzed');
      
      console.log("Document analysis completed successfully");

      // Update document status to complete in database
      await supabase
        .from('documents')
        .update({
          ai_processing_status: 'complete',
          metadata: {
            ...documentMetadata,
            analyzed_at: new Date().toISOString(),
            analysis_version: '1.0',
            processing_steps_completed: [
              "documentIngestion",
              "documentClassification",
              "dataExtraction",
              "riskAssessment",
              "documentOrganization",
              "analysisComplete"
            ]
          }
        })
        .eq('id', documentId);

      // Call onComplete callback if provided
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error: any) {
      console.error('Analysis process error:', error);
      setError(`Analysis process error: ${error.message}`);
      
      // Try to update document status to failed
      try {
        if (storagePath) {
          const { data } = await supabase
            .from('documents')
            .select('id, metadata')
            .eq('storage_path', storagePath)
            .maybeSingle();
            
          if (data?.id) {
            await supabase
              .from('documents')
              .update({
                ai_processing_status: 'failed',
                metadata: {
                  ...(data.metadata || {}),
                  analysis_error: error.message,
                  analysis_failed_at: new Date().toISOString()
                }
              })
              .eq('id', data.id);
          }
        }
      } catch (updateErr) {
        console.error('Failed to update document failure status:', updateErr);
      }
    }
  };

  return {
    executeAnalysisProcess
  };
};
