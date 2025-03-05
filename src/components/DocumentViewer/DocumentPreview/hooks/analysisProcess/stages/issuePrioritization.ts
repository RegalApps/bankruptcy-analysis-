
import { DocumentRecord } from "../../types";
import { updateAnalysisStatus } from "../documentStatusUpdates";
import { AnalysisProcessContext } from "../types";

export const issuePrioritization = async (
  documentRecord: DocumentRecord,
  isForm76: boolean,
  context: AnalysisProcessContext
): Promise<void> => {
  const { setAnalysisStep, setProgress } = context;
  
  setAnalysisStep(isForm76
    ? "Stage 5: Generating mitigation strategies for Form 76..."
    : "Stage 5: Issue Prioritization & Task Management...");
  setProgress(70);
  
  // Update document with risk assessment status
  await updateAnalysisStatus(documentRecord, 'issue_prioritization', 'risk_assessment_completed');
};
