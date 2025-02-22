
interface FormConfig {
  number: string;
  title: string;
  description: string;
  riskFactors: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    regulation?: string;
    impact: string;
    requiredAction: string;
    solution: string;
  }>;
}

export const FORM_CONFIGS: Record<string, FormConfig> = {
  '66': {
    number: '66',
    title: 'Notice to Bankrupt of Meeting of Creditors',
    description: 'Official notice for scheduling a meeting of creditors in bankruptcy proceedings',
    riskFactors: [
      {
        type: 'Deadline Risk',
        description: 'Meeting must be held within specified timeframe',
        severity: 'high',
        regulation: 'BIA Section 102(1)',
        impact: 'Missing deadline could delay proceedings',
        requiredAction: 'Schedule meeting within required timeframe',
        solution: 'Set up automated reminders and tracking'
      }
    ]
  },
  '35': {
    number: '35',
    title: 'Certificate of Assignment',
    description: 'Official certification of bankruptcy assignment',
    riskFactors: [
      {
        type: 'Documentation Risk',
        description: 'All required signatures and information must be present',
        severity: 'high',
        impact: 'Invalid assignment if incomplete',
        requiredAction: 'Verify all required fields and signatures',
        solution: 'Implement document verification checklist'
      }
    ]
  },
  '47': {
    number: '47',
    title: 'Consumer Proposal',
    description: 'Proposal to creditors for debt restructuring',
    riskFactors: [
      {
        type: 'Compliance Risk',
        description: 'Proposal must meet all regulatory requirements',
        severity: 'high',
        regulation: 'BIA Consumer Proposal Regulations',
        impact: 'Proposal may be rejected if non-compliant',
        requiredAction: 'Review proposal against requirements',
        solution: 'Use compliance checklist and seek legal review'
      }
    ]
  }
};

export function identifyForm(text: string): string | null {
  const formMatches = text.match(/FORM (\d+)|Form (\d+)/);
  if (formMatches) {
    const formNumber = formMatches[1] || formMatches[2];
    return formNumber;
  }
  return null;
}
