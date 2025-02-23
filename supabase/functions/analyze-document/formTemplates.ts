import { OSBFormTemplate, ValidationRule, ValidationError } from "./types.ts";
import { bankruptcyForms } from "./templates/bankruptcyForms.ts";
import { proposalForms } from "./templates/proposalForms.ts";
import { receivershipForms } from "./templates/receivershipForms.ts";
import { ccaaForms } from "./templates/ccaaForms.ts";
import { administrativeForms } from "./templates/administrativeForms.ts";
import { specializedForms } from "./templates/specializedForms.ts";
import {
  validateFinancialRisk,
  validateComplianceRisk,
  validateLegalRisk,
  validateOperationalRisk
} from "./validation/formValidation.ts";

// Combine all form templates
export const osbFormTemplates: Record<string, OSBFormTemplate> = {
  ...bankruptcyForms,
  ...proposalForms,
  ...receivershipForms,
  ...ccaaForms,
  ...administrativeForms,
  ...specializedForms
};

export function validateOSBForm(formNumber: string, data: any): ValidationError[] {
  const template = osbFormTemplates[formNumber];
  if (!template) {
    throw new Error(`No template found for form ${formNumber}`);
  }

  const errors: ValidationError[] = [];

  // Required field validation
  template.requiredFields.forEach(field => {
    if (field.required && !data[field.name]) {
      errors.push({
        field: field.name,
        type: 'error',
        message: `${field.name} is required for Form ${formNumber}`,
        code: 'REQUIRED_FIELD'
      });
    }
  });

  // Date validations
  template.keyDates.forEach(dateField => {
    if (data[dateField]) {
      const date = new Date(data[dateField]);
      if (isNaN(date.getTime())) {
        errors.push({
          field: dateField,
          type: 'error',
          message: `Invalid date format for ${dateField}`,
          code: 'INVALID_DATE'
        });
      }
    }
  });

  // Monetary field validations
  template.monetaryFields.forEach(moneyField => {
    if (data[moneyField]) {
      const amount = parseFloat(data[moneyField]);
      if (isNaN(amount) || amount < 0) {
        errors.push({
          field: moneyField,
          type: 'error',
          message: `Invalid monetary value for ${moneyField}`,
          code: 'INVALID_AMOUNT'
        });
      }
    }
  });

  // Risk analysis
  template.riskIndicators.forEach(indicator => {
    const value = data[indicator.field];
    if (value) {
      switch (indicator.riskType) {
        case 'financial':
          validateFinancialRisk(value, indicator, errors);
          break;
        case 'compliance':
          validateComplianceRisk(value, indicator, errors);
          break;
        case 'legal':
          validateLegalRisk(value, indicator, errors);
          break;
        case 'operational':
          validateOperationalRisk(value, indicator, errors);
          break;
      }
    }
  });

  return errors;
}

export type {
  OSBFormTemplate,
  ValidationRule
};
