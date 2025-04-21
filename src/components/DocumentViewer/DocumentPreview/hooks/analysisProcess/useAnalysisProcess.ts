
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";
import { AnalysisProcessProps } from "./types";

export const useAnalysisProcess = (props: AnalysisProcessProps) => {
  const { 
    setAnalysisStep, 
    setProgress, 
    setError, 
    setProcessingStage,
    toast,
    onAnalysisComplete
  } = props;

  /**
   * Execute document analysis process
   */
  const executeAnalysisProcess = async (storagePath: string, session: any) => {
    try {
      logger.info("Starting document analysis process");
      setAnalysisStep("Starting analysis...");
      setProgress(5);
      
      // Step 1: Get document information
      setProcessingStage("Retrieving document information");
      setAnalysisStep("Retrieving document information");
      setProgress(10);
      
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('id, title, metadata')
        .eq('storage_path', storagePath)
        .single();
      
      if (docError) {
        logger.error("Error fetching document:", docError);
        setError(`Failed to retrieve document: ${docError.message}`);
        return;
      }
      
      if (!document) {
        logger.error("Document not found for path:", storagePath);
        setError(`Document not found for path: ${storagePath}`);
        return;
      }
      
      logger.info(`Retrieved document: ${document.title} (ID: ${document.id})`);
      
      // Step 2: Download document from storage
      setProcessingStage("Downloading document");
      setAnalysisStep("Downloading document...");
      setProgress(20);
      
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(storagePath);
      
      if (downloadError) {
        logger.error("Error downloading document:", downloadError);
        setError(`Failed to download document: ${downloadError.message}`);
        return;
      }
      
      logger.info("Document downloaded successfully");
      
      // Step 3: Convert document to text
      setProcessingStage("Processing document content");
      setAnalysisStep("Processing document content...");
      setProgress(30);
      
      const text = await fileData.text();
      logger.info(`Document content extracted: ${text.length} characters`);
      
      // Step 4: Add document to the text processing queue
      setProcessingStage("Analyzing document");
      setAnalysisStep("Analyzing document content...");
      setProgress(50);
      
      console.log(`Sending document for analysis: ${document.id}`);
      console.log(`Document title: ${document.title}`);
      
      // Determine form type from document title (for better analysis prompt)
      const formType = detectFormTypeFromTitle(document.title);
      console.log(`Detected form type: ${formType}`);
      
      // Call AI analysis function with retry logic
      const maxRetries = 2;
      let attempts = 0;
      let analysisData = null;
      let finalError = null;
      
      while (attempts <= maxRetries) {
        try {
          setAnalysisStep(`Analyzing document (attempt ${attempts + 1})...`);
          
          const { data, error } = await supabase.functions.invoke('process-ai-request', {
            body: {
              message: text,
              documentId: document.id,
              module: "document-analysis",
              formType: formType, // Pass form type for better analysis
              title: document.title
            }
          });
          
          if (error) {
            console.error("Edge function error:", error);
            throw error;
          }
          
          console.log("OpenAI response:", data);
          
          // Check if we got a meaningful response from OpenAI
          if (!data || (!data.parsedData && !data.response)) {
            logger.warn("Analysis returned empty data");
            throw new Error("Analysis returned empty data. The OpenAI API key may not be configured correctly.");
          }
          
          analysisData = data;
          finalError = null;
          break; // Success, exit retry loop
          
        } catch (err) {
          attempts++;
          finalError = err;
          logger.error(`Analysis attempt ${attempts} failed:`, err);
          
          if (attempts <= maxRetries) {
            setAnalysisStep(`Retrying analysis (${attempts}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
          }
        }
      }
      
      // Handle final retry result
      if (finalError) {
        logger.error("All analysis attempts failed:", finalError);
        setError(`Document analysis failed after ${attempts} attempts: ${finalError.message}`);
        return;
      }
      
      logger.info("Document analysis completed successfully");
      logger.debug("Analysis data:", analysisData);
      
      // Step 5: Update document status
      setProcessingStage("Finalizing analysis");
      setAnalysisStep("Finalizing analysis...");
      setProgress(80);
      
      // Update document status to complete
      const { error: updateError } = await supabase
        .from('documents')
        .update({ 
          ai_processing_status: 'complete',
          metadata: {
            ...document.metadata,
            last_analyzed: new Date().toISOString(),
            formType: formType || document.metadata?.formType || null,
            content: text.substring(0, 1000) // Store first 1000 chars for context
          }
        })
        .eq('id', document.id);
        
      if (updateError) {
        logger.error("Error updating document status:", updateError);
        // Non-critical error, continue with analysis
      }
      
      setAnalysisStep("Analysis complete");
      setProgress(100);
      
      // On success, show toast and trigger callback
      toast({
        title: "Analysis Complete",
        description: "Document has been successfully analyzed"
      });
      
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
      
      logger.info("Document analysis process completed successfully");
      
    } catch (error: any) {
      logger.error("Document analysis process failed:", error);
      setError(`Analysis failed: ${error.message}`);
      setAnalysisStep("Analysis failed");
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze document"
      });
    }
  };

  /**
   * Helper function to detect form type from title
   */
  const detectFormTypeFromTitle = (title: string): string | null => {
    const lowerTitle = title.toLowerCase();
    
    // Detect Form 31
    if (lowerTitle.includes('form 31') || 
        lowerTitle.includes('form31') || 
        lowerTitle.includes('proof of claim')) {
      return 'form-31';
    }
    
    // Detect Form 47
    if (lowerTitle.includes('form 47') || 
        lowerTitle.includes('form47') || 
        lowerTitle.includes('consumer proposal')) {
      return 'form-47';
    }
    
    // Other form types can be added here
    
    return null;
  };

  return { executeAnalysisProcess };
};
