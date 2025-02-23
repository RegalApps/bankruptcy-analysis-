
interface RiskThreshold {
  type: 'percentage' | 'absolute' | 'days' | 'ratio';
  value: number;
  comparison: 'minimum' | 'maximum' | 'exact' | 'range';
  baseline?: string;
  rangeMin?: number;
  rangeMax?: number;
}

interface RiskPattern {
  type: 'financial' | 'compliance' | 'legal' | 'operational';
  severity: 'low' | 'medium' | 'high';
  threshold: RiskThreshold;
  description: string;
  mitigation?: string;
  regulation?: string;
}

export const validateFinancialRiskPattern = (
  value: number,
  pattern: RiskPattern,
  baselineValue?: number
): boolean => {
  const { threshold } = pattern;

  if (threshold.type === 'percentage' && baselineValue) {
    const percentage = (value / baselineValue) * 100;
    switch (threshold.comparison) {
      case 'minimum':
        return percentage >= threshold.value;
      case 'maximum':
        return percentage <= threshold.value;
      case 'exact':
        return Math.abs(percentage - threshold.value) < 0.1;
      case 'range':
        return percentage >= (threshold.rangeMin || 0) && 
               percentage <= (threshold.rangeMax || 100);
    }
  }

  if (threshold.type === 'absolute') {
    switch (threshold.comparison) {
      case 'minimum':
        return value >= threshold.value;
      case 'maximum':
        return value <= threshold.value;
      case 'exact':
        return Math.abs(value - threshold.value) < 0.01;
      case 'range':
        return value >= (threshold.rangeMin || 0) && 
               value <= (threshold.rangeMax || Infinity);
    }
  }

  return false;
};

export const validateCompliancePattern = (
  value: Date,
  pattern: RiskPattern,
  baselineDate?: Date
): boolean => {
  if (!baselineDate) return false;

  const { threshold } = pattern;
  const daysDiff = Math.floor((value.getTime() - baselineDate.getTime()) / (1000 * 60 * 60 * 24));

  if (threshold.type === 'days') {
    switch (threshold.comparison) {
      case 'minimum':
        return daysDiff >= threshold.value;
      case 'maximum':
        return daysDiff <= threshold.value;
      case 'exact':
        return daysDiff === threshold.value;
      case 'range':
        return daysDiff >= (threshold.rangeMin || 0) && 
               daysDiff <= (threshold.rangeMax || Infinity);
    }
  }

  return false;
};

export const generateRiskReport = (
  patterns: RiskPattern[],
  values: Record<string, any>
): {
  overallRisk: 'low' | 'medium' | 'high';
  details: Array<{
    description: string;
    status: 'passed' | 'failed';
    severity: 'low' | 'medium' | 'high';
    mitigation?: string;
  }>;
} => {
  const results = patterns.map(pattern => {
    const value = values[pattern.threshold.baseline || ''];
    const baselineValue = values[pattern.threshold.baseline || ''];
    
    let status: 'passed' | 'failed';
    
    if (pattern.type === 'financial') {
      status = validateFinancialRiskPattern(value, pattern, baselineValue) ? 'passed' : 'failed';
    } else if (pattern.type === 'compliance') {
      status = validateCompliancePattern(new Date(value), pattern, new Date(baselineValue)) 
        ? 'passed' 
        : 'failed';
    } else {
      status = 'failed';
    }

    return {
      description: pattern.description,
      status,
      severity: pattern.severity,
      mitigation: pattern.mitigation
    };
  });

  const severityScores = {
    low: 1,
    medium: 2,
    high: 3
  };

  const maxSeverity = results.reduce((max, result) => {
    return result.status === 'failed' && 
           severityScores[result.severity] > severityScores[max] ? 
           result.severity : max;
  }, 'low' as 'low' | 'medium' | 'high');

  return {
    overallRisk: maxSeverity,
    details: results
  };
};
