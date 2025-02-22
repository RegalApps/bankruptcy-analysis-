
import { FormTemplate, FormField, ValidationRule } from "./types";
import { validationPatterns } from "./validation/patterns";
import { regulatoryFrameworks } from "./validation/regulatoryFrameworks";
import { crossValidationScenarios } from "./validation/crossValidation";
import { ValidationError } from "./validation/types";
import {
  validateDate,
  validateCurrency,
  validateText,
  checkRegulationCompliance
} from "./validation/helpers";

export const validateFormData = (formNumber: string, data: any) => {
  const template = formTemplates[formNumber];
  if (!template) {
    return {
      valid: false,
      errors: [{
        field: 'form',
        type: 'error',
        message: 'Invalid form number',
        code: 'INVALID_FORM'
      }],
      warnings: [],
      regulatoryIssues: []
    };
  }

  const validationResults: ValidationError[] = [];

  // Field-level validation
  template.requiredFields.forEach(field => {
    const value = data[field.name];
    
    if (field.required && !value) {
      validationResults.push({
        field: field.name,
        type: 'error',
        message: `${field.name} is required`,
        code: 'REQUIRED_FIELD'
      });
      return;
    }

    if (value) {
      // Type-specific validation
      switch (field.type) {
        case 'date':
          validateDate(field.name, value, validationResults);
          break;
        case 'currency':
          validateCurrency(field.name, value, validationResults);
          break;
        case 'text':
          validateText(field.name, value, field.pattern, validationResults);
          break;
      }

      // Regulatory compliance checks
      if (field.regulatoryReferences) {
        checkRegulationCompliance(field, value, validationResults);
      }
    }
  });

  // Cross-field validation
  const relevantRules = crossValidationScenarios[template.category] || [];
  relevantRules.forEach(rule => {
    const fieldValues = rule.fields.reduce((acc, field) => ({
      ...acc,
      [field]: data[field]
    }), {});

    const crossErrors = rule.validate(fieldValues);
    validationResults.push(...crossErrors);
  });

  // Categorize validation results
  const errors = validationResults.filter(r => r.type === 'error');
  const warnings = validationResults.filter(r => r.type === 'warning');
  const regulatoryIssues = validationResults.filter(r => r.type === 'regulatory');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    regulatoryIssues,
    details: validationResults
  };
};

// Mock formTemplates object (replace with your actual data)
const formTemplates: { [key: string]: FormTemplate } = {
  "Form 1": {
    formNumber: "Form 1",
    category: "bankruptcy",
    requiredFields: [
      { name: "totalAssets", type: "currency", required: true },
      { name: "totalLiabilities", type: "currency", required: true },
      { name: "monthlyIncome", type: "currency", required: true },
      { name: "monthlyExpenses", type: "currency", required: true },
      { name: "bankruptcyDate", type: "date", required: true },
      { name: "lastEmploymentDate", type: "date", required: true },
    ],
  },
  "Form 2": {
    formNumber: "Form 2",
    category: "proposal",
    requiredFields: [
      { name: "proposalAmount", type: "currency", required: true },
      { name: "totalDebt", type: "currency", required: true },
      { name: "monthlyPayment", type: "currency", required: true },
      { name: "proposalTerm", type: "text", required: true },
      { name: "securedDebt", type: "currency", required: true },
    ],
  },
};

export type {
  FormField,
  ValidationRule,
  ValidationError,
} from "./types";
