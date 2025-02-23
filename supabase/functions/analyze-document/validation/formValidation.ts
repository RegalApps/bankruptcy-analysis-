
import { ValidationError } from "../types.ts";

export function validateFinancialRisk(value: any, indicator: any, errors: ValidationError[]) {
  if (indicator.field.includes('cashFlow') && parseFloat(value) < 0) {
    errors.push({
      field: indicator.field,
      type: 'warning',
      message: 'Negative cash flow detected',
      code: 'NEGATIVE_CASH_FLOW'
    });
  }
}

export function validateComplianceRisk(value: any, indicator: any, errors: ValidationError[]) {
  if (indicator.field.includes('Date')) {
    const date = new Date(value);
    const today = new Date();
    if (date < today) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: 'Past due date detected',
        code: 'PAST_DUE_DATE'
      });
    }
  }
}

export function validateLegalRisk(value: any, indicator: any, errors: ValidationError[]) {
  if (indicator.field.includes('court') || indicator.field.includes('order')) {
    if (!value || value.length < 10) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: 'Insufficient legal documentation',
        code: 'INSUFFICIENT_LEGAL_DOC'
      });
    }
  }
}

export function validateOperationalRisk(value: any, indicator: any, errors: ValidationError[]) {
  if (indicator.field.includes('process') || indicator.field.includes('procedure')) {
    if (!value || value.length < 50) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: 'Incomplete process documentation',
        code: 'INCOMPLETE_PROCESS_DOC'
      });
    }
  }
}
