
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Document } from "@/components/DocumentList/types";
import { ValidationResult, RiskItem } from "../types";

export function useDocumentValidation(
  document: Document | null,
  onValidationComplete: (isValid: boolean) => void
) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validations, setValidations] = useState<ValidationResult[]>([]);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'failed' | 'passed'>('pending');

  useEffect(() => {
    if (document) {
      performDocumentAnalysis();
    }
  }, [document]);

  const performDocumentAnalysis = async () => {
    if (!document) return;

    setIsAnalyzing(true);
    try {
      // Call the Supabase Edge Function for document analysis
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          documentId: document.id,
          includeRegulatory: true
        }
      });

      if (error) throw error;

      // Process validation results
      const processedValidations: ValidationResult[] = [
        {
          id: 'structure',
          title: 'Document Structure',
          status: data.structureValid ? 'success' : 'error',
          description: data.structureValid 
            ? 'Document structure is valid and follows required format'
            : 'Document structure does not meet requirements'
        },
        {
          id: 'fields',
          title: 'Required Fields',
          status: data.requiredFieldsPresent ? 'success' : 'error',
          description: data.requiredFieldsPresent
            ? 'All required fields are present and properly formatted'
            : 'Missing or improperly formatted required fields'
        },
        {
          id: 'signatures',
          title: 'Signatures',
          status: data.signaturesValid ? 'success' : 'error',
          description: data.signaturesValid
            ? 'All required signatures are present and valid'
            : 'Missing or invalid signatures detected'
        }
      ];

      setValidations(processedValidations);
      setRisks(data.risks || []);
      
      // Determine overall status
      const hasErrors = processedValidations.some(v => v.status === 'error');
      const hasHighRisks = data.risks?.some((r: RiskItem) => r.severity === 'high');
      
      setOverallStatus(hasErrors || hasHighRisks ? 'failed' : 'passed');
      onValidationComplete(!hasErrors && !hasHighRisks);

      if (hasErrors || hasHighRisks) {
        toast.error("Document validation failed. Please review the issues.");
      } else {
        toast.success("Document validation successful!");
      }

    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze document");
      setOverallStatus('failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    validations,
    risks,
    overallStatus,
    performDocumentAnalysis
  };
}
