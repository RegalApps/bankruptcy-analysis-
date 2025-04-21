
import { Risk } from "../types";

export { Risk };

export interface Form47Risk extends Risk {
  requiredAction?: string;
  deadline?: string;
}

export interface RiskAssessmentProps {
  risks: Risk[];
  documentId: string;
  isLoading?: boolean;
}
