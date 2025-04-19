
import { useState, useEffect } from 'react';
import { mapFormFields, validateForm } from '@/utils/formFieldMapping';
import { FormFieldMappingResult, ValidationResult } from '@/types/formFields';

interface UseFormFieldMappingProps {
  formType: string;
  documentData?: Record<string, any>;
}

interface UseFormFieldMappingResult {
  mappedFields: Record<string, any>;
  mappingResult: FormFieldMappingResult | null;
  validationResult: ValidationResult | null;
  isValidating: boolean;
  validationErrors: Array<{
    field: string;
    message: string;
    severity: string;
    regulation?: string;
  }>;
  validationWarnings: Array<{
    field: string;
    message: string;
    severity: string;
    regulation?: string;
  }>;
  hasErrors: boolean;
  hasWarnings: boolean;
}

/**
 * Hook for mapping and validating form fields
 */
export const useFormFieldMapping = ({
  formType,
  documentData = {}
}: UseFormFieldMappingProps): UseFormFieldMappingResult => {
  const [mappedFields, setMappedFields] = useState<Record<string, any>>({});
  const [mappingResult, setMappingResult] = useState<FormFieldMappingResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!formType || Object.keys(documentData).length === 0) {
      return;
    }

    setIsValidating(true);

    try {
      // Map fields based on form type and document data
      const result = mapFormFields(formType, documentData);
      setMappingResult(result);
      setMappedFields(result.mappedFields);

      // Validate the mapped fields
      const validationResults = validateForm(formType, result.mappedFields);
      setValidationResult(validationResults);
    } catch (error) {
      console.error('Error during form field mapping:', error);
    } finally {
      setIsValidating(false);
    }
  }, [formType, documentData]);

  const validationErrors = validationResult?.errors || [];
  const validationWarnings = validationResult?.warnings || [];
  const hasErrors = validationErrors.length > 0;
  const hasWarnings = validationWarnings.length > 0;

  return {
    mappedFields,
    mappingResult,
    validationResult,
    isValidating,
    validationErrors,
    validationWarnings,
    hasErrors,
    hasWarnings
  };
};
