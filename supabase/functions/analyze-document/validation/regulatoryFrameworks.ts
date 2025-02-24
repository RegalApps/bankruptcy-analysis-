
interface RegulatoryReference {
  act: string;
  section: string;
  description: string;
  requirements: string[];
  validationRules: RegExp[];
}

// Comprehensive regulatory framework mappings
export const regulatoryFramework = {
  BIA: {
    name: "Bankruptcy and Insolvency Act",
    code: "B-3",
    url: "https://laws-lois.justice.gc.ca/eng/acts/B-3/",
    sections: {
      "43(1)": {
        description: "Filing of bankruptcy application",
        requirements: [
          "Debtor resides or carries business in Canada",
          "Debts of $1000 or more",
          "Committed act of bankruptcy within 6 months"
        ],
        validationRules: [
          /residing.*Canada|business.*Canada/i,
          /(\$|CAD)\s*[1-9]\d{3,}/,
          /bankruptcy.*(\d{1,2}\s*(month|months))/i
        ]
      }
      // ... additional sections
    }
  },
  WEPPA: {
    name: "Wage Earner Protection Program Act",
    code: "W-0.8",
    url: "https://laws-lois.justice.gc.ca/eng/acts/W-0.8/",
    sections: {
      // Wage earner protection sections
    }
  },
  CCAA: {
    name: "Companies' Creditors Arrangement Act",
    code: "C-36",
    url: "https://laws-lois.justice.gc.ca/eng/acts/C-36/",
    sections: {
      // CCAA specific sections
    }
  }
};

export const validateComplianceRequirements = (
  formNumber: string,
  content: string
): ComplianceValidationResult => {
  const results: ComplianceValidationResult = {
    isCompliant: true,
    violations: [],
    warnings: [],
    references: []
  };

  // Get relevant regulatory requirements for the form
  const requirements = getFormRegulationRequirements(formNumber);
  
  requirements.forEach(req => {
    const isValid = validateRequirement(content, req);
    if (!isValid) {
      results.isCompliant = false;
      results.violations.push({
        requirement: req.description,
        act: req.act,
        section: req.section,
        severity: "high"
      });
    }
  });

  return results;
};

interface ComplianceViolation {
  requirement: string;
  act: string;
  section: string;
  severity: "low" | "medium" | "high";
}

interface ComplianceValidationResult {
  isCompliant: boolean;
  violations: ComplianceViolation[];
  warnings: string[];
  references: string[];
}

const validateRequirement = (content: string, requirement: RegulatoryReference): boolean => {
  return requirement.validationRules.some(rule => rule.test(content));
};
