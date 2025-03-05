
import { DocumentRecord } from "../../types";
import { updateAnalysisStatus } from "../documentStatusUpdates";
import { AnalysisProcessContext } from "../types";

export const riskAssessment = async (
  documentRecord: DocumentRecord,
  isForm76: boolean,
  context: AnalysisProcessContext
): Promise<void> => {
  const { setAnalysisStep, setProgress } = context;
  
  setAnalysisStep(isForm76 
    ? "Stage 4: Performing regulatory compliance analysis for Form 76..." 
    : "Stage 4: Risk & Compliance Assessment...");
  setProgress(55);
  
  // Update document with extraction status
  await updateAnalysisStatus(documentRecord, 'risk_assessment', 'extraction_completed');
};
