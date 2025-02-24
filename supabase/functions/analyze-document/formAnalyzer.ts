
import { FormConfig, getFormConfig } from './formConfig';
import { OSBFormTemplate } from './types';
import { bankruptcyForms } from './templates/bankruptcyForms';
import { proposalForms } from './templates/proposalForms';
import { validationPatterns, customValidators } from './validation/patterns';
import { validateFormField } from './validation/formValidation';

export async function analyzeForm(formNumber: string, content: string) {
  try {
    console.log(`Analyzing form ${formNumber}`);
    
    // Get form configuration and template
    const config = getFormConfig(formNumber);
    const template = getFormTemplate(formNumber);
    
    if (!template) {
      throw new Error(`No template found for form ${formNumber}`);
    }

    // Extract form fields
    const extractedFields = await extractFormFields(content, template);
    
    // Validate extracted fields
    const validationResults = validateFormFields(extractedFields, template, config);
    
    // Analyze risks
    const riskAssessment = assessRisks(extractedFields, template);
    
    // Generate summary
    const summary = generateFormSummary(formNumber, extractedFields, validationResults, riskAssessment);

    return {
      success: true,
      formNumber,
      extractedFields,
      validationResults,
      riskAssessment,
      summary
    };

  } catch (error) {
    console.error(`Error analyzing form ${formNumber}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

function getFormTemplate(formNumber: string): OSBFormTemplate | null {
  // Check all form template collections
  return bankruptcyForms[formNumber] || 
         proposalForms[formNumber] || 
         null;
}

async function extractFormFields(content: string, template: OSBFormTemplate) {
  const extractedFields: Record<string, any> = {};
  
  // Extract required fields based on template
  for (const field of template.requiredFields) {
    const fieldValue = await extractFieldValue(content, field.name);
    if (fieldValue) {
      extractedFields[field.name] = fieldValue;
    }
  }
  
  return extractedFields;
}

function validateFormFields(
  fields: Record<string, any>,
  template: OSBFormTemplate,
  config: FormConfig
) {
  const errors = [];
  
  // Validate required fields
  for (const field of template.requiredFields) {
    if (field.required && !fields[field.name]) {
      errors.push({
        field: field.name,
        type: 'error',
        message: `Required field ${field.name} is missing`,
        code: 'MISSING_REQUIRED_FIELD'
      });
    }
  }
  
  // Apply custom validation rules
  for (const [fieldName, value] of Object.entries(fields)) {
    if (config.validationRules[fieldName]) {
      const isValid = config.validationRules[fieldName](value);
      if (!isValid) {
        errors.push({
          field: fieldName,
          type: 'error',
          message: `Invalid value for ${fieldName}`,
          code: 'INVALID_FIELD_VALUE'
        });
      }
    }
  }
  
  return errors;
}

function assessRisks(
  fields: Record<string, any>,
  template: OSBFormTemplate
) {
  const risks = [];
  
  // Check risk indicators defined in template
  for (const indicator of template.riskIndicators || []) {
    const fieldValue = fields[indicator.field];
    if (fieldValue) {
      if (indicator.riskType === 'financial' && 
          typeof fieldValue === 'number' && 
          fieldValue > indicator.threshold) {
        risks.push({
          type: 'financial',
          severity: indicator.severity,
          description: `High financial value detected in ${indicator.field}`,
          value: fieldValue
        });
      }
    }
  }
  
  return risks;
}

async function extractFieldValue(content: string, fieldName: string): Promise<string | null> {
  // Use regex patterns to extract field values
  // This is a simplified version - in reality, you'd want more sophisticated extraction
  const patterns = {
    debtorName: /Debtor(?:'s)?\s+Name:\s*([^\n]+)/i,
    filingDate: /Filing\s+Date:\s*(\d{4}-\d{2}-\d{2})/i,
    amount: /Amount:\s*\$?([\d,]+\.?\d*)/i
  };

  const pattern = patterns[fieldName];
  if (!pattern) return null;

  const match = content.match(pattern);
  return match ? match[1].trim() : null;
}

function generateFormSummary(
  formNumber: string,
  fields: Record<string, any>,
  validationResults: any[],
  riskAssessment: any[]
) {
  return {
    formNumber,
    fieldsExtracted: Object.keys(fields).length,
    validationErrors: validationResults.length,
    risksIdentified: riskAssessment.length,
    status: validationResults.length === 0 ? 'valid' : 'needs_review'
  };
}
