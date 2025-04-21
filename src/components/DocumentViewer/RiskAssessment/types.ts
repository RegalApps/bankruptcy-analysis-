
import { Risk as DocumentRisk } from "../types";

// Export Risk type explicitly with correct syntax for isolatedModules
export type Risk = DocumentRisk;

export interface Form47Risk extends DocumentRisk {
  requiredAction?: string;
  deadline?: string;
}

export interface RiskAssessmentProps {
  risks: DocumentRisk[];
  documentId: string;
  isLoading?: boolean;
}
