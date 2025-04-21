
import { Risk } from "../types";

export interface RiskAssessmentProps {
  risks: Risk[];
  documentId: string;
  isLoading?: boolean;
}
