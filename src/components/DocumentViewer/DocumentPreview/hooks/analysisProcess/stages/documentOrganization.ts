
import { DocumentRecord } from "../../types";
import { updateAnalysisStatus } from "../documentStatusUpdates";
import { AnalysisProcessContext } from "../types";

export const documentOrganization = async (
  documentRecord: DocumentRecord,
  context: AnalysisProcessContext
): Promise<void> => {
  const { setAnalysisStep, setProgress } = context;
  
  setAnalysisStep("Stage 6: Document Organization & Client Management...");
  setProgress(85);
  
  // Update document with task creation status
  await updateAnalysisStatus(documentRecord, 'document_organization', 'tasks_created');
};
