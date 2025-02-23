
import { ValidationRule, ValidationError } from "../types.ts";

export const validateFinancialRisk = (
  value: number,
  threshold: number,
  comparison: 'gt' | 'lt' | 'eq' | 'range',
  range?: { min: number; max: number }
): ValidationError | null => {
  if (comparison === 'range' && range) {
    if (value < range.min || value > range.max) {
      return {
        type: 'financial',
        message: `Value ${value} is outside acceptable range (${range.min}-${range.max})`,
        severity: 'high'
      };
    }
  } else if (comparison === 'gt' && value <= threshold) {
    return {
      type: 'financial',
      message: `Value ${value} is below minimum threshold ${threshold}`,
      severity: 'medium'
    };
  } else if (comparison === 'lt' && value >= threshold) {
    return {
      type: 'financial',
      message: `Value ${value} exceeds maximum threshold ${threshold}`,
      severity: 'high'
    };
  } else if (comparison === 'eq' && Math.abs(value - threshold) > 0.01) {
    return {
      type: 'financial',
      message: `Value ${value} does not match required amount ${threshold}`,
      severity: 'medium'
    };
  }
  return null;
};

export const validateComplianceRisk = (
  value: Date,
  threshold: Date,
  comparison: 'before' | 'after' | 'exact' | 'range',
  range?: { start: Date; end: Date }
): ValidationError | null => {
  if (comparison === 'range' && range) {
    if (value < range.start || value > range.end) {
      return {
        type: 'compliance',
        message: `Date ${value.toISOString()} is outside compliance window`,
        severity: 'high'
      };
    }
  } else if (comparison === 'before' && value >= threshold) {
    return {
      type: 'compliance',
      message: `Date ${value.toISOString()} is after deadline ${threshold.toISOString()}`,
      severity: 'high'
    };
  } else if (comparison === 'after' && value <= threshold) {
    return {
      type: 'compliance',
      message: `Date ${value.toISOString()} is before required date ${threshold.toISOString()}`,
      severity: 'medium'
    };
  } else if (comparison === 'exact' && value.getTime() !== threshold.getTime()) {
    return {
      type: 'compliance',
      message: `Date ${value.toISOString()} does not match required date ${threshold.toISOString()}`,
      severity: 'medium'
    };
  }
  return null;
};

export const validateLegalRisk = (
  document: any,
  rules: ValidationRule[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  rules.forEach(rule => {
    if (rule.required && !document[rule.field]) {
      errors.push({
        type: 'legal',
        message: `Required field ${rule.field} is missing`,
        severity: 'high'
      });
    }

    if (rule.pattern && document[rule.field] && 
        !rule.pattern.test(document[rule.field].toString())) {
      errors.push({
        type: 'legal',
        message: `Field ${rule.field} does not match required format`,
        severity: 'medium'
      });
    }

    if (rule.crossValidation) {
      const relatedValue = document[rule.crossValidation.relatedField];
      if (!rule.crossValidation.validate(document[rule.field], relatedValue)) {
        errors.push({
          type: 'legal',
          message: rule.crossValidation.errorMessage,
          severity: 'high'
        });
      }
    }
  });

  return errors;
};

export const validateOperationalRisk = (
  document: any,
  thresholds: Record<string, number>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  Object.entries(thresholds).forEach(([field, threshold]) => {
    const value = document[field];
    if (typeof value === 'number' && value > threshold) {
      errors.push({
        type: 'operational',
        message: `${field} exceeds operational threshold`,
        severity: 'medium'
      });
    }
  });

  return errors;
};
