
import { supabase } from "@/lib/supabase";
import { DocumentRecord } from "../../types";
import { AnalysisProcessContext } from "../types";

export const collaborationSetup = async (
  documentRecord: DocumentRecord,
  documentText: string,
  isForm76: boolean,
  context: AnalysisProcessContext
): Promise<any> => {
  const { setAnalysisStep, setProgress } = context;
  
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
  
  return data;
};
