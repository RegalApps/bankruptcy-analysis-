
export interface FormConfig {
  number: string;
  title: string;
  description: string;
  riskFactors: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    regulation?: string;
    impact?: string;
    requiredAction?: string;
    solution?: string;
  }[];
}

export const FORM_CONFIGS: Record<string, FormConfig> = {
  "33": {
    number: "33",
    title: "Notice of Intention to Enforce Security",
    description: "A secured creditor who intends to enforce a security on all or substantially all of the inventory, accounts receivable or other property of an insolvent person, must send this notice to the insolvent person at least 10 days before enforcing the security.",
    riskFactors: [
      {
        type: "Enforcement Timeline",
        description: "Security enforcement before 10-day notice period expiry",
        severity: "high",
        regulation: "Section 244(1) of the Bankruptcy and Insolvency Act",
        impact: "Invalid enforcement action, potential liability for creditor",
        requiredAction: "Ensure 10-day notice period has elapsed before enforcing security",
        solution: "Implement compliance tracking for notice periods"
      },
      {
        type: "Property Description",
        description: "Inadequate or incorrect description of secured property",
        severity: "medium",
        regulation: "Section 244(2) of the Bankruptcy and Insolvency Act",
        impact: "Challenges to enforcement validity, procedural delays",
        requiredAction: "Verify and accurately describe all secured property",
        solution: "Detailed inventory review and documentation"
      }
    ]
  },
  "66": {
    number: "66",
    title: "Notice to Bankrupt of Meeting of Creditors",
    description: "This form is used to notify the bankrupt individual of a meeting of creditors, where creditors will discuss the bankruptcy estate and may give directions to the trustee.",
    riskFactors: [
      {
        type: "Meeting Notice Timeline",
        description: "Insufficient notice period for creditors meeting",
        severity: "high",
        regulation: "Section 102(1) of the Bankruptcy and Insolvency Act",
        impact: "Invalid meeting, potential procedural challenges",
        requiredAction: "Ensure proper notice period is given",
        solution: "Set up automated notification system with proper timelines"
      }
    ]
  }
  // ... Additional forms can be added here
};

export const identifyForm = (text: string): string | null => {
  // Clean and standardize the text
  const cleanText = text.toLowerCase().replace(/\s+/g, ' ');
  
  // Look for form numbers in the text
  for (const [formNumber, config] of Object.entries(FORM_CONFIGS)) {
    const formRegex = new RegExp(`\\b(form|forms)\\s*(#|no\\.?|number)?\\s*${formNumber}\\b`, 'i');
    if (formRegex.test(text)) {
      return formNumber;
    }
  }
  
  return null;
};
