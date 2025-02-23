
import { ValidationError } from "../types.ts";

export function validateFinancialRisk(value: any, indicator: any, errors: ValidationError[]) {
  if (indicator.threshold) {
    switch (indicator.threshold.type) {
      case 'percentage':
        const baselineValue = parseFloat(indicator.threshold.baseline) || 0;
        const currentValue = parseFloat(value);
        const percentageChange = ((currentValue - baselineValue) / baselineValue) * 100;
        
        if (indicator.threshold.comparison === 'increase' && 
            percentageChange > indicator.threshold.value) {
          errors.push({
            field: indicator.field,
            type: 'warning',
            message: `Unusual increase of ${percentageChange.toFixed(1)}% detected`,
            code: 'UNUSUAL_INCREASE'
          });
        }
        break;

      case 'ratio':
        const ratio = parseFloat(value);
        if (indicator.threshold.comparison === 'minimum' && 
            ratio < indicator.threshold.value) {
          errors.push({
            field: indicator.field,
            type: 'warning',
            message: `Ratio below minimum threshold of ${indicator.threshold.value}`,
            code: 'BELOW_THRESHOLD'
          });
        }
        break;
    }
  }

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
  if (indicator.threshold?.type === 'days') {
    const targetDate = new Date(value);
    const currentDate = new Date();
    const daysDifference = Math.floor((targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (indicator.threshold.comparison === 'minimum' && 
        daysDifference < indicator.threshold.value) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: `Critical deadline approaching: ${daysDifference} days remaining`,
        code: 'DEADLINE_APPROACHING'
      });
    }
  }

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

  // Enhanced legal risk validation for document completeness
  if (value && typeof value === 'string') {
    const requiredLegalTerms = ['court', 'order', 'pursuant to', 'hereby'];
    const missingTerms = requiredLegalTerms.filter(term => 
      !value.toLowerCase().includes(term)
    );

    if (missingTerms.length > 0) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: `Missing required legal terms: ${missingTerms.join(', ')}`,
        code: 'MISSING_LEGAL_TERMS'
      });
    }
  }
}

export function validateOperationalRisk(value: any, indicator: any, errors: ValidationError[]) {
  if (indicator.threshold?.type === 'ratio') {
    const ratio = parseFloat(value);
    if (indicator.threshold.comparison === 'minimum' && 
        ratio < indicator.threshold.value) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: `Operational metric below required threshold: ${ratio.toFixed(2)}`,
        code: 'OPERATIONAL_THRESHOLD'
      });
    }
  }

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

  // Enhanced operational risk validation
  if (value && typeof value === 'string') {
    const operationalKeywords = ['procedure', 'process', 'control', 'measure', 'monitor'];
    const foundKeywords = operationalKeywords.filter(keyword => 
      value.toLowerCase().includes(keyword)
    );

    if (foundKeywords.length < 2) {
      errors.push({
        field: indicator.field,
        type: 'warning',
        message: 'Insufficient operational control documentation',
        code: 'INSUFFICIENT_CONTROLS'
      });
    }
  }
}
