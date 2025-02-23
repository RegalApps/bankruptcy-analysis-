
import { Risk, ValidationError } from "../types.ts";

interface RiskThreshold {
  type: 'amount' | 'percentage' | 'ratio' | 'time';
  value: number;
  comparison: 'minimum' | 'maximum' | 'exact';
  baseline?: number | Date;
}

interface RiskPattern {
  severity: 'low' | 'medium' | 'high';
  indicators: string[];
  thresholds: RiskThreshold[];
}

export class RiskAnalyzer {
  private patterns: Record<string, RiskPattern[]>;

  constructor() {
    this.patterns = {
      financial: [
        {
          severity: 'high',
          indicators: [
            'insufficient funds',
            'significant loss',
            'major deficiency'
          ],
          thresholds: [
            {
              type: 'amount',
              value: 100000,
              comparison: 'maximum'
            },
            {
              type: 'percentage',
              value: 75,
              comparison: 'maximum'
            }
          ]
        }
      ],
      compliance: [
        {
          severity: 'high',
          indicators: [
            'deadline breach',
            'missing documentation',
            'regulatory violation'
          ],
          thresholds: [
            {
              type: 'time',
              value: 30,
              comparison: 'maximum'
            }
          ]
        }
      ],
      legal: [
        {
          severity: 'high',
          indicators: [
            'court order breach',
            'statutory violation',
            'legal non-compliance'
          ],
          thresholds: [
            {
              type: 'time',
              value: 15,
              comparison: 'maximum'
            }
          ]
        }
      ]
    };
  }

  public analyzeRisks(
    document: Record<string, any>,
    fieldConfig: Record<string, any>
  ): Risk[] {
    const risks: Risk[] = [];

    // Financial risk analysis
    this.analyzeFinancialRisks(document, fieldConfig, risks);

    // Compliance risk analysis
    this.analyzeComplianceRisks(document, fieldConfig, risks);

    // Legal risk analysis
    this.analyzeLegalRisks(document, fieldConfig, risks);

    return risks;
  }

  private analyzeFinancialRisks(
    document: Record<string, any>,
    fieldConfig: Record<string, any>,
    risks: Risk[]
  ): void {
    const financialFields = fieldConfig.monetaryFields || [];
    financialFields.forEach(field => {
      const value = document[field];
      if (typeof value === 'number') {
        this.patterns.financial.forEach(pattern => {
          pattern.thresholds.forEach(threshold => {
            if (this.isThresholdExceeded(value, threshold)) {
              risks.push({
                type: 'financial',
                severity: pattern.severity,
                description: `Financial risk detected in ${field}`,
                impact: `Threshold of ${threshold.value} ${threshold.comparison}`,
                requiredAction: `Review and adjust ${field} values`
              });
            }
          });
        });
      }
    });
  }

  private analyzeComplianceRisks(
    document: Record<string, any>,
    fieldConfig: Record<string, any>,
    risks: Risk[]
  ): void {
    const complianceFields = fieldConfig.keyDates || [];
    complianceFields.forEach(field => {
      const value = document[field];
      if (value instanceof Date) {
        this.patterns.compliance.forEach(pattern => {
          pattern.thresholds.forEach(threshold => {
            if (this.isDateThresholdExceeded(value, threshold)) {
              risks.push({
                type: 'compliance',
                severity: pattern.severity,
                description: `Compliance risk detected for ${field}`,
                impact: `Time threshold of ${threshold.value} days ${threshold.comparison}`,
                requiredAction: `Review and adjust ${field} timeline`
              });
            }
          });
        });
      }
    });
  }

  private analyzeLegalRisks(
    document: Record<string, any>,
    fieldConfig: Record<string, any>,
    risks: Risk[]
  ): void {
    const legalFields = fieldConfig.requiredFields || [];
    legalFields.forEach(field => {
      if (!document[field.name] && field.required) {
        risks.push({
          type: 'legal',
          severity: 'high',
          description: `Required field ${field.name} is missing`,
          impact: 'Legal compliance affected',
          requiredAction: `Provide required information for ${field.name}`
        });
      }
    });
  }

  private isThresholdExceeded(
    value: number,
    threshold: RiskThreshold
  ): boolean {
    switch (threshold.comparison) {
      case 'minimum':
        return value < threshold.value;
      case 'maximum':
        return value > threshold.value;
      case 'exact':
        return Math.abs(value - threshold.value) > 0.01;
      default:
        return false;
    }
  }

  private isDateThresholdExceeded(
    date: Date,
    threshold: RiskThreshold
  ): boolean {
    if (threshold.type !== 'time' || !threshold.baseline) {
      return false;
    }

    const diffDays = Math.abs(
      (date.getTime() - (threshold.baseline as Date).getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (threshold.comparison) {
      case 'minimum':
        return diffDays < threshold.value;
      case 'maximum':
        return diffDays > threshold.value;
      case 'exact':
        return Math.abs(diffDays - threshold.value) > 1;
      default:
        return false;
    }
  }
}
