
import { FormDefinition, FormFieldMappingResult, ValidationResult } from "@/types/formFields";
import { Form31Definition } from "@/forms/Form31Definition";
import { Form47Definition } from "@/forms/Form47Definition";
import logger from "@/utils/logger";

/**
 * Maps extracted form data to specific form fields and validates them
 * @param formType The type of form (e.g., 'form-31', 'form-47')
 * @param extractedData Data extracted from the document
 * @returns Mapped field data and validation results
 */
export const mapFormFields = (
  formType: string,
  extractedData: Record<string, any>
): FormFieldMappingResult => {
  // Get the form definition based on formType
  const formDefinition = getFormDefinition(formType);
  
  if (!formDefinition) {
    logger.warn(`No form definition found for form type: ${formType}`);
    return {
      mappedFields: {},
      missingRequiredFields: [],
      validationIssues: [{
        field: "formType",
        message: `Unsupported form type: ${formType}`,
        severity: "high"
      }]
    };
  }
  
  // Initialize result object
  const result: FormFieldMappingResult = {
    mappedFields: {},
    missingRequiredFields: [],
    validationIssues: []
  };
  
  // Flatten the form fields
  const allFields = formDefinition.sections.flatMap(section => section.fields);
  
  // Process each field
  allFields.forEach(field => {
    const fieldName = field.name;
    const fieldValue = extractedData[fieldName];
    
    // Map the field value
    result.mappedFields[fieldName] = fieldValue;
    
    // Check for required fields
    if (field.required && !fieldValue) {
      result.missingRequiredFields.push(fieldName);
      result.validationIssues.push({
        field: fieldName,
        message: `Required field "${field.label}" is missing`,
        severity: "critical"
      });
    }
    
    // Apply validation rules
    if (field.validationRules && fieldValue !== undefined) {
      field.validationRules.forEach(rule => {
        const isValid = rule.validate(fieldValue, extractedData);
        if (!isValid) {
          result.validationIssues.push({
            field: fieldName,
            message: rule.message,
            severity: rule.severity
          });
        }
      });
    }
  });
  
  // Apply form-level validation rules
  if (formDefinition.validationRules) {
    formDefinition.validationRules.forEach(validationRule => {
      const validationResult = validationRule(extractedData);
      if (!validationResult.valid) {
        result.validationIssues.push({
          field: "form",
          message: validationResult.message,
          severity: validationResult.severity
        });
      }
    });
  }
  
  return result;
};

/**
 * Validates a complete form against its definition
 * @param formType The type of form
 * @param formData The form data to validate
 * @returns Validation results
 */
export const validateForm = (
  formType: string,
  formData: Record<string, any>
): ValidationResult => {
  const formDefinition = getFormDefinition(formType);
  
  if (!formDefinition) {
    return {
      valid: false,
      errors: [{
        field: "formType",
        message: `Unsupported form type: ${formType}`,
        severity: "critical"
      }],
      warnings: []
    };
  }
  
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];
  
  // Validate against field validation rules
  formDefinition.sections.forEach(section => {
    section.fields.forEach(field => {
      // Skip validation if field is conditional and condition is not met
      if (field.condition) {
        const conditionField = field.condition.field;
        const conditionValue = field.condition.value;
        const actualValue = formData[conditionField];
        
        if (field.condition.operator === 'notEquals' && actualValue === conditionValue) {
          return;
        } else if (!field.condition.operator && actualValue !== conditionValue) {
          return;
        }
      }
      
      const fieldValue = formData[field.name];
      
      // Check required fields
      if (field.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
        errors.push({
          field: field.name,
          message: `Required field "${field.label}" is missing`,
          severity: "critical",
          regulation: field.metadata?.legalSchema
        });
      }
      
      // Apply field validation rules
      if (field.validationRules && fieldValue !== undefined) {
        field.validationRules.forEach(rule => {
          const isValid = rule.validate(fieldValue, formData);
          if (!isValid) {
            if (rule.severity === 'high' || rule.severity === 'critical') {
              errors.push({
                field: field.name,
                message: rule.message,
                severity: rule.severity,
                regulation: rule.regulation
              });
            } else {
              warnings.push({
                field: field.name,
                message: rule.message,
                severity: rule.severity,
                regulation: rule.regulation
              });
            }
          }
        });
      }
    });
  });
  
  // Apply form-level validation rules
  if (formDefinition.validationRules) {
    formDefinition.validationRules.forEach(validationRule => {
      const result = validationRule(formData);
      if (!result.valid) {
        if (result.severity === 'high' || result.severity === 'critical') {
          errors.push({
            field: "form",
            message: result.message,
            severity: result.severity
          });
        } else {
          warnings.push({
            field: "form",
            message: result.message,
            severity: result.severity
          });
        }
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Gets a form definition by type
 * @param formType The form type or number
 * @returns The form definition or undefined if not found
 */
export const getFormDefinition = (formType: string): FormDefinition | undefined => {
  // Normalize form type
  const normalizedType = formType.toLowerCase();
  
  // Handle common variations of form type names
  if (normalizedType === 'form-31' || 
      normalizedType === 'form31' || 
      normalizedType === '31' || 
      normalizedType === 'proof of claim' ||
      normalizedType.includes('proof_of_claim')) {
    return Form31Definition;
  }
  
  if (normalizedType === 'form-47' || 
      normalizedType === 'form47' || 
      normalizedType === '47' || 
      normalizedType === 'consumer proposal' ||
      normalizedType.includes('consumer_proposal')) {
    return Form47Definition;
  }
  
  logger.warn(`Unknown form type: ${formType}`);
  return undefined;
};

/**
 * Gets risk indicators for a specific field
 * @param formType The form type
 * @param fieldName The field name
 * @returns Risk indicators array or undefined if not found
 */
export const getFieldRiskIndicators = (
  formType: string,
  fieldName: string
): string[] | undefined => {
  const formDefinition = getFormDefinition(formType);
  if (!formDefinition) return undefined;
  
  // Find the field in the form definition
  for (const section of formDefinition.sections) {
    const field = section.fields.find(f => f.name === fieldName);
    if (field && field.metadata?.riskIndicators) {
      return field.metadata.riskIndicators;
    }
  }
  
  return undefined;
};

/**
 * Gets legal schema reference for a specific field
 * @param formType The form type
 * @param fieldName The field name
 * @returns Legal schema reference or undefined if not found
 */
export const getFieldLegalSchema = (
  formType: string,
  fieldName: string
): string | undefined => {
  const formDefinition = getFormDefinition(formType);
  if (!formDefinition) return undefined;
  
  // Find the field in the form definition
  for (const section of formDefinition.sections) {
    const field = section.fields.find(f => f.name === fieldName);
    if (field && field.metadata?.legalSchema) {
      return field.metadata.legalSchema;
    }
  }
  
  return undefined;
};
