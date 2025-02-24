
import { regulatoryFramework } from './regulatoryFrameworks';

interface RiskFactor {
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulatoryReference?: string;
}

export const performRiskAnalysis = async (
  content: string,
  extractedData: Record<string, any>,
  formNumber: string
) => {
  const risks: RiskFactor[] = [];
  
  // Financial Risk Analysis
  await analyzeFinancialRisks(extractedData, risks);
  
  // Compliance Risk Analysis
  await analyzeComplianceRisks(content, formNumber, risks);
  
  // Legal Risk Analysis
  await analyzeLegalRisks(content, extractedData, risks);
  
  // Document Integrity Risks
  await analyzeDocumentIntegrity(content, extractedData, risks);

  return {
    risks,
    riskScore: calculateRiskScore(risks),
    recommendations: generateRiskRecommendations(risks)
  };
};

const analyzeFinancialRisks = async (
  extractedData: Record<string, any>,
  risks: RiskFactor[]
) => {
  // Analyze financial data points
  if (extractedData.totalDebt && extractedData.totalIncome) {
    const debtToIncomeRatio = parseFloat(extractedData.totalDebt) / parseFloat(extractedData.totalIncome);
    
    if (debtToIncomeRatio > 0.8) {
      risks.push({
        category: 'financial',
        description: 'High debt-to-income ratio detected',
        severity: 'high',
        regulatoryReference: 'BIA Section 43(1)'
      });
    }
  }
};

const analyzeComplianceRisks = async (
  content: string,
  formNumber: string,
  risks: RiskFactor[]
) => {
  // Check for regulatory compliance issues
  const biaRequirements = regulatoryFramework.BIA.sections;
  
  for (const [section, requirements] of Object.entries(biaRequirements)) {
    const hasCompliance = requirements.validationRules.some(rule => rule.test(content));
    
    if (!hasCompliance) {
      risks.push({
        category: 'compliance',
        description: `Non-compliance with BIA ${section}: ${requirements.description}`,
        severity: 'high',
        regulatoryReference: `BIA ${section}`
      });
    }
  }
};

const analyzeLegalRisks = async (
  content: string,
  extractedData: Record<string, any>,
  risks: RiskFactor[]
) => {
  // Analyze legal requirements and potential issues
  const legalChecks = [
    {
      pattern: /fraud|misrepresentation|concealment/i,
      description: 'Potential fraudulent activity indicators',
      reference: 'BIA Section 198'
    },
    {
      pattern: /undisclosed.*assets|hidden.*property/i,
      description: 'Potential undisclosed assets',
      reference: 'BIA Section 199'
    }
  ];

  legalChecks.forEach(check => {
    if (check.pattern.test(content)) {
      risks.push({
        category: 'legal',
        description: check.description,
        severity: 'high',
        regulatoryReference: check.reference
      });
    }
  });
};

const analyzeDocumentIntegrity = async (
  content: string,
  extractedData: Record<string, any>,
  risks: RiskFactor[]
) => {
  // Check document completeness and integrity
  const requiredSections = [
    'personal information',
    'financial statements',
    'creditor information'
  ];

  requiredSections.forEach(section => {
    if (!content.toLowerCase().includes(section)) {
      risks.push({
        category: 'document',
        description: `Missing required section: ${section}`,
        severity: 'medium'
      });
    }
  });
};

const calculateRiskScore = (risks: RiskFactor[]): number => {
  const weights = {
    high: 3,
    medium: 2,
    low: 1
  };

  const totalWeight = risks.reduce((sum, risk) => sum + weights[risk.severity], 0);
  return Math.min(100, (totalWeight / (risks.length * 3)) * 100);
};

const generateRiskRecommendations = (risks: RiskFactor[]): string[] => {
  const recommendations: string[] = [];
  
  // Generate specific recommendations based on identified risks
  risks.forEach(risk => {
    switch (risk.category) {
      case 'financial':
        recommendations.push(`Review and verify financial information: ${risk.description}`);
        break;
      case 'compliance':
        recommendations.push(`Ensure compliance with ${risk.regulatoryReference}: ${risk.description}`);
        break;
      case 'legal':
        recommendations.push(`Legal review required: ${risk.description}`);
        break;
      case 'document':
        recommendations.push(`Document completion required: ${risk.description}`);
        break;
    }
  });

  return recommendations;
};
