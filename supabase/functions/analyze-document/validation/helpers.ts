import { FormField } from '../types.ts';
import { ValidationError, ComplianceResult } from './types.ts';
import { validationPatterns } from './patterns.ts';

export function validateDate(fieldName: string, value: string, results: ValidationError[]) {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    results.push({
      field: fieldName,
      type: 'error',
      message: 'Invalid date format',
      code: 'INVALID_DATE'
    });
  } else if (date > new Date()) {
    results.push({
      field: fieldName,
      type: 'warning',
      message: 'Future date detected',
      code: 'FUTURE_DATE',
      context: { date }
    });
  }
}

export function validateCurrency(fieldName: string, value: string, results: ValidationError[]) {
  if (!new RegExp(validationPatterns.currencyAmount).test(value)) {
    results.push({
      field: fieldName,
      type: 'error',
      message: 'Invalid currency format',
      code: 'INVALID_CURRENCY'
    });
  } else {
    const amount = parseFloat(value.replace(/[$,]/g, ''));
    if (amount > 1000000) {
      results.push({
        field: fieldName,
        type: 'warning',
        message: 'Unusually large amount',
        code: 'LARGE_AMOUNT',
        context: { amount }
      });
    }
  }
}

export function validateText(fieldName: string, value: string, pattern: string | undefined, results: ValidationError[]) {
  if (pattern && !new RegExp(pattern).test(value)) {
    results.push({
      field: fieldName,
      type: 'error',
      message: 'Invalid format',
      code: 'INVALID_FORMAT',
      context: { pattern }
    });
  }
}

export function checkRegulationCompliance(field: FormField, value: any, results: ValidationError[]) {
  Object.entries(field.regulatoryReferences || {}).forEach(([framework, sections]) => {
    sections.forEach(section => {
      const result = checkFrameworkCompliance(framework, section, field.type, value);
      if (!result.compliant) {
        results.push({
          field: field.name,
          type: 'regulatory',
          message: result.message,
          code: `${framework.toUpperCase()}_COMPLIANCE`,
          regulation: { framework, section }
        });
      }
    });
  });
}

export function checkFrameworkCompliance(
  framework: string,
  section: string,
  fieldType: string,
  value: any
): ComplianceResult {
  // Implementation of compliance checks
  return { compliant: true, message: 'Compliant' };
}

export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}
