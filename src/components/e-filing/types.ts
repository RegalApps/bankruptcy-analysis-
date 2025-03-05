
import { Document } from "@/components/DocumentList/types";

export interface RiskAssessmentProps {
  document: Document | null;
  onValidationComplete: (isValid: boolean) => void;
}

export interface ValidationResult {
  id: string;
  title: string;
  status: 'success' | 'warning' | 'error';
  description: string;
}

export interface RiskItem {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
}
