
interface CrossValidationRule {
  sourceField: string;
  targetField: string;
  type: 'date' | 'amount' | 'percentage' | 'text';
  operation: 'before' | 'after' | 'greater' | 'lesser' | 'equal' | 'contains' | 'matches';
  tolerance?: number;
  errorMessage: string;
}

export const validateCrossFields = (
  document: Record<string, any>,
  rules: CrossValidationRule[]
): Array<{ field: string; error: string }> => {
  return rules.reduce((errors, rule) => {
    const sourceValue = document[rule.sourceField];
    const targetValue = document[rule.targetField];

    if (!sourceValue || !targetValue) {
      return errors;
    }

    let isValid = true;
    switch (rule.type) {
      case 'date':
        const sourceDate = new Date(sourceValue);
        const targetDate = new Date(targetValue);
        isValid = validateDateComparison(sourceDate, targetDate, rule.operation);
        break;

      case 'amount':
        isValid = validateAmountComparison(
          Number(sourceValue),
          Number(targetValue),
          rule.operation,
          rule.tolerance
        );
        break;

      case 'percentage':
        isValid = validatePercentageComparison(
          Number(sourceValue),
          Number(targetValue),
          rule.operation,
          rule.tolerance
        );
        break;

      case 'text':
        isValid = validateTextComparison(
          String(sourceValue),
          String(targetValue),
          rule.operation
        );
        break;
    }

    if (!isValid) {
      errors.push({
        field: rule.sourceField,
        error: rule.errorMessage
      });
    }

    return errors;
  }, [] as Array<{ field: string; error: string }>);
};

const validateDateComparison = (
  source: Date,
  target: Date,
  operation: string
): boolean => {
  switch (operation) {
    case 'before':
      return source < target;
    case 'after':
      return source > target;
    case 'equal':
      return source.getTime() === target.getTime();
    default:
      return false;
  }
};

const validateAmountComparison = (
  source: number,
  target: number,
  operation: string,
  tolerance = 0
): boolean => {
  const diff = Math.abs(source - target);
  switch (operation) {
    case 'greater':
      return source > target;
    case 'lesser':
      return source < target;
    case 'equal':
      return diff <= tolerance;
    default:
      return false;
  }
};

const validatePercentageComparison = (
  source: number,
  target: number,
  operation: string,
  tolerance = 0.01
): boolean => {
  const percentage = (source / target) * 100;
  switch (operation) {
    case 'greater':
      return percentage > (100 + tolerance);
    case 'lesser':
      return percentage < (100 - tolerance);
    case 'equal':
      return Math.abs(percentage - 100) <= tolerance;
    default:
      return false;
  }
};

const validateTextComparison = (
  source: string,
  target: string,
  operation: string
): boolean => {
  switch (operation) {
    case 'contains':
      return source.includes(target);
    case 'matches':
      return source === target;
    default:
      return false;
  }
};
